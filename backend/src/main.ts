import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 8001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 ConfesApp Backend running on port ${port}`);
}

bootstrap();