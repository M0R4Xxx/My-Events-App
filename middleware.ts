import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; 

/* Middleware untuk melindungi route (dashboard dan events) dengan validasi JWT */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL("/auth/sign-in", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

/* Konfigurasi matcher untuk menentukan path mana saja yang diproteksi oleh middleware ini */
export const config = {
  matcher: ["/dashboard/:path*", "/events/:path*"],
};