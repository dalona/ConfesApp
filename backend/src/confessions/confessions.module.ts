import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfessionsService } from './confessions.service';
import { ConfessionsController } from './confessions.controller';
import { Confession } from '../entities/confession.entity';
import { ConfessionSlotsModule } from '../confession-slots/confession-slots.module';
import { ConfessionBandsModule } from '../confession-bands/confession-bands.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Confession]),
    ConfessionSlotsModule,
    ConfessionBandsModule,
  ],
  controllers: [ConfessionsController],
  providers: [ConfessionsService],
  exports: [ConfessionsService],
})
export class ConfessionsModule {}