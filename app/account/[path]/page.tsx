import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import jwt from "jsonwebtoken";
import AccountForm from "@/components/AccountForm";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman_123";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Query ke db, tapi cuma ambil data yang emang perlu dipake di profile/settings aja
  // biar query-nya enteng dan performa lebih oke.

  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
    });
  } catch (error) {
    return null;
  }
}

// Cek path-nya, kalau nggak sesuai sama yang dibolehin,
// langsung lempar ke 404 biar nggak diakses sembarangan.

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path;
  if (path !== "profile" && path !== "settings") {
    return redirect("/404");
  }
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/auth/sign-in");
  }
  const joinedDate = new Date(user.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 mt-0 self-center p-4 md:p-6">
      <AccountForm user={user} joinedDate={joinedDate} />
    </main>
  );
}