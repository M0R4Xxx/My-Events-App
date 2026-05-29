# Event Planner App

Aplikasi manajemen event untuk mempermudah RSVP dan koordinasi tamu.

## 🚀 Akses Aplikasi
- **Live Demo:** [https://my-events-app-flame.vercel.app/](https://my-events-app-flame.vercel.app/)

## 🛠️ Teknologi Utama
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL (Neon) & Prisma ORM
- **Styling:** Tailwind CSS
- **Authentication:** JWT
- **Storage:** UploadThing
- **State Management:** Zustand

## 📋 Fitur
- **Pembuatan Event:** Pengguna dapat membuat event secara dinamis dengan detail acara yang lengkap.
- **Sistem Undangan:** Menggunakan token unik untuk akses tamu yang aman dan eksklusif.
- **RSVP Tamu:** Sistem konfirmasi kehadiran dengan verifikasi email terintegrasi.
- **Dashboard Manajemen:** Antarmuka khusus bagi pemilik event untuk memantau status tamu dan data acara.

## ⚙️ Setup Lokal
1. Clone repositori: `git clone [url]`
2. Install dependencies: `npm install`
3. Salin `.env.example` ke `.env` dan isi variabelnya.
4. Push schema ke database: `npx prisma db push`
5. Jalankan aplikasi: `npm run dev`

Untuk menjalankan aplikasi ini di lingkungan lokal Anda, ikuti langkah berikut:
 **Clone repositori:**
   ```bash
   git clone [https://github.com/M0R4Xxx/My-Events-App.git](https://github.com/M0R4Xxx/My-Events-App.git)
   cd My-Events-App

## 🏗️ Arsitektur
Aplikasi ini menerapkan pola **Server Actions** pada Next.js untuk menangani logika backend secara modular, memastikan efisiensi kode dengan prinsip **DRY** dan **SOLID**.
