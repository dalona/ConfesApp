import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfessionSlotsService } from './confession-slots.service';
import { ConfessionSlotsController } from './confession-slots.controller';
import { ConfessionSlot } from '../entities/confession-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfessionSlot])],
  controllers: [ConfessionSlotsController],
  providers: [ConfessionSlotsService],
  exports: [ConfessionSlotsService],
})
export class ConfessionSlotsModule {}