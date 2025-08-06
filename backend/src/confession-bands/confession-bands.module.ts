import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfessionBandsService } from './confession-bands.service';
import { ConfessionBandsController } from './confession-bands.controller';
import { ConfessionBand } from '../entities/confession-band.entity';
import { Confession } from '../entities/confession.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfessionBand, Confession])],
  controllers: [ConfessionBandsController],
  providers: [ConfessionBandsService],
  exports: [ConfessionBandsService],
})
export class ConfessionBandsModule {}