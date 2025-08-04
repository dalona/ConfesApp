import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriestParishRequest, RequestStatus } from '../entities/priest-parish-request.entity';
import { PriestParishHistory } from '../entities/priest-parish-history.entity';
import { CreatePriestRequestDto } from './dto/create-priest-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';

@Injectable()
export class PriestRequestsService {
  constructor(
    @InjectRepository(PriestParishRequest)
    private requestsRepository: Repository<PriestParishRequest>,
    @InjectRepository(PriestParishHistory)
    private historyRepository: Repository<PriestParishHistory>,
  ) {}

  async create(createPriestRequestDto: CreatePriestRequestDto, priestId: string): Promise<PriestParishRequest> {
    // Check if there's already a pending request for this parish
    const existingRequest = await this.requestsRepository.findOne({
      where: {
        priestId,
        parishId: createPriestRequestDto.parishId,
        status: RequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Ya tienes una solicitud pendiente para esta parroquia');
    }

    const request = this.requestsRepository.create({
      ...createPriestRequestDto,
      priestId,
    });

    return this.requestsRepository.save(request);
  }

  async findAll(): Promise<PriestParishRequest[]> {
    return this.requestsRepository.find({
      relations: ['priest', 'parish', 'parish.diocese', 'reviewedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByParish(parishId: string): Promise<PriestParishRequest[]> {
    return this.requestsRepository.find({
      where: { parishId },
      relations: ['priest', 'parish', 'reviewedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPriest(priestId: string): Promise<PriestParishRequest[]> {
    return this.requestsRepository.find({
      where: { priestId },
      relations: ['priest', 'parish', 'parish.diocese', 'reviewedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingForDiocese(dioceseId: string): Promise<PriestParishRequest[]> {
    return this.requestsRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.priest', 'priest')
      .leftJoinAndSelect('request.parish', 'parish')
      .leftJoinAndSelect('parish.diocese', 'diocese')
      .where('diocese.id = :dioceseId', { dioceseId })
      .andWhere('request.status = :status', { status: RequestStatus.PENDING })
      .orderBy('request.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<PriestParishRequest> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['priest', 'parish', 'parish.diocese', 'reviewedBy'],
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return request;
  }

  async reviewRequest(
    id: string,
    reviewRequestDto: ReviewRequestDto,
    reviewerId: string,
    reviewerRole: string,
  ): Promise<PriestParishRequest> {
    const request = await this.findOne(id);

    // Only bishops and parish staff can review requests
    if (!['bishop', 'parish_staff', 'admin'].includes(reviewerRole)) {
      throw new ForbiddenException('No tienes permisos para revisar solicitudes');
    }

    // Bishops can only review requests in their diocese
    if (reviewerRole === 'bishop' && request.parish.diocese.bishopId !== reviewerId) {
      throw new ForbiddenException('Solo puedes revisar solicitudes de tu diócesis');
    }

    // Update request status
    await this.requestsRepository.update(id, {
      status: reviewRequestDto.status,
      responseMessage: reviewRequestDto.responseMessage,
      reviewedByUserId: reviewerId,
      reviewedAt: new Date(),
    });

    // If accepted, create history record and update priest's current parish
    if (reviewRequestDto.status === RequestStatus.ACCEPTED) {
      const historyRecord = this.historyRepository.create({
        priestId: request.priestId,
        parishId: request.parishId,
        startDate: request.requestedStartDate || new Date(),
        assignedByUserId: reviewerId,
        assignmentReason: `Solicitud aprobada: ${reviewRequestDto.responseMessage || 'Sin comentarios'}`,
        isActive: true,
      });

      await this.historyRepository.save(historyRecord);

      // Update priest's current parish (this would need User service injection)
      // For now, we'll handle this in a separate service call
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const request = await this.findOne(id);

    // Only the requesting priest or authorized staff can delete
    if (request.priestId !== userId && !['admin', 'bishop'].includes(userRole)) {
      throw new ForbiddenException('No puedes eliminar esta solicitud');
    }

    // Can't delete reviewed requests
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('No se pueden eliminar solicitudes ya revisadas');
    }

    await this.requestsRepository.delete(id);
  }

  async getPriestHistory(priestId: string): Promise<PriestParishHistory[]> {
    return this.historyRepository.find({
      where: { priestId },
      relations: ['priest', 'parish', 'parish.diocese', 'assignedBy', 'endedBy'],
      order: { startDate: 'DESC' },
    });
  }

  async getParishPriestHistory(parishId: string): Promise<PriestParishHistory[]> {
    return this.historyRepository.find({
      where: { parishId },
      relations: ['priest', 'parish', 'assignedBy', 'endedBy'],
      order: { startDate: 'DESC' },
    });
  }
}