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
        const databaseMode = process.env.DATABASE_MODE || 'sqlite';
        
        if (databaseMode === 'sqlite' || process.env.FALLBACK_TO_SQLITE === 'true') {
          console.log('📦 Using SQLite database for development');
          return {
            type: 'sqlite',
            database: 'confes_app.db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: process.env.NODE_ENV === 'development',
          };
        }
        
        if (databaseMode === 'postgres') {
          console.log('🐘 Attempting connection to Supabase PostgreSQL...');
          console.log('📍 Host:', process.env.DB_HOST);
          console.log('🔌 Port:', process.env.DB_PORT_POOLER || '6543');
          
          return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT_POOLER) || 6543,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: process.env.NODE_ENV === 'development',
            ssl: {
              rejectUnauthorized: false,
              require: true
            },
            connectTimeoutMS: 30000,
            extra: {
              ssl: {
                rejectUnauthorized: false
              }
            }
          };
        }
        
        // Default fallback
        console.log('⚠️  Defaulting to SQLite due to unknown DATABASE_MODE');
        return {
          type: 'sqlite',
          database: 'confes_app.db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: process.env.NODE_ENV === 'development',
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