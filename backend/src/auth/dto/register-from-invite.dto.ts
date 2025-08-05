import { IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterFromInviteDto {
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString({ message: 'El nombre es requerido' })
  firstName: string;

  @IsString({ message: 'El apellido es requerido' })
  lastName: string;

  @IsString({ message: 'El teléfono es requerido' })
  phone: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  specialties?: string;

  @IsString()
  @IsOptional()
  languages?: string;
}