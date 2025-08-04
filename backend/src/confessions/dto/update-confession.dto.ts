import { PartialType } from '@nestjs/mapped-types';
import { CreateConfessionDto } from './create-confession.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ConfessionStatus } from '../../entities/confession.entity';

export class UpdateConfessionDto extends PartialType(CreateConfessionDto) {
  @IsEnum(ConfessionStatus)
  @IsOptional()
  status?: ConfessionStatus;
}