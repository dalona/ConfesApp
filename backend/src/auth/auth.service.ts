import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InvitesService } from '../invites/invites.service';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { RegisterPriestRequestDto } from './dto/register-priest-request.dto';
import { RegisterFromInviteDto } from './dto/register-from-invite.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private invitesService: InvitesService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Ya existe un usuario con este correo electrónico');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Return token
    return this.login(user);
  }

  async registerPriestRequest(registerPriestRequestDto: RegisterPriestRequestDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerPriestRequestDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Ya existe un usuario con este correo electrónico');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerPriestRequestDto.password, 12);

    // Create user with pending approval status
    const user = await this.usersService.create({
      ...registerPriestRequestDto,
      password: hashedPassword,
      role: UserRole.PRIEST,
      isActive: false, // Pending approval
      canConfess: false, // Will be enabled after approval
      available: true,
    });

    // TODO: Send notification to bishop
    // await this.notificationService.notifyBishopOfNewPriestRequest(user);

    return {
      success: true,
      message: 'Solicitud enviada correctamente. El obispo de la diócesis será notificado para revisar tu solicitud.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async registerFromInvite(token: string, registerFromInviteDto: RegisterFromInviteDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(registerFromInviteDto.password, 12);

    // Accept the invitation and create user
    const { user, invite } = await this.invitesService.acceptInvite(token, {
      ...registerFromInviteDto,
      password: hashedPassword,
    });

    // Return login info
    return {
      ...this.login(user),
      message: `¡Bienvenido! Te has unido exitosamente como ${invite.role === 'priest' ? 'Sacerdote' : 'Coordinador'} a la diócesis ${invite.diocese.name}.`,
      invite: {
        diocese: invite.diocese.name,
        parish: invite.parish?.name,
        role: invite.role,
      },
    };
  }

  async approvePriestRequest(userId: string, approved: boolean, reviewedByUserId: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user || user.role !== UserRole.PRIEST || user.isActive) {
      throw new BadRequestException('Solicitud de sacerdote no válida');
    }

    if (approved) {
      // Activate the priest
      await this.usersService.update(userId, {
        isActive: true,
        canConfess: true,
        available: true,
      });

      // TODO: Send approval notification email
      // await this.emailService.sendApprovalEmail(user);

      return {
        success: true,
        message: 'Sacerdote aprobado exitosamente',
      };
    } else {
      // Mark as rejected (or delete the user)
      await this.usersService.update(userId, {
        isActive: false,
        canConfess: false,
        available: false,
      });

      // TODO: Send rejection notification email
      // await this.emailService.sendRejectionEmail(user);

      return {
        success: true,
        message: 'Solicitud de sacerdote rechazada',
      };
    }
  }
}