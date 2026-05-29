import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ 
  connectionString: "postgresql://neondb_owner:npg_Pljiyz0TIvL9@ep-late-poetry-apo8r8uc-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require" 
});

async function test() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Koneksi Database Berhasil! Waktu server:", result.rows[0]);
  } catch (e) {
    console.error("Gagal koneksi ke Neon:", e);
  } finally {
    await pool.end();
  }
}

test();