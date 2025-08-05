import { IsString, MinLength, IsOptional } from 'class-validator';

export class AcceptCoordinatorInviteDto {
  // Solo requerido para usuarios nuevos
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsOptional()
  password?: string;

  // Solo requerido para usuarios nuevos (email viene de la invitación)
  @IsString({ message: 'El nombre es requerido' })
  @IsOptional()
  firstName?: string;

  @IsString({ message: 'El apellido es requerido' })
  @IsOptional()
  lastName?: string;

  @IsString({ message: 'El teléfono es requerido' })
  @IsOptional()
  phone?: string;

  // Para usuarios existentes, solo necesitan confirmar aceptación
  @IsOptional()
  acceptTerms?: boolean;
}