import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { ConfessionBand, BandStatus, RecurrenceType } from '../entities/confession-band.entity';
import { Confession, ConfessionStatus } from '../entities/confession.entity';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { BookBandDto } from './dto/book-band.dto';

@Injectable()
export class ConfessionBandsService {
  constructor(
    @InjectRepository(ConfessionBand)
    private bandsRepository: Repository<ConfessionBand>,
    @InjectRepository(Confession)
    private confessionsRepository: Repository<Confession>,
  ) {}

  // ===== CRUD OPERATIONS FOR PRIESTS =====

  async create(createBandDto: CreateBandDto, priestId: string): Promise<ConfessionBand> {
    const startTime = new Date(createBandDto.startTime);
    const endTime = new Date(createBandDto.endTime);

    // Validar fechas
    if (startTime >= endTime) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    if (startTime <= new Date()) {
      throw new BadRequestException('La hora de inicio debe ser en el futuro');
    }

    // Verificar solapamientos
    await this.checkForOverlaps(priestId, startTime, endTime);

    const band = this.bandsRepository.create({
      ...createBandDto,
      startTime,
      endTime,
      priestId,
      recurrenceDays: createBandDto.recurrenceDays ? JSON.stringify(createBandDto.recurrenceDays) : null,
      recurrenceEndDate: createBandDto.recurrenceEndDate ? new Date(createBandDto.recurrenceEndDate) : null,
    });

    const savedBand = await this.bandsRepository.save(band);

    // Si es recurrente, crear las repeticiones
    if (createBandDto.isRecurrent && createBandDto.recurrenceType !== RecurrenceType.NONE) {
      await this.createRecurrentBands(savedBand);
    }

    return this.findOne(savedBand.id, priestId);
  }

  async findAll(priestId: string, startDate?: string, endDate?: string): Promise<ConfessionBand[]> {
    let whereConditions: any = { priestId };

    if (startDate && endDate) {
      whereConditions.startTime = Between(new Date(startDate), new Date(endDate));
    }

    return this.bandsRepository.find({
      where: whereConditions,
      relations: ['confessions', 'confessions.faithful'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string, priestId: string): Promise<ConfessionBand> {
    const band = await this.bandsRepository.findOne({
      where: { id, priestId },
      relations: ['confessions', 'confessions.faithful', 'priest', 'parish'],
    });

    if (!band) {
      throw new NotFoundException('Franja de confesión no encontrada');
    }

    return band;
  }

  async findOneById(id: string): Promise<ConfessionBand> {
    const band = await this.bandsRepository.findOne({
      where: { id },
      relations: ['confessions', 'confessions.faithful', 'priest', 'parish'],
    });

    if (!band) {
      throw new NotFoundException('Franja de confesión no encontrada');
    }

    return band;
  }

  async update(id: string, updateBandDto: UpdateBandDto, priestId: string): Promise<ConfessionBand> {
    const band = await this.findOne(id, priestId);

    // Si se actualiza horario, verificar solapamientos
    if (updateBandDto.startTime || updateBandDto.endTime) {
      const startTime = updateBandDto.startTime ? new Date(updateBandDto.startTime) : band.startTime;
      const endTime = updateBandDto.endTime ? new Date(updateBandDto.endTime) : band.endTime;

      if (startTime >= endTime) {
        throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
      }

      await this.checkForOverlaps(priestId, startTime, endTime, id);
    }

    // Verificar si hay reservas activas antes de permitir ciertos cambios
    if (band.currentBookings > 0 && (updateBandDto.startTime || updateBandDto.endTime || updateBandDto.maxCapacity)) {
      throw new BadRequestException('No se puede modificar una franja que ya tiene reservas. Cancela las reservas primero.');
    }

    const updateData: any = { ...updateBandDto };
    if (updateBandDto.startTime) updateData.startTime = new Date(updateBandDto.startTime);
    if (updateBandDto.endTime) updateData.endTime = new Date(updateBandDto.endTime);
    if (updateBandDto.recurrenceEndDate) updateData.recurrenceEndDate = new Date(updateBandDto.recurrenceEndDate);
    if (updateBandDto.recurrenceDays) updateData.recurrenceDays = JSON.stringify(updateBandDto.recurrenceDays);

    await this.bandsRepository.update(id, updateData);
    return this.findOne(id, priestId);
  }

  async remove(id: string, priestId: string): Promise<{ message: string }> {
    const band = await this.findOne(id, priestId);

    // Verificar si hay reservas activas
    if (band.currentBookings > 0) {
      throw new BadRequestException('No se puede eliminar una franja que tiene reservas activas. Cancela las reservas primero.');
    }

    // Si es parte de una serie recurrente, solo eliminar esta instancia
    if (band.parentBandId) {
      await this.bandsRepository.remove(band);
      return { message: 'Instancia de franja recurrente eliminada exitosamente' };
    }

    // Si es la franja padre de una serie recurrente, eliminar todas las instancias futuras
    if (band.isRecurrent) {
      await this.bandsRepository.delete({
        parentBandId: id,
        startTime: MoreThan(new Date())
      });
    }

    await this.bandsRepository.remove(band);
    return { message: 'Franja eliminada exitosamente' };
  }

  async changeStatus(id: string, status: BandStatus, priestId: string): Promise<ConfessionBand> {
    const band = await this.findOne(id, priestId);

    if (status === BandStatus.CANCELLED && band.currentBookings > 0) {
      throw new BadRequestException('No se puede cancelar una franja que tiene reservas activas. Cancela las reservas primero.');
    }

    await this.bandsRepository.update(id, { status });
    return this.findOne(id, priestId);
  }

  // ===== BOOKING OPERATIONS FOR FAITHFUL =====

  async getAvailableBands(startDate?: string, endDate?: string, parishId?: string): Promise<ConfessionBand[]> {
    let whereConditions: any = {
      status: BandStatus.AVAILABLE,
      startTime: MoreThan(new Date()), // Solo futuras
    };

    if (startDate && endDate) {
      whereConditions.startTime = Between(new Date(startDate), new Date(endDate));
    }

    if (parishId) {
      whereConditions.parishId = parishId;
    }

    const bands = await this.bandsRepository.find({
      where: whereConditions,
      relations: ['priest', 'parish'],
      order: { startTime: 'ASC' },
    });

    // Filtrar solo las que tienen espacio disponible
    return bands.filter(band => band.currentBookings < band.maxCapacity);
  }

  async bookBand(bookBandDto: BookBandDto, faithfulId: string): Promise<Confession> {
    const band = await this.bandsRepository.findOne({
      where: { id: bookBandDto.bandId, status: BandStatus.AVAILABLE },
      relations: ['confessions'],
    });

    if (!band) {
      throw new NotFoundException('Franja de confesión no encontrada o no disponible');
    }

    // Verificar capacidad
    if (band.currentBookings >= band.maxCapacity) {
      throw new BadRequestException('Esta franja ya está llena');
    }

    // Verificar que el fiel no tenga ya una reserva en esta franja
    const existingBooking = await this.confessionsRepository.findOne({
      where: {
        confessionBandId: band.id,
        faithfulId,
        status: ConfessionStatus.BOOKED,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('Ya tienes una reserva en esta franja');
    }

    // Crear la reserva
    const confession = this.confessionsRepository.create({
      faithfulId,
      confessionBandId: band.id,
      scheduledTime: bookBandDto.preferredTime ? new Date(bookBandDto.preferredTime) : band.startTime,
      status: ConfessionStatus.BOOKED,
      notes: bookBandDto.notes,
      preparationNotes: bookBandDto.preparationNotes,
    });

    const savedConfession = await this.confessionsRepository.save(confession);

    // Actualizar contador y estado de la franja
    const newBookingCount = band.currentBookings + 1;
    const newStatus = newBookingCount >= band.maxCapacity ? BandStatus.FULL : BandStatus.AVAILABLE;

    await this.bandsRepository.update(band.id, {
      currentBookings: newBookingCount,
      status: newStatus,
    });

    return this.confessionsRepository.findOne({
      where: { id: savedConfession.id },
      relations: ['faithful', 'confessionBand', 'confessionBand.priest'],
    });
  }

  async cancelBooking(confessionId: string, faithfulId: string): Promise<{ message: string }> {
    const confession = await this.confessionsRepository.findOne({
      where: { id: confessionId, faithfulId, status: ConfessionStatus.BOOKED },
      relations: ['confessionBand'],
    });

    if (!confession) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const band = confession.confessionBand;

    // Verificar que sea posible cancelar (ej: al menos 2 horas antes)
    const timeDiff = confession.scheduledTime.getTime() - new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    if (timeDiff < twoHoursInMs) {
      throw new BadRequestException('No se puede cancelar una reserva con menos de 2 horas de anticipación');
    }

    // Actualizar estado de la confesión
    await this.confessionsRepository.update(confessionId, {
      status: ConfessionStatus.CANCELLED,
    });

    // Actualizar contador y estado de la franja
    const newBookingCount = Math.max(0, band.currentBookings - 1);
    await this.bandsRepository.update(band.id, {
      currentBookings: newBookingCount,
      status: BandStatus.AVAILABLE, // Vuelve a estar disponible
    });

    return { message: 'Reserva cancelada exitosamente' };
  }

  async getFaithfulBookings(faithfulId: string): Promise<Confession[]> {
    return this.confessionsRepository.find({
      where: { faithfulId },
      relations: ['confessionBand', 'confessionBand.priest', 'confessionBand.parish'],
      order: { scheduledTime: 'ASC' },
    });
  }

  // ===== UTILITY METHODS =====

  private async checkForOverlaps(priestId: string, startTime: Date, endTime: Date, excludeId?: string): Promise<void> {
    let whereConditions: any = {
      priestId,
    };

    if (excludeId) {
      whereConditions = {
        ...whereConditions,
        id: { $ne: excludeId },
      };
    }

    const overlappingBands = await this.bandsRepository
      .createQueryBuilder('band')
      .where('band.priestId = :priestId', { priestId })
      .andWhere('band.status != :cancelled', { cancelled: BandStatus.CANCELLED })
      .andWhere(
        '(band.startTime < :endTime AND band.endTime > :startTime)',
        { startTime, endTime }
      );

    if (excludeId) {
      overlappingBands.andWhere('band.id != :excludeId', { excludeId });
    }

    const overlaps = await overlappingBands.getMany();

    if (overlaps.length > 0) {
      throw new BadRequestException('Ya tienes franjas programadas que se solapan con este horario');
    }
  }

  private async createRecurrentBands(parentBand: ConfessionBand): Promise<void> {
    if (!parentBand.isRecurrent || !parentBand.recurrenceDays) return;

    const recurrenceDays = JSON.parse(parentBand.recurrenceDays);
    const endDate = parentBand.recurrenceEndDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 año por defecto
    
    const startDate = new Date(parentBand.startTime);
    const bandDuration = parentBand.endTime.getTime() - parentBand.startTime.getTime();

    const recurringBands: Partial<ConfessionBand>[] = [];

    // Generar instancias según el tipo de recurrencia
    switch (parentBand.recurrenceType) {
      case RecurrenceType.WEEKLY:
        let currentWeek = new Date(startDate);
        currentWeek.setDate(startDate.getDate() + 7); // Empezar la próxima semana

        while (currentWeek <= endDate) {
          for (const dayOfWeek of recurrenceDays) {
            const instanceDate = new Date(currentWeek);
            instanceDate.setDate(currentWeek.getDate() - currentWeek.getDay() + dayOfWeek);

            if (instanceDate > startDate && instanceDate <= endDate) {
              const instanceStart = new Date(instanceDate);
              instanceStart.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
              
              const instanceEnd = new Date(instanceStart.getTime() + bandDuration);

              recurringBands.push({
                priestId: parentBand.priestId,
                startTime: instanceStart,
                endTime: instanceEnd,
                location: parentBand.location,
                notes: parentBand.notes,
                maxCapacity: parentBand.maxCapacity,
                parishId: parentBand.parishId,
                parentBandId: parentBand.id,
                isRecurrent: false,
                status: BandStatus.AVAILABLE,
              });
            }
          }
          currentWeek.setDate(currentWeek.getDate() + 7);
        }
        break;

      case RecurrenceType.DAILY:
        let currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + 1);

        while (currentDay <= endDate) {
          const instanceStart = new Date(currentDay);
          instanceStart.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
          
          const instanceEnd = new Date(instanceStart.getTime() + bandDuration);

          recurringBands.push({
            priestId: parentBand.priestId,
            startTime: instanceStart,
            endTime: instanceEnd,
            location: parentBand.location,
            notes: parentBand.notes,
            maxCapacity: parentBand.maxCapacity,
            parishId: parentBand.parishId,
            parentBandId: parentBand.id,
            isRecurrent: false,
            status: BandStatus.AVAILABLE,
          });

          currentDay.setDate(currentDay.getDate() + 1);
        }
        break;
    }

    // Crear las instancias recurrentes en lotes
    if (recurringBands.length > 0) {
      const batchSize = 50; // Crear en lotes para evitar problemas de rendimiento
      for (let i = 0; i < recurringBands.length; i += batchSize) {
        const batch = recurringBands.slice(i, i + batchSize);
        await this.bandsRepository.save(batch);
      }
    }
  }
}