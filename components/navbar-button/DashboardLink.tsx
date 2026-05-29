"use client";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

/* Cek status aktif link berdasarkan pathname biar user tau mereka lagi di dashboard */
export function DashboardLink() {
  const { user } = useUser();
  const pathname = usePathname();
  const isActive = pathname === "/dashboard";

  /* Sembunyiin link kalo user belum login */
  if (!user) return null;

  /* Button Dashboardnya  */
  return (
    <Link
      href="/dashboard"
      className={`relative inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border backdrop-blur-sm shadow-lg shadow-purple-950/20 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
        isActive 
          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white scale-105 pointer-events-none border-[0.5px] border-white/50" 
          : "bg-white text-black border-black/40 hover:scale-105 active:scale-95 active:!duration-50 group"
      }`}
    >
      <span className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 transition-opacity duration-700 ease-in-out pointer-events-none ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
      
      <span className={`relative z-10 text-[10.5px] sm:text-xs font-bold transition-colors duration-700 ease-in-out ${isActive ? "text-white" : "text-black group-hover:text-white"}`}>
        Dashboard
      </span>
    </Link>
  );
}