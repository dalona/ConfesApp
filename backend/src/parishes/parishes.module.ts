import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parish } from '../entities/parish.entity';
import { ParishesService } from './parishes.service';
import { ParishesController } from './parishes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Parish])],
  controllers: [ParishesController],
  providers: [ParishesService],
  exports: [ParishesService],
})
export class ParishesModule {}