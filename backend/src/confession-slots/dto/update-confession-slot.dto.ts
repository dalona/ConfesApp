import { PartialType } from '@nestjs/mapped-types';
import { CreateConfessionSlotDto } from './create-confession-slot.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { SlotStatus } from '../../entities/confession-slot.entity';

export class UpdateConfessionSlotDto extends PartialType(CreateConfessionSlotDto) {
  @IsEnum(SlotStatus)
  @IsOptional()
  status?: SlotStatus;
}