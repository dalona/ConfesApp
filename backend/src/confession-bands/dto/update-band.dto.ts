import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateBandDto } from './create-band.dto';
import { BandStatus } from '../../entities/confession-band.entity';

export class UpdateBandDto extends PartialType(CreateBandDto) {
  @IsEnum(BandStatus, { message: 'Estado de franja inválido' })
  @IsOptional()
  status?: BandStatus;
}