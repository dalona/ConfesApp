import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfessionSlotsModule } from './confession-slots/confession-slots.module';
import { ConfessionsModule } from './confessions/confessions.module';
import { ConfessionBandsModule } from './confession-bands/confession-bands.module';
import { DiocesesModule } from './dioceses/dioceses.module';
import { ParishesModule } from './parishes/parishes.module';
import { PriestRequestsModule } from './priest-requests/priest-requests.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
      ssl: {
        rejectUnauthorized: false
      }
    }),
    AuthModule,
    UsersModule,
    DiocesesModule,
    ParishesModule,
    PriestRequestsModule,
    InvitesModule,
    ConfessionSlotsModule,
    ConfessionsModule,
    ConfessionBandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}