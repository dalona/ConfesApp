import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diocese } from '../entities/diocese.entity';
import { CreateDioceseDto } from './dto/create-diocese.dto';
import { UpdateDioceseDto } from './dto/update-diocese.dto';

@Injectable()
export class DiocesesService {
  constructor(
    @InjectRepository(Diocese)
    private diocesesRepository: Repository<Diocese>,
  ) {}

  async create(createDioceseDto: CreateDioceseDto): Promise<Diocese> {
    const diocese = this.diocesesRepository.create(createDioceseDto);
    return this.diocesesRepository.save(diocese);
  }

  async findAll(): Promise<Diocese[]> {
    return this.diocesesRepository.find({
      relations: ['bishop', 'parishes'],
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Diocese> {
    const diocese = await this.diocesesRepository.findOne({
      where: { id },
      relations: ['bishop', 'parishes'],
    });

    if (!diocese) {
      throw new NotFoundException('Diócesis no encontrada');
    }

    return diocese;
  }

  async findByBishop(bishopId: string): Promise<Diocese> {
    const diocese = await this.diocesesRepository.findOne({
      where: { bishopId },
      relations: ['bishop', 'parishes'],
    });

    if (!diocese) {
      throw new NotFoundException('No se encontró diócesis para este obispo');
    }

    return diocese;
  }

  async update(id: string, updateDioceseDto: UpdateDioceseDto): Promise<Diocese> {
    const diocese = await this.findOne(id);
    
    await this.diocesesRepository.update(id, updateDioceseDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const diocese = await this.findOne(id);
    
    // Soft delete - just mark as inactive
    await this.diocesesRepository.update(id, { isActive: false });
  }

  async getDioceseStatistics(id: string): Promise<any> {
    const diocese = await this.findOne(id);
    
    const stats = await this.diocesesRepository
      .createQueryBuilder('diocese')
      .leftJoin('diocese.parishes', 'parish')
      .leftJoin('parish.parishStaff', 'staff')
      .leftJoin('staff.user', 'priest')
      .where('diocese.id = :id', { id })
      .select([
        'COUNT(DISTINCT parish.id) as parishCount',
        'COUNT(DISTINCT CASE WHEN priest.role = :priestRole THEN priest.id END) as priestCount',
        'COUNT(DISTINCT staff.id) as staffCount',
      ])
      .setParameter('priestRole', 'priest')
      .getRawOne();

    return {
      diocese: diocese.name,
      parishes: parseInt(stats.parishCount),
      priests: parseInt(stats.priestCount),
      staff: parseInt(stats.staffCount),
    };
  }
}