import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman_123";

export async function POST(req: Request) {
  try {
    const { avatarUrl } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verifikasi token dulu buat mastiin sesi masih valid sebelum 
    // eksekusi update data ke database.
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Update avatarUrl ke database sesuai dengan ID user yang sedang login.
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { avatarUrl },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}