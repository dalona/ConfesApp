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
    // Validate that either confessionSlotId or confessionBandId is provided
    if (!createConfessionDto.confessionSlotId && !createConfessionDto.confessionBandId) {
      throw new BadRequestException('Debes proporcionar confessionSlotId o confessionBandId');
    }

    if (createConfessionDto.confessionSlotId && createConfessionDto.confessionBandId) {
      throw new BadRequestException('No puedes proporcionar ambos confessionSlotId y confessionBandId');
    }

    let scheduledTime: Date;
    let priestId: string;

    // Handle confession slot (legacy system)
    if (createConfessionDto.confessionSlotId) {
      const slot = await this.confessionSlotsService.findOne(createConfessionDto.confessionSlotId);
      
      if (slot.status !== SlotStatus.AVAILABLE) {
        throw new BadRequestException('Este slot de confesión no está disponible');
      }

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

      scheduledTime = slot.startTime;
      priestId = slot.priestId;

      // Update slot status to booked
      await this.confessionSlotsService.updateStatus(slot.id, SlotStatus.BOOKED);
    }
    // Handle confession band (new system)
    else if (createConfessionDto.confessionBandId) {
      const band = await this.confessionBandsService.findOne(createConfessionDto.confessionBandId, null);
      
      if (band.status !== BandStatus.AVAILABLE) {
        throw new BadRequestException('Esta franja de confesión no está disponible');
      }

      if (band.startTime <= new Date()) {
        throw new BadRequestException('No puedes reservar una franja que ya pasó');
      }

      // Check current bookings count
      const currentBookings = await this.confessionsRepository.count({
        where: {
          confessionBandId: createConfessionDto.confessionBandId,
          status: ConfessionStatus.BOOKED,
        },
      });

      if (currentBookings >= band.maxCapacity) {
        throw new BadRequestException('Esta franja ya está llena');
      }

      // Check if user already has a booking for this band
      const existingBooking = await this.confessionsRepository.findOne({
        where: {
          faithfulId,
          confessionBandId: createConfessionDto.confessionBandId,
          status: ConfessionStatus.BOOKED,
        },
      });

      if (existingBooking) {
        throw new BadRequestException('Ya tienes una reserva para esta franja');
      }

      scheduledTime = band.startTime;
      priestId = band.priestId;

      // Check if band should become full
      const newBookingsCount = currentBookings + 1;
      if (newBookingsCount >= band.maxCapacity) {
        await this.confessionBandsService.updateStatus(band.id, BandStatus.FULL);
      }
    }

    // Create the confession booking
    const confession = this.confessionsRepository.create({
      ...createConfessionDto,
      faithfulId,
      scheduledTime,
    });

    const savedConfession = await this.confessionsRepository.save(confession);

    return this.findOne(savedConfession.id);
  }

  async findAll(userId?: string, userRole?: string): Promise<Confession[]> {
    const query = this.confessionsRepository.createQueryBuilder('confession')
      .leftJoinAndSelect('confession.faithful', 'faithful')
      .leftJoinAndSelect('confession.confessionSlot', 'slot')
      .leftJoinAndSelect('confession.confessionBand', 'band')
      .leftJoinAndSelect('slot.priest', 'slotPriest')
      .leftJoinAndSelect('band.priest', 'bandPriest')
      .orderBy('confession.scheduledTime', 'ASC');

    // Filter based on user role
    if (userRole === 'faithful') {
      query.where('confession.faithfulId = :userId', { userId });
    } else if (userRole === 'priest') {
      query.where('slot.priestId = :userId OR band.priestId = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Confession> {
    const confession = await this.confessionsRepository.findOne({
      where: { id },
      relations: ['faithful', 'confessionSlot', 'confessionSlot.priest', 'confessionBand', 'confessionBand.priest'],
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

    // Can't cancel if less than 2 hours before the scheduled time
    const timeUntilConfession = confession.scheduledTime.getTime() - new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    if (timeUntilConfession <= twoHoursInMs) {
      throw new BadRequestException('No puedes cancelar una confesión con menos de 2 horas de anticipación');
    }

    // Update confession status
    await this.confessionsRepository.update(id, { status: ConfessionStatus.CANCELLED });

    // Handle slot availability based on which system is used
    if (confession.confessionSlotId) {
      // Legacy system: Update slot status back to available
      await this.confessionSlotsService.updateStatus(confession.confessionSlotId, SlotStatus.AVAILABLE);
    } else if (confession.confessionBandId) {
      // New system: Check if band was full and make it available again
      const band = await this.confessionBandsService.findOne(confession.confessionBandId);
      if (band.status === BandStatus.FULL) {
        await this.confessionBandsService.updateStatus(confession.confessionBandId, BandStatus.AVAILABLE);
      }
    }

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