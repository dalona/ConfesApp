import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriestParishRequest } from '../entities/priest-parish-request.entity';
import { PriestParishHistory } from '../entities/priest-parish-history.entity';
import { PriestRequestsService } from './priest-requests.service';
import { PriestRequestsController } from './priest-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PriestParishRequest, PriestParishHistory])],
  controllers: [PriestRequestsController],
  providers: [PriestRequestsService],
  exports: [PriestRequestsService],
})
export class PriestRequestsModule {}