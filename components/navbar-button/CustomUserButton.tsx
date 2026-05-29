"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import ShinyText from "@/components/animation-ui/ShinyText"; 

/* Ambil data user dari context, kalo belum ada bakal fetch dari API session */
export function CustomUserButton() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(!user);
  const pathname = usePathname();

  /* Efek buat mastiin status login user selalu up-to-date */
  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    async function fetchSession() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user); 
          }
        }
      } catch (error) {
        console.error("Gagal memuat sesi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [user, setUser]);

  /* Loading state biar gak kedap-kedip pas lagi ngecek sesi user */  
  if (loading) return <div className="w-24 h-8 rounded-md bg-neutral-800 animate-pulse" />;

  /* Tampilan buat user yang belum login (tombol Sign In & Sign Up) */
  if (!user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link 
          href="/auth/sign-in" 
          className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-neutral-700 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95 shadow-lg"
        >
          Sign In
        </Link>
        <Link 
          href="/auth/sign-up" 
          className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/90 hover:bg-white text-black font-bold text-xs sm:text-sm border border-black/40 backdrop-blur-sm shadow-lg shadow-purple-950/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const isActive = pathname.startsWith("/account");
  const initialName = user.name 
  ? user.name
      .split(' ')           
      .map(n => n[0])       
      .join('')              
      .toUpperCase()         
      .slice(0, 2)           
  : "U";

  // Avatar dan nama user, ambil dari URL atau pake inisial nama kalo gak ada avatar 
  return (
    <Link 
      href="/account/profile" 
      className="group flex items-center gap-2.5 sm:gap-3 mb-[1px] rounded-lg transition-all duration-300"
    >
      <div className="flex flex-col text-right justify-center">
        <span className="relative text-sm font-bold text-white">
          <div className="sm:hidden">
              <ShinyText text={initialName} speed={5} delay={0} color="#ffffff" shineColor="#c181ff" spread={120} direction="left" yoyo={false} pauseOnHover={false} disabled={false} />
            </div>
            <div 
                className="hidden sm:block whitespace-nowrap leading-tight max-w-[140px] md:max-w-[190px] lg:max-w-[220px]"
                style={{ 
                  maskImage: 'linear-gradient(to right, black 85%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)',
                  overflow: 'hidden'
                }}
              >
              <ShinyText text={user.name} speed={5} delay={0} color="#ffffff" shineColor="#c181ff" spread={120} direction="left" yoyo={false} pauseOnHover={false} disabled={false} />
            </div>
          
          <span 
            className={`absolute -bottom-1 right-0 h-0.5 rounded-full transition-all duration-[1400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-gradient-to-r from-purple-400 to-white ${
              isActive ? "w-full" : "w-2.5 group-hover:w-full"
            }`} 
            style={{ willChange: 'width' }}
          />
        </span>
      </div>
      
      <div className={`w-9 h-9 rounded-full bg-purple-600 border border-white/40 flex items-center justify-center font-bold text-sm text-white shadow-md transition-all duration-300 overflow-hidden active:scale-95 ${
        isActive ? "scale-105" : "hover:scale-105"
      }`}>
        {user.avatarUrl ? (
          <img 
          key={user.avatarUrl}
          src={user.avatarUrl}
          alt="Avatar" 
          className="w-full h-full object-cover" />
        ) : (
          <span>{initialName}</span>
        )}
      </div>
    </Link>
  );
}