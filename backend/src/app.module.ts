import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfessionSlotsModule } from './confession-slots/confession-slots.module';
import { ConfessionsModule } from './confessions/confessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production' 
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
            logging: process.env.NODE_ENV === 'development',
          } as any
        : {
            type: 'sqlite',
            database: 'confes_app.db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: process.env.NODE_ENV === 'development',
          } as any
    ),
    AuthModule,
    UsersModule,
    ConfessionSlotsModule,
    ConfessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}