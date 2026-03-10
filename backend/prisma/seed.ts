import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creando datos iniciales...');

  // Admin principal
  const adminPassword = await bcrypt.hash('Admin1234!', 10);
  const admin = await prisma.profile.upsert({
    where: { email: 'admin@crmseguros.com' },
    update: {},
    create: {
      email: 'admin@crmseguros.com',
      passwordHash: adminPassword,
      nombre: 'Admin',
      apellido: 'Principal',
      rol: 'admin',
      activo: true,
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Zona de prueba
  const zona = await prisma.zona.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      nombre: 'Buenos Aires Centro',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
    },
  });
  console.log('✅ Zona creada:', zona.nombre);

  // Vendedor de prueba
  const vendedorPassword = await bcrypt.hash('Vendedor1234!', 10);
  const vendedor = await prisma.profile.upsert({
    where: { email: 'vendedor@crmseguros.com' },
    update: {},
    create: {
      email: 'vendedor@crmseguros.com',
      passwordHash: vendedorPassword,
      nombre: 'Juan',
      apellido: 'Perez',
      rol: 'vendedor_matriculado',
      zonaId: zona.id,
      matricula: 'MAT-001',
      activo: true,
    },
  });
  console.log('✅ Vendedor creado:', vendedor.email);

  // Config de ranking por defecto
  await prisma.rankingConfig.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      nombre: 'Formula Default',
      pesoVentas: 10,
      pesoLeadsContactados: 1,
      pesoConversion: 5,
      pesoTicketPromedio: 0.001,
      pesoReuniones: 2,
      activa: true,
    },
  });
  console.log('✅ Config de ranking creada');

  console.log('\n🚀 Base de datos lista!\n');
  console.log('Login admin:    admin@crmseguros.com  /  Admin1234!');
  console.log('Login vendedor: vendedor@crmseguros.com  /  Vendedor1234!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
