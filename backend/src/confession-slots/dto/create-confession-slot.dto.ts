import { IsDate, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateConfessionSlotDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startTime: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  endTime: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  parishId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxBookings?: number;
}