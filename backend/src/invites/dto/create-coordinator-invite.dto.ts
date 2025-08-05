import { IsEmail, IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateCoordinatorInviteDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsUUID(4, { message: 'ID de parroquia inválido' })
  parishId: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsDateString({}, { message: 'Fecha de expiración inválida' })
  @IsOptional()
  expiresAt?: string; // Si no se proporciona, se calcula automáticamente (7 días)
}