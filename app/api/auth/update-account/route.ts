import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman_123";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();
    const { name, newPassword, avatarUrl } = body;

    // Kita buat objek updateData dinamis biar kolom password cuma di-update
    // kalau user emang lagi masukin password baru aja.
    const updateData: any = { name };
    
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    if (newPassword) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update langsung ke database berdasarkan user ID yang kita dapet dari token.
    await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui data" }, { status: 500 });
  }
}