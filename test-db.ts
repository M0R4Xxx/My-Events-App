import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    // Kita coba ambil satu user saja untuk tes
    const user = await prisma.user.findFirst();
    
    if (user) {
      console.log("Berhasil terhubung ke database! Data user pertama:", user);
    } else {
      console.log("Database berhasil terhubung, tapi tabel User masih kosong.");
    }
  } catch (error) {
    console.error("Gagal saat mencoba akses database:", error);
  }
}

main().finally(() => prisma.$disconnect());