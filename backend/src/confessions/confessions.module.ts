import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfessionsService } from './confessions.service';
import { ConfessionsController } from './confessions.controller';
import { Confession } from '../entities/confession.entity';
import { ConfessionSlotsModule } from '../confession-slots/confession-slots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Confession]),
    ConfessionSlotsModule,
  ],
  controllers: [ConfessionsController],
  providers: [ConfessionsService],
  exports: [ConfessionsService],
})
export class ConfessionsModule {}