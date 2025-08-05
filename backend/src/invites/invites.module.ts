import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from '../entities/invite.entity';
import { ParishStaff } from '../entities/parish-staff.entity';
import { Parish } from '../entities/parish.entity';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invite, ParishStaff, Parish]),
    UsersModule,
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}