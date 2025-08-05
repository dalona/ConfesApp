import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { Diocese } from './entities/diocese.entity';
import { Parish } from './entities/parish.entity';
import { Invite, InviteStatus, InviteRole } from './entities/invite.entity';
import { PriestParishRequest, RequestStatus } from './entities/priest-parish-request.entity';
import * as crypto from 'crypto';

export async function runSeed(dataSource: DataSource) {
  console.log('🌱 Iniciando seed de datos fake...');

  const userRepository = dataSource.getRepository(User);
  const dioceseRepository = dataSource.getRepository(Diocese);
  const parishRepository = dataSource.getRepository(Parish);
  const inviteRepository = dataSource.getRepository(Invite);
  const priestRequestRepository = dataSource.getRepository(PriestParishRequest);

  try {
    // Limpiar datos existentes (opcional en desarrollo)
    console.log('🗑️ Limpiando datos existentes...');
    await inviteRepository.delete({});
    await priestRequestRepository.delete({});
    await parishRepository.delete({});
    await dioceseRepository.delete({});
    await userRepository.delete({});

    // 1. Crear Obispo
    console.log('👑 Creando obispo...');
    const hashedPassword = await bcrypt.hash('Pass123!', 12);
    
    const bishop = userRepository.create({
      email: 'obispo@diocesis.com',
      password: hashedPassword,
      firstName: 'Francisco',
      lastName: 'González',
      role: UserRole.BISHOP,
      phone: '+34 123 456 789',
      isActive: true,
      canConfess: true,
      available: true,
      address: 'Plaza de la Catedral, 1',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
    });
    
    const savedBishop = await userRepository.save(bishop);
    console.log(`✅ Obispo creado: ${savedBishop.firstName} ${savedBishop.lastName}`);

    // 2. Crear Diócesis
    console.log('⛪ Creando diócesis...');
    const diocese = dioceseRepository.create({
      name: 'Diócesis de Madrid',
      bishopId: savedBishop.id,
      address: 'Plaza de la Catedral, 1',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      phone: '+34 123 456 789',
      email: 'info@diocesismadrid.es',
      website: 'https://diocesismadrid.es',
      isActive: true,
      establishedDate: new Date('1850-01-01'),
      description: 'Diócesis de Madrid fundada en el siglo XIX',
    });
    
    const savedDiocese = await dioceseRepository.save(diocese);
    
    // Actualizar obispo con su diócesis
    await userRepository.update(savedBishop.id, { dioceseId: savedDiocese.id });
    console.log(`✅ Diócesis creada: ${savedDiocese.name}`);

    // 3. Crear 2 Parroquias
    console.log('🏛️ Creando parroquias...');
    
    const parish1 = parishRepository.create({
      name: 'Parroquia de San Miguel',
      dioceseId: savedDiocese.id,
      address: 'Calle San Miguel, 15',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      postalCode: '28001',
      phone: '+34 123 456 701',
      email: 'info@sanmiguel.es',
      isActive: true,
      foundedDate: new Date('1900-05-15'),
      description: 'Parroquia histórica del centro de Madrid',
      massSchedule: ['Domingo 09:00', 'Domingo 11:00', 'Domingo 19:00'],
      confessionSchedule: ['Sábado 17:00-18:00', 'Domingo 10:00-10:30'],
    });
    
    const parish2 = parishRepository.create({
      name: 'Parroquia de Santa María',
      dioceseId: savedDiocese.id,
      address: 'Plaza Santa María, 8',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      postalCode: '28002',
      phone: '+34 123 456 702',
      email: 'info@santamaria.es',
      isActive: true,
      foundedDate: new Date('1875-12-08'),
      description: 'Parroquia dedicada a la Virgen María',
      massSchedule: ['Domingo 08:30', 'Domingo 12:00', 'Domingo 20:00'],
      confessionSchedule: ['Viernes 18:00-19:00', 'Sábado 16:30-17:30'],
    });

    const savedParish1 = await parishRepository.save(parish1);
    const savedParish2 = await parishRepository.save(parish2);
    console.log(`✅ Parroquias creadas: ${savedParish1.name}, ${savedParish2.name}`);

    // 4. Crear Invitación Activa para Sacerdote
    console.log('📧 Creando invitación activa...');
    
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días desde ahora
    
    const activeInvite = inviteRepository.create({
      email: 'sacerdote.invitado@ejemplo.com',
      role: InviteRole.PRIEST,
      dioceseId: savedDiocese.id,
      parishId: savedParish1.id,
      token: inviteToken,
      expiresAt,
      createdByUserId: savedBishop.id,
      status: InviteStatus.PENDING,
      message: 'Te invitamos a unirte como sacerdote en la Parroquia de San Miguel',
    });
    
    const savedInvite = await inviteRepository.save(activeInvite);
    console.log(`✅ Invitación creada para: ${savedInvite.email}`);
    console.log(`🔗 Token de invitación: ${inviteToken}`);

    // 5. Crear Usuario Sacerdote con Solicitud Pendiente
    console.log('👨‍💼 Creando sacerdote con solicitud pendiente...');
    
    const pendingPriest = userRepository.create({
      email: 'padre.carlos@ejemplo.com',
      password: hashedPassword,
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      role: UserRole.PRIEST,
      phone: '+34 987 654 321',
      isActive: false, // Pendiente de aprobación
      canConfess: false, // Se activará después de la aprobación
      available: true,
      dioceseId: savedDiocese.id,
      currentParishId: savedParish2.id,
      address: 'Calle de los Sacerdotes, 10',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
    });
    
    const savedPendingPriest = await userRepository.save(pendingPriest);

    // Crear solicitud pendiente para este sacerdote
    const priestRequest = priestRequestRepository.create({
      priestId: savedPendingPriest.id,
      dioceseId: savedDiocese.id,
      parishId: savedParish2.id,
      status: RequestStatus.PENDING,
      requestMessage: 'Solicito unirme a la Parroquia de Santa María para servir como sacerdote',
    });
    
    await priestRequestRepository.save(priestRequest);
    console.log(`✅ Sacerdote con solicitud pendiente creado: ${savedPendingPriest.firstName} ${savedPendingPriest.lastName}`);

    // 6. Crear algunos usuarios fieles para pruebas
    console.log('🙏 Creando usuarios fieles...');
    
    const faithful1 = userRepository.create({
      email: 'fiel1@ejemplo.com',
      password: hashedPassword,
      firstName: 'María',
      lastName: 'García',
      role: UserRole.FAITHFUL,
      phone: '+34 111 222 333',
      isActive: true,
      dioceseId: savedDiocese.id,
      city: 'Madrid',
      country: 'España',
    });

    const faithful2 = userRepository.create({
      email: 'fiel2@ejemplo.com',
      password: hashedPassword,
      firstName: 'Juan',
      lastName: 'López',
      role: UserRole.FAITHFUL,
      phone: '+34 444 555 666',
      isActive: true,
      dioceseId: savedDiocese.id,
      city: 'Madrid',
      country: 'España',
    });

    await userRepository.save([faithful1, faithful2]);
    console.log(`✅ Usuarios fieles creados: ${faithful1.firstName}, ${faithful2.firstName}`);

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📋 Resumen de datos creados:');
    console.log(`👑 Obispo: ${savedBishop.email} (contraseña: Pass123!)`);
    console.log(`⛪ Diócesis: ${savedDiocese.name}`);
    console.log(`🏛️ Parroquias: ${savedParish1.name}, ${savedParish2.name}`);
    console.log(`📧 Invitación activa: ${savedInvite.email} (token: ${inviteToken})`);
    console.log(`👨‍💼 Sacerdote pendiente: ${savedPendingPriest.email} (contraseña: Pass123!)`);
    console.log(`🙏 Fieles: fiel1@ejemplo.com, fiel2@ejemplo.com (contraseña: Pass123!)`);
    console.log('\n🚀 Ya puedes probar los flujos de registro de sacerdotes!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}