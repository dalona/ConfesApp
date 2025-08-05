import { IsEmail, IsString, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  dioceseId?: string;

  @IsString()
  @IsOptional()
  currentParishId?: string;

  @IsString()
  @IsOptional()
  language?: string;

  // Priest-specific fields
  @IsBoolean()
  @IsOptional()
  canConfess?: boolean;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsDateString()
  @IsOptional()
  ordinationDate?: string;

  // Contact information
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;
}