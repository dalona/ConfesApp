import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { ConfessionSlot, SlotStatus } from '../entities/confession-slot.entity';
import { CreateConfessionSlotDto } from './dto/create-confession-slot.dto';
import { UpdateConfessionSlotDto } from './dto/update-confession-slot.dto';

@Injectable()
export class ConfessionSlotsService {
  constructor(
    @InjectRepository(ConfessionSlot)
    private confessionSlotsRepository: Repository<ConfessionSlot>,
  ) {}

  async create(createConfessionSlotDto: CreateConfessionSlotDto, priestId: string): Promise<ConfessionSlot> {
    const slot = this.confessionSlotsRepository.create({
      ...createConfessionSlotDto,
      priestId,
    });
    return this.confessionSlotsRepository.save(slot);
  }

  async findAll(userId?: string, userRole?: string): Promise<ConfessionSlot[]> {
    const query = this.confessionSlotsRepository.createQueryBuilder('slot')
      .leftJoinAndSelect('slot.priest', 'priest')
      .leftJoinAndSelect('slot.confessions', 'confessions')
      .orderBy('slot.startTime', 'ASC');

    // If user is a priest, show only their slots
    if (userRole === 'priest') {
      query.where('slot.priestId = :priestId', { priestId: userId });
    } else {
      // For faithful users, show only available slots in the future
      query.where('slot.status = :status', { status: SlotStatus.AVAILABLE })
        .andWhere('slot.startTime > :now', { now: new Date() });
    }

    return query.getMany();
  }

  async findAvailableSlots(): Promise<ConfessionSlot[]> {
    return this.confessionSlotsRepository.find({
      where: {
        status: SlotStatus.AVAILABLE,
        startTime: MoreThanOrEqual(new Date()),
      },
      relations: ['priest'],
      order: { startTime: 'ASC' },
    });
  }

  async findByPriest(priestId: string): Promise<ConfessionSlot[]> {
    return this.confessionSlotsRepository.find({
      where: { priestId },
      relations: ['confessions'],
      order: { startTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ConfessionSlot> {
    const slot = await this.confessionSlotsRepository.findOne({
      where: { id },
      relations: ['priest', 'confessions'],
    });

    if (!slot) {
      throw new NotFoundException('Slot de confesión no encontrado');
    }

    return slot;
  }

  async update(id: string, updateConfessionSlotDto: UpdateConfessionSlotDto, userId: string, userRole: string): Promise<ConfessionSlot> {
    const slot = await this.findOne(id);

    // Only the priest who created the slot can update it
    if (userRole === 'priest' && slot.priestId !== userId) {
      throw new ForbiddenException('No puedes editar slots de otros sacerdotes');
    }

    await this.confessionSlotsRepository.update(id, updateConfessionSlotDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const slot = await this.findOne(id);

    // Only the priest who created the slot can delete it
    if (userRole === 'priest' && slot.priestId !== userId) {
      throw new ForbiddenException('No puedes eliminar slots de otros sacerdotes');
    }

    // Check if slot has bookings
    if (slot.confessions && slot.confessions.length > 0) {
      throw new ForbiddenException('No puedes eliminar un slot con confesiones reservadas');
    }

    await this.confessionSlotsRepository.delete(id);
  }

  async updateStatus(id: string, status: SlotStatus): Promise<ConfessionSlot> {
    await this.confessionSlotsRepository.update(id, { status });
    return this.findOne(id);
  }
}