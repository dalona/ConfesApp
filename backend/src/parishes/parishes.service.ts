import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parish } from '../entities/parish.entity';
import { CreateParishDto } from './dto/create-parish.dto';
import { UpdateParishDto } from './dto/update-parish.dto';

@Injectable()
export class ParishesService {
  constructor(
    @InjectRepository(Parish)
    private parishesRepository: Repository<Parish>,
  ) {}

  async create(createParishDto: CreateParishDto): Promise<Parish> {
    const parish = this.parishesRepository.create(createParishDto);
    return this.parishesRepository.save(parish);
  }

  async findAll(): Promise<Parish[]> {
    return this.parishesRepository.find({
      relations: ['diocese', 'diocese.bishop', 'parishStaff', 'parishStaff.user'],
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByDiocese(dioceseId: string): Promise<Parish[]> {
    return this.parishesRepository.find({
      where: { dioceseId, isActive: true },
      relations: ['parishStaff', 'parishStaff.user'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Parish> {
    const parish = await this.parishesRepository.findOne({
      where: { id },
      relations: [
        'diocese',
        'diocese.bishop',
        'parishStaff',
        'parishStaff.user',
        'priestHistory',
        'priestHistory.priest',
        'confessionSlots',
      ],
    });

    if (!parish) {
      throw new NotFoundException('Parroquia no encontrada');
    }

    return parish;
  }

  async findNearby(latitude: number, longitude: number, radius: number = 10): Promise<Parish[]> {
    // Simple distance calculation for nearby parishes
    return this.parishesRepository
      .createQueryBuilder('parish')
      .leftJoinAndSelect('parish.diocese', 'diocese')
      .where('parish.isActive = :active', { active: true })
      .andWhere('parish.latitude IS NOT NULL')
      .andWhere('parish.longitude IS NOT NULL')
      .andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(parish.latitude)) * 
         cos(radians(parish.longitude) - radians(:lng)) + 
         sin(radians(:lat)) * sin(radians(parish.latitude)))) < :radius`,
        { lat: latitude, lng: longitude, radius }
      )
      .orderBy('parish.name', 'ASC')
      .getMany();
  }

  async update(id: string, updateParishDto: UpdateParishDto, userId: string, userRole: string): Promise<Parish> {
    const parish = await this.findOne(id);

    // Check permissions: bishops can update parishes in their diocese
    if (userRole === 'bishop' && parish.diocese.bishopId !== userId) {
      throw new ForbiddenException('Solo puedes modificar parroquias de tu diócesis');
    }

    await this.parishesRepository.update(id, updateParishDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const parish = await this.findOne(id);

    // Check permissions
    if (userRole === 'bishop' && parish.diocese.bishopId !== userId) {
      throw new ForbiddenException('Solo puedes eliminar parroquias de tu diócesis');
    }

    // Soft delete
    await this.parishesRepository.update(id, { isActive: false });
  }

  async getParishStatistics(id: string): Promise<any> {
    const parish = await this.findOne(id);

    const stats = await this.parishesRepository
      .createQueryBuilder('parish')
      .leftJoin('parish.parishStaff', 'staff')
      .leftJoin('parish.confessionSlots', 'slots')
      .leftJoin('slots.confessions', 'confessions')
      .where('parish.id = :id', { id })
      .select([
        'COUNT(DISTINCT staff.id) as staffCount',
        'COUNT(DISTINCT slots.id) as confessionSlotsCount',
        'COUNT(DISTINCT confessions.id) as totalConfessions',
        'COUNT(DISTINCT CASE WHEN confessions.status = :completed THEN confessions.id END) as completedConfessions',
      ])
      .setParameter('completed', 'completed')
      .getRawOne();

    return {
      parish: parish.name,
      staff: parseInt(stats.staffCount),
      confessionSlots: parseInt(stats.confessionSlotsCount),
      totalConfessions: parseInt(stats.totalConfessions),
      completedConfessions: parseInt(stats.completedConfessions),
    };
  }
}