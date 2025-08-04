import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diocese } from '../entities/diocese.entity';
import { DiocesesService } from './dioceses.service';
import { DiocesesController } from './dioceses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Diocese])],
  controllers: [DiocesesController],
  providers: [DiocesesService],
  exports: [DiocesesService],
})
export class DiocesesModule {}