import { IsDateString, IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, Min, Max } from 'class-validator';
import { RecurrenceType } from '../../entities/confession-band.entity';

export class CreateBandDto {
  @IsDateString({}, { message: 'Fecha y hora de inicio inválida' })
  startTime: string;

  @IsDateString({}, { message: 'Fecha y hora de fin inválida' })
  endTime: string;

  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @IsOptional()
  location?: string;

  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  @IsOptional()
  notes?: string;

  @IsNumber({}, { message: 'La capacidad máxima debe ser un número' })
  @Min(1, { message: 'La capacidad máxima debe ser al menos 1' })
  @Max(50, { message: 'La capacidad máxima no puede ser mayor a 50' })
  maxCapacity: number;

  @IsBoolean({ message: 'Recurrente debe ser un valor booleano' })
  @IsOptional()
  isRecurrent?: boolean;

  @IsEnum(RecurrenceType, { message: 'Tipo de recurrencia inválido' })
  @IsOptional()
  recurrenceType?: RecurrenceType;

  @IsArray({ message: 'Los días de recurrencia deben ser un arreglo' })
  @IsOptional()
  recurrenceDays?: number[]; // [0=Sunday, 1=Monday, ..., 6=Saturday]

  @IsDateString({}, { message: 'Fecha de fin de recurrencia inválida' })
  @IsOptional()
  recurrenceEndDate?: string;

  @IsString()
  @IsOptional()
  parishId?: string;
}