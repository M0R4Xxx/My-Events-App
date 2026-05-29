import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // Cek keberadaan token buat mastiin user emang lagi punya sesi aktif
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Validasi apakah user-nya masih ada di database. 
    // Ini penting buat handle kasus kalau akunnya dihapus sementara sesi masih aktif.
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true }, 
    });

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}