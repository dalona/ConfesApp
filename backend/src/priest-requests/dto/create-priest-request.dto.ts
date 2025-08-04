import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreatePriestRequestDto {
  @IsUUID()
  parishId: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsDateString()
  @IsOptional()
  requestedStartDate?: string;
}