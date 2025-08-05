import { DataSource } from 'typeorm';
import { runSeed } from './seed';

async function bootstrap() {
  // Configurar DataSource igual que en app.module.ts
  const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'confes_app.db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await AppDataSource.initialize();
    
    console.log('✅ Conexión establecida');
    await runSeed(AppDataSource);
    
    console.log('🏁 Proceso completado');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

bootstrap();