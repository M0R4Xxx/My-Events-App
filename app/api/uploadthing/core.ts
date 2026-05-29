import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";
import { jwtVerify } from "jose"; 

const f = createUploadthing();
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman_123";

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;

      if (!token) throw new Error("Unauthorized");

      try {
        // Validasi token dulu sebelum kasih akses upload.
        // Kita ambil userId-nya buat mastiin cuma user yang login yang bisa upload.
        
        const secret = new TextEncoder().encode(JWT_SECRET);        
        const { payload } = await jwtVerify(token, secret);
        const userId = (payload.userId || payload.sub) as string;
        if (!userId) throw new Error("Invalid token payload");

        return { userId };
      } catch (error) {
        console.error("JWT Verification failed:", error);
        throw new Error("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload berhasil:", metadata.userId);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;