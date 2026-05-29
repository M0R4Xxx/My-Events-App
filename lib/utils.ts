import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/* Utility function untuk menggabungkan class Tailwind dengan aman, menangani konflik class secara otomatis */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* Fungsi helper untuk menentukan styling CSS (warna/border/shadow) berdasarkan status RSVP dan status verifikasi */
export const getStatusStyles = (status: string, isVerified: boolean) => {
    if (!isVerified) {
      return "bg-neutral-500/20 text-neutral-200 border-neutral-500/20 shadow-neutral-900/20 hover:bg-neutral-500/30";
    }
    switch (status) {
      case 'going': 
        return "bg-green-500/20 text-green-200 border-green-500/20 shadow-green-900/20 hover:bg-green-500/30";
      case 'maybe': 
        return "bg-yellow-500/20 text-yellow-200 border-yellow-500/20 shadow-yellow-900/20 hover:bg-yellow-500/30";
      case 'not_going': 
        return "bg-red-500/20 text-red-200 border-red-500/20 shadow-red-900/20 hover:bg-red-500/30";
      default: 
        return "bg-white/5 text-purple-200 border-white/10 hover:bg-white/10";
    }
  };
