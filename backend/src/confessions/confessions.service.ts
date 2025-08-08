import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Confession, ConfessionStatus } from '../entities/confession.entity';
import { ConfessionSlotsService } from '../confession-slots/confession-slots.service';
import { ConfessionBandsService } from '../confession-bands/confession-bands.service';
import { SlotStatus } from '../entities/confession-slot.entity';
import { BandStatus } from '../entities/confession-band.entity';
import { CreateConfessionDto } from './dto/create-confession.dto';
import { UpdateConfessionDto } from './dto/update-confession.dto';

@Injectable()
export class ConfessionsService {
  constructor(
    @InjectRepository(Confession)
    private confessionsRepository: Repository<Confession>,
    private confessionSlotsService: ConfessionSlotsService,
    private confessionBandsService: ConfessionBandsService,
  ) {}

  async create(createConfessionDto: CreateConfessionDto, faithfulId: string): Promise<Confession> {
    // Check if slot exists and is available
    const slot = await this.confessionSlotsService.findOne(createConfessionDto.confessionSlotId);
    
    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new BadRequestException('Este slot de confesión no está disponible');
    }

    // Check if slot is in the future
    if (slot.startTime <= new Date()) {
      throw new BadRequestException('No puedes reservar un slot que ya pasó');
    }

    // Check if user already has a booking for this slot
    const existingBooking = await this.confessionsRepository.findOne({
      where: {
        faithfulId,
        confessionSlotId: createConfessionDto.confessionSlotId,
        status: ConfessionStatus.BOOKED,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('Ya tienes una reserva para este slot');
    }

    // Create the confession booking
    const confession = this.confessionsRepository.create({
      ...createConfessionDto,
      faithfulId,
      scheduledTime: slot.startTime,
    });

    const savedConfession = await this.confessionsRepository.save(confession);

    // Update slot status to booked
    await this.confessionSlotsService.updateStatus(slot.id, SlotStatus.BOOKED);

    return this.findOne(savedConfession.id);
  }

  async findAll(userId?: string, userRole?: string): Promise<Confession[]> {
    const query = this.confessionsRepository.createQueryBuilder('confession')
      .leftJoinAndSelect('confession.faithful', 'faithful')
      .leftJoinAndSelect('confession.confessionSlot', 'slot')
      .leftJoinAndSelect('slot.priest', 'priest')
      .orderBy('confession.scheduledTime', 'ASC');

    // Filter based on user role
    if (userRole === 'faithful') {
      query.where('confession.faithfulId = :userId', { userId });
    } else if (userRole === 'priest') {
      query.where('slot.priestId = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Confession> {
    const confession = await this.confessionsRepository.findOne({
      where: { id },
      relations: ['faithful', 'confessionSlot', 'confessionSlot.priest'],
    });

    if (!confession) {
      throw new NotFoundException('Confesión no encontrada');
    }

    return confession;
  }

  async update(id: string, updateConfessionDto: UpdateConfessionDto, userId: string, userRole: string): Promise<Confession> {
    const confession = await this.findOne(id);

    // Only the faithful who booked or the priest can update
    const canUpdate = (userRole === 'faithful' && confession.faithfulId === userId) ||
                     (userRole === 'priest' && confession.confessionSlot.priestId === userId);

    if (!canUpdate) {
      throw new ForbiddenException('No tienes permisos para actualizar esta confesión');
    }

    await this.confessionsRepository.update(id, updateConfessionDto);
    return this.findOne(id);
  }

  async cancel(id: string, userId: string, userRole: string): Promise<Confession> {
    const confession = await this.findOne(id);

    // Only the faithful who booked can cancel (priests can complete but not cancel)
    if (userRole === 'faithful' && confession.faithfulId !== userId) {
      throw new ForbiddenException('No puedes cancelar confesiones de otros usuarios');
    }

    // Can't cancel if already completed
    if (confession.status === ConfessionStatus.COMPLETED) {
      throw new BadRequestException('No puedes cancelar una confesión completada');
    }

    // Update confession status
    await this.confessionsRepository.update(id, { status: ConfessionStatus.CANCELLED });

    // Update slot status back to available
    await this.confessionSlotsService.updateStatus(confession.confessionSlotId, SlotStatus.AVAILABLE);

    return this.findOne(id);
  }

  async complete(id: string, priestId: string): Promise<Confession> {
    const confession = await this.findOne(id);

    // Only the assigned priest can complete
    if (confession.confessionSlot.priestId !== priestId) {
      throw new ForbiddenException('Solo el sacerdote asignado puede completar esta confesión');
    }

    // Update confession status
    await this.confessionsRepository.update(id, { status: ConfessionStatus.COMPLETED });

    // Update slot status
    await this.confessionSlotsService.updateStatus(confession.confessionSlotId, SlotStatus.COMPLETED);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const confession = await this.findOne(id);
    
    // If confession was booked, make the slot available again
    if (confession.status === ConfessionStatus.BOOKED) {
      await this.confessionSlotsService.updateStatus(confession.confessionSlotId, SlotStatus.AVAILABLE);
    }

    await this.confessionsRepository.delete(id);
  }
}