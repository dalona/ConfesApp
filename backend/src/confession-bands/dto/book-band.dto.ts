import { IsString, IsOptional, IsDateString } from 'class-validator';

export class BookBandDto {
  @IsString({ message: 'ID de franja requerido' })
  bandId: string;

  @IsDateString({}, { message: 'Hora preferida inválida' })
  @IsOptional()
  preferredTime?: string; // Hora específica dentro de la franja

  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  @IsOptional()
  notes?: string;

  @IsString({ message: 'Las notas de preparación deben ser una cadena de texto' })
  @IsOptional()
  preparationNotes?: string;
}