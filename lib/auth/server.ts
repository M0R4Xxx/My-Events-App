import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; 

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super";

/* Mengambil data lengkap user yang sedang aktif dari database berdasarkan JWT token di cookies */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        avatarUrl: true 
      },
    });
    return user; 
  } catch (error) {
    return null;
  }
}

/* Mengambil data sesi dasar (ID user) dari JWT token untuk pengecekan otentikasi cepat */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return { data: null };
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    return {
      data: {
        user: {
          id: decoded.userId,
        },
      },  
    };
  } catch (error) {
    return { data: null };
  }
}