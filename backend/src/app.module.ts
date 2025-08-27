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
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // Try Supabase PostgreSQL first, fallback to SQLite
        if (process.env.FALLBACK_TO_SQLITE === 'true') {
          console.log('⚠️  Using SQLite fallback due to FALLBACK_TO_SQLITE=true');
          return {
            type: 'sqlite',
            database: 'confes_app.db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: process.env.NODE_ENV === 'development',
          };
        }
        
        // Production Supabase config
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT) || 5432,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: process.env.NODE_ENV === 'development',
          ssl: {
            rejectUnauthorized: false
          }
        };
      },
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