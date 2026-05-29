import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/* Validasi ketersediaan environment variable untuk database connection string */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL belum diatur di file .env");
}

/* Memastikan instance PrismaClient tetap tunggal (singleton) saat pengembangan untuk mencegah kebocoran koneksi */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const pool = new Pool({ 
  connectionString,
  ssl: true 
});
const adapter = new PrismaPg(pool);

/* Ekspor instansi PrismaClient, memanfaatkan instance global jika tersedia */
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}