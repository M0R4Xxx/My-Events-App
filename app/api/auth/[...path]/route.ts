import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super";
const OTP_SECRET = process.env.OTP_JWT_SECRET || "otp_rahasia";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const action = path[0];
  const cookieStore = await cookies();

  let body: any = {};
  try {
    const rawBody = await request.text();
    if (rawBody) body = JSON.parse(rawBody);
  } catch (e) {
    body = {};
  }

  try {

    // Proses registrasi awal: validasi email & password dulu,
    // baru kirim OTP lewat email kalau data aman.
    if (action === "register") {
      const { name, email, password } = body;
      
      if (!email || !email.endsWith("@gmail.com")) {
        return NextResponse.json({ message: "Email must end with @gmail.com" }, { status: 400 });
      }

      if (!password || password.length < 6 || password.includes(" ")) {
        return NextResponse.json({ message: "Password must be at least 6 characters (no spaces)" }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already in use. Please sign in or try another" }, 
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await transporter.sendMail({
        from: `"Event Planner" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verifikasi Akun Baru",
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h2>Kode Verifikasi Akun</h2>
            <p>Halo ${name}, gunakan kode OTP berikut untuk memverifikasi akun Anda:</p>
            <h1 style="color: #6b21a8; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>Kode ini berlaku selama 10 menit.</p>
          </div>
        `,
      });

      // Simpen data sementara di cookie (session) biar aman
      // dan nggak perlu simpen password plain-text di client.

      const token = jwt.sign({ name, email, hashedPassword, otp }, OTP_SECRET, { expiresIn: "10m" });
      cookieStore.set("signup_session", token, { httpOnly: true, secure: true, sameSite: "strict" });
      return NextResponse.json({ success: true });
    }

    // Verifikasi OTP dari session. Kalau cocok, baru commit data ke database.
    if (action === "verify-otp") {
      const { otp } = body;
      const token = cookieStore.get("signup_session")?.value;
      if (!token) return NextResponse.json({ message: "Session expired" }, { status: 400 });

      const decoded = jwt.verify(token, OTP_SECRET) as any;
      if (decoded.otp !== otp) return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

      // validasi token
      await prisma.user.create({ 
        data: { name: decoded.name, email: decoded.email, passwordHash: decoded.hashedPassword } 
      });
      cookieStore.delete("signup_session");
      return NextResponse.json({ success: true });
    }

    if (action === "login") {
      const { email, password } = body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
      cookieStore.set("auth_token", token, { httpOnly: true, secure: true, sameSite: "strict" });
      return NextResponse.json({ success: true });
    }

    // Flow reset password: simpen token di database biar bisa divalidasi
    // sekali pakai (one-time use) dan masa berlakunya ketat (15 menit).
    if (action === "forgot-password") {
      const { email } = body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return NextResponse.json({ success: true, message: "If the email is registered, a reset link has been sent" });
      }

      const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: resetToken }
      });
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: `"Event Planner" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Password Anda",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Reset Password</h2>
            <p>Halo, klik tombol di bawah ini untuk mengatur ulang password Anda:</p>
            <a href="${resetUrl}" style="background: #6b21a8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>Link ini berlaku selama 15 menit.</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, message: "Link has been sent" });
    }

    if (action === "validate-reset") {
      const token = new URL(request.url).searchParams.get("token");
      if (!token) return NextResponse.json({ valid: false, message: "Token lost" }, { status: 400 });

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (user && user.resetToken && user.resetToken.trim() === token.trim()) {
          return NextResponse.json({ valid: true });
        }
        return NextResponse.json({ valid: false, message: "Invalid token" }, { status: 400 });
      } catch (err: any) {
        return NextResponse.json({ valid: false, message: "Token expired" }, { status: 400 });
      }
    }

    // Pas eksekusi reset password, pastikan token yang dipake sama persis
    // dengan yang ada di DB biar nggak bisa dipake berkali-kali.
    if (action === "reset-password") {
      const { newPassword, confirmPassword } = body;
      if (!newPassword || newPassword.length < 6 || newPassword.includes(" ")) {
        return NextResponse.json({ message: "Password must be at least 6 characters (no spaces)" }, { status: 400 });
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
      }
      const token = new URL(request.url).searchParams.get("token");
      if (!token) return NextResponse.json({ message: "Invalid token" }, { status: 400 });

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        
        if (!user || !user.resetToken || user.resetToken.trim() !== token.trim()) {
          return NextResponse.json({ message: "This link has expired or has already been used" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { 
            passwordHash: hashedPassword, 
            resetToken: null 
          },
        });

        return NextResponse.json({ success: true, message: "Password successfully changed!" });
      } catch (err) {
        return NextResponse.json({ message: "Token expired or invalid" }, { status: 400 });
      }
    }

    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  } catch (error: any) {
    console.error("DETAIL ERROR:", error); 
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }   
}


export async function GET(
  request: Request, 
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (path[0] === "logout") {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("signup_session");
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.json({ message: "Not Found" }, { status: 404 });
}