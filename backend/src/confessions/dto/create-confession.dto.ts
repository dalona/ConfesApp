import { IsString, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class CreateConfessionDto {
  @IsUUID()
  @IsOptional()
  @ValidateIf(o => !o.confessionBandId)
  confessionSlotId?: string;

  @IsUUID()
  @IsOptional()
  @ValidateIf(o => !o.confessionSlotId)
  confessionBandId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  preparationNotes?: string;
}