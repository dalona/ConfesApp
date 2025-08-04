import { IsString, IsOptional, IsUUID, IsEmail, IsUrl, IsDateString, IsBoolean } from 'class-validator';

export class CreateDioceseDto {
  @IsString()
  name: string;

  @IsUUID()
  bishopId: string;

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

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  establishedDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}