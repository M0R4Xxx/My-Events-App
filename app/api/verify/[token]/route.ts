import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Cari data RSVP berdasarkan token unik yang dikirim lewat email.
  const rsvp = await prisma.eventRsvp.findFirst({
    where: { verificationToken: token },
  });

  // Kalau sudah terverifikasi sebelumnya, langsung lempar ke halaman sukses
  // biar user nggak perlu proses update data lagi.
  if (!rsvp) {
    return new NextResponse("Token tidak valid atau sudah kedaluwarsa.", { status: 400 });
  }
  if (rsvp.isVerified) {
    redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-success?rsvpId=${rsvp.id}`);
  }

  // Update status verifikasi di database supaya guest ini
  // resmi dianggap sudah konfirmasi kehadirannya.
  await prisma.eventRsvp.update({
    where: { id: rsvp.id },
    data: { 
      isVerified: true,
    },
  });
  redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-success?rsvpId=${rsvp.id}`);
}