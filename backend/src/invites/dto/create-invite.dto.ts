import { IsEmail, IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { InviteRole } from '../../entities/invite.entity';

export class CreateInviteDto {
  @IsEmail()
  email: string;

  @IsEnum(InviteRole)
  role: InviteRole;

  @IsUUID()
  dioceseId: string;

  @IsUUID()
  @IsOptional()
  parishId?: string;

  @IsString()
  @IsOptional()
  message?: string;
}