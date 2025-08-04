import { IsEnum, IsString, IsOptional } from 'class-validator';
import { RequestStatus } from '../../entities/priest-parish-request.entity';

export class ReviewRequestDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @IsString()
  @IsOptional()
  responseMessage?: string;
}