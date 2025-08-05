import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Invite, InviteStatus, InviteRole } from '../entities/invite.entity';
import { ParishStaff, ParishStaffRole } from '../entities/parish-staff.entity';
import { Parish } from '../entities/parish.entity';
import { UserRole } from '../entities/user.entity';
import { CreateInviteDto } from './dto/create-invite.dto';
import { CreateCoordinatorInviteDto } from './dto/create-coordinator-invite.dto';
import { AcceptCoordinatorInviteDto } from './dto/accept-coordinator-invite.dto';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private invitesRepository: Repository<Invite>,
    @InjectRepository(ParishStaff)
    private parishStaffRepository: Repository<ParishStaff>,
    private usersService: UsersService,
  ) {}

  async create(createInviteDto: CreateInviteDto, createdByUserId: string): Promise<Invite> {
    // Verificar si ya existe una invitación pendiente para este email
    const existingInvite = await this.invitesRepository.findOne({
      where: {
        email: createInviteDto.email,
        status: InviteStatus.PENDING,
      },
    });

    if (existingInvite) {
      throw new BadRequestException('Ya existe una invitación pendiente para este correo electrónico');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(createInviteDto.email);
    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario registrado con este correo electrónico');
    }

    // Generar token único
    const token = this.generateInviteToken();
    
    // Expiración en 7 días
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = this.invitesRepository.create({
      ...createInviteDto,
      token,
      expiresAt,
      createdByUserId,
    });

    const savedInvite = await this.invitesRepository.save(invite);

    // TODO: Enviar email de invitación
    // await this.emailService.sendInvitationEmail(savedInvite);

    return this.findOne(savedInvite.id);
  }

  async findAll(dioceseId?: string): Promise<Invite[]> {
    const query = this.invitesRepository.createQueryBuilder('invite')
      .leftJoinAndSelect('invite.diocese', 'diocese')
      .leftJoinAndSelect('invite.parish', 'parish')
      .leftJoinAndSelect('invite.createdBy', 'createdBy')
      .leftJoinAndSelect('invite.acceptedBy', 'acceptedBy')
      .orderBy('invite.createdAt', 'DESC');

    if (dioceseId) {
      query.where('invite.dioceseId = :dioceseId', { dioceseId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Invite> {
    const invite = await this.invitesRepository.findOne({
      where: { id },
      relations: ['diocese', 'parish', 'createdBy', 'acceptedBy'],
    });

    if (!invite) {
      throw new NotFoundException('Invitación no encontrada');
    }

    return invite;
  }

  async findByToken(token: string): Promise<Invite> {
    const invite = await this.invitesRepository.findOne({
      where: { token },
      relations: ['diocese', 'parish', 'createdBy'],
    });

    if (!invite) {
      throw new NotFoundException('Token de invitación inválido');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Esta invitación ya fue utilizada o expiró');
    }

    if (invite.expiresAt < new Date()) {
      // Marcar como expirada
      await this.invitesRepository.update(invite.id, { status: InviteStatus.EXPIRED });
      throw new BadRequestException('Esta invitación ha expirado');
    }

    return invite;
  }

  async acceptInvite(token: string, userData: any): Promise<{ user: any; invite: Invite }> {
    const invite = await this.findByToken(token);

    // Crear el usuario
    const newUser = await this.usersService.create({
      ...userData,
      email: invite.email,
      role: invite.role,
      dioceseId: invite.dioceseId,
      currentParishId: invite.parishId,
      canConfess: invite.role === 'priest',
      available: true,
    });

    // Marcar invitación como aceptada
    await this.invitesRepository.update(invite.id, {
      status: InviteStatus.ACCEPTED,
      acceptedByUserId: newUser.id,
      acceptedAt: new Date(),
    });

    // Si es para una parroquia específica, crear registro en parish_staff
    if (invite.parishId && invite.role === 'priest') {
      // TODO: Crear registro en parish_staff si es necesario
    }

    return { user: newUser, invite };
  }

  async revoke(id: string, userId: string, userRole: string): Promise<Invite> {
    const invite = await this.findOne(id);

    // Solo el creador o un admin pueden revocar
    if (invite.createdByUserId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('No tienes permisos para revocar esta invitación');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Solo se pueden revocar invitaciones pendientes');
    }

    await this.invitesRepository.update(id, { status: InviteStatus.REVOKED });
    return this.findOne(id);
  }

  async cleanExpiredInvites(): Promise<number> {
    const result = await this.invitesRepository.update(
      {
        status: InviteStatus.PENDING,
        expiresAt: LessThan(new Date()),
      },
      { status: InviteStatus.EXPIRED }
    );

    return result.affected;
  }

  private generateInviteToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async getInviteStats(dioceseId: string): Promise<any> {
    const stats = await this.invitesRepository
      .createQueryBuilder('invite')
      .where('invite.dioceseId = :dioceseId', { dioceseId })
      .select([
        'COUNT(*) as total',
        'COUNT(CASE WHEN status = :pending THEN 1 END) as pending',
        'COUNT(CASE WHEN status = :accepted THEN 1 END) as accepted',
        'COUNT(CASE WHEN status = :expired THEN 1 END) as expired',
      ])
      .setParameter('pending', InviteStatus.PENDING)
      .setParameter('accepted', InviteStatus.ACCEPTED)
      .setParameter('expired', InviteStatus.EXPIRED)
      .getRawOne();

    return {
      total: parseInt(stats.total),
      pending: parseInt(stats.pending),
      accepted: parseInt(stats.accepted),
      expired: parseInt(stats.expired),
    };
  }

  // Métodos específicos para Coordinadores Parroquiales
  async createCoordinatorInvite(
    createCoordinatorInviteDto: CreateCoordinatorInviteDto, 
    createdByUserId: string
  ): Promise<Invite> {
    // 1. Verificar que el sacerdote esté asignado a la parroquia
    const priestParishAssignment = await this.parishStaffRepository.findOne({
      where: {
        userId: createdByUserId,
        parishId: createCoordinatorInviteDto.parishId,
        role: ParishStaffRole.PRIEST,
        isActive: true
      }
    });

    if (!priestParishAssignment) {
      throw new ForbiddenException('Solo puedes invitar coordinadores para parroquias donde estés asignado como sacerdote');
    }

    // 2. Verificar si ya existe una invitación pendiente para este email y parroquia
    const existingInvite = await this.invitesRepository.findOne({
      where: {
        email: createCoordinatorInviteDto.email,
        parishId: createCoordinatorInviteDto.parishId,
        role: InviteRole.PARISH_COORDINATOR,
        status: InviteStatus.PENDING,
      },
    });

    if (existingInvite) {
      throw new BadRequestException('Ya existe una invitación pendiente de coordinador para este correo y parroquia');
    }

    // 3. Verificar si el usuario ya es coordinador de esta parroquia
    const existingUser = await this.usersService.findByEmail(createCoordinatorInviteDto.email);
    if (existingUser) {
      const existingCoordinator = await this.parishStaffRepository.findOne({
        where: {
          userId: existingUser.id,
          parishId: createCoordinatorInviteDto.parishId,
          role: ParishStaffRole.PARISH_COORDINATOR,
          isActive: true
        }
      });

      if (existingCoordinator) {
        throw new BadRequestException('Este usuario ya es coordinador de esta parroquia');
      }
    }

    // 4. Generar token único
    const token = this.generateInviteToken();
    
    // 5. Calcular expiración (7 días por defecto o fecha especificada)
    const expiresAt = createCoordinatorInviteDto.expiresAt 
      ? new Date(createCoordinatorInviteDto.expiresAt)
      : (() => {
          const date = new Date();
          date.setDate(date.getDate() + 7);
          return date;
        })();

    // 6. Obtener dioceseId de la parroquia
    const parish = await this.invitesRepository.manager.findOne('Parish', {
      where: { id: createCoordinatorInviteDto.parishId },
      select: ['id', 'name', 'dioceseId']
    });

    if (!parish) {
      throw new NotFoundException('Parroquia no encontrada');
    }

    const invite = this.invitesRepository.create({
      email: createCoordinatorInviteDto.email,
      role: InviteRole.PARISH_COORDINATOR,
      dioceseId: parish.dioceseId,
      parishId: createCoordinatorInviteDto.parishId,
      token,
      expiresAt,
      createdByUserId,
      message: createCoordinatorInviteDto.message || `Te invitamos a ser coordinador parroquial de ${parish.name}`,
    });

    const savedInvite = await this.invitesRepository.save(invite);

    // TODO: Enviar email de invitación específico para coordinadores
    console.log(`Invitación de coordinador enviada: ${createCoordinatorInviteDto.email}`);
    console.log(`Token: ${token}`);
    console.log(`URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/registro-coordinador/${token}`);

    return this.findOne(savedInvite.id);
  }

  async acceptCoordinatorInvite(token: string, acceptDto: AcceptCoordinatorInviteDto): Promise<{ user: any; invite: Invite; isNewUser: boolean }> {
    const invite = await this.findByToken(token);

    if (invite.role !== InviteRole.PARISH_COORDINATOR) {
      throw new BadRequestException('Este token no es válido para invitaciones de coordinador');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(invite.email);
    let user;
    let isNewUser = false;

    if (existingUser) {
      // Usuario existente - solo agregar rol de coordinador
      user = existingUser;
      
      // Verificar que no sea ya coordinador de esta parroquia
      const existingCoordinator = await this.parishStaffRepository.findOne({
        where: {
          userId: user.id,
          parishId: invite.parishId,
          role: ParishStaffRole.PARISH_COORDINATOR,
          isActive: true
        }
      });

      if (existingCoordinator) {
        throw new BadRequestException('Ya eres coordinador de esta parroquia');
      }

    } else {
      // Usuario nuevo - crear cuenta
      if (!acceptDto.password || !acceptDto.firstName || !acceptDto.lastName) {
        throw new BadRequestException('Se requieren password, firstName y lastName para usuarios nuevos');
      }

      user = await this.usersService.create({
        email: invite.email,
        password: acceptDto.password,
        firstName: acceptDto.firstName,
        lastName: acceptDto.lastName,
        phone: acceptDto.phone,
        role: UserRole.FAITHFUL, // Rol base es faithful
        dioceseId: invite.dioceseId,
        isActive: true,
      });
      isNewUser = true;
    }

    // Crear registro en parish_staff como coordinador
    const coordinatorAssignment = this.parishStaffRepository.create({
      userId: user.id,
      parishId: invite.parishId,
      role: ParishStaffRole.PARISH_COORDINATOR,
      startDate: new Date(),
      isActive: true,
      responsibilities: 'Coordinación parroquial, gestión de confesiones y actividades pastorales',
      assignedByUserId: invite.createdByUserId,
    });

    await this.parishStaffRepository.save(coordinatorAssignment);

    // Marcar invitación como aceptada
    await this.invitesRepository.update(invite.id, {
      status: InviteStatus.ACCEPTED,
      acceptedByUserId: user.id,
      acceptedAt: new Date(),
    });

    return { user, invite, isNewUser };
  }

  // Método auxiliar para verificar si un usuario es coordinador de una parroquia
  async isParishCoordinator(userId: string, parishId: string): Promise<boolean> {
    const coordinatorRole = await this.parishStaffRepository.findOne({
      where: {
        userId,
        parishId,
        role: ParishStaffRole.PARISH_COORDINATOR,
        isActive: true
      }
    });

    return !!coordinatorRole;
  }

  // Obtener parroquias donde el usuario es coordinador
  async getUserCoordinatorParishes(userId: string): Promise<any[]> {
    const coordinatorRoles = await this.parishStaffRepository.find({
      where: {
        userId,
        role: ParishStaffRole.PARISH_COORDINATOR,
        isActive: true
      },
      relations: ['parish']
    });

    return coordinatorRoles.map(role => role.parish);
  }
}