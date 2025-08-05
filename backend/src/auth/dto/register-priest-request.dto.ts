import { IsEmail, IsString, MinLength, IsOptional, IsUUID } from 'class-validator';

export class RegisterPriestRequestDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString({ message: 'El nombre es requerido' })
  firstName: string;

  @IsString({ message: 'El apellido es requerido' })
  lastName: string;

  @IsString({ message: 'El teléfono es requerido' })
  phone: string;

  @IsUUID(4, { message: 'ID de diócesis inválido' })
  dioceseId: string;

  @IsUUID(4, { message: 'ID de parroquia inválido' })
  @IsOptional()
  currentParishId?: string;

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