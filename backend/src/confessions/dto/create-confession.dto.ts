import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateConfessionDto {
  @IsUUID()
  confessionSlotId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  preparationNotes?: string;
}