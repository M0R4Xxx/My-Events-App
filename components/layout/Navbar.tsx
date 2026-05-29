"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import { DashboardLink } from "@/components/navbar-button/DashboardLink";
import { CustomUserButton } from "@/components/navbar-button/CustomUserButton";

export function Navbar() {

/* Pake usePathname buat tau kita lagi di page mana, biasanya dipake buat animasi transisi pas pindah rute */
  const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/15 bg-purple-950/20 backdrop-blur-xl shadow-sm">

            { /* Bagian logo kiri: Pake AnimatedContent biar munculnya smooth pas navbar ke-render */ }
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                <AnimatedContent
                key={`${pathname}-logo`}
                distance={50}
                direction="horizontal"
                reverse={true}
                duration={1}
                threshold={0.1}
                delay={0.5}
                >
                <Link 
                    href={"/"} 
                    className="group flex items-center gap-2 text-sm sm:text-base font-semibold tracking-wide text-white transition-all duration-300 ease-in-out hover:text-purple-200"
                >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-100 transition-colors duration-300 ease-in-out group-hover:text-purple-200" />
                    MyEvents
                </Link>
                </AnimatedContent>

            { /* Bagian menu kanan: Berisi link dashboard dan tombol user */ }
                <AnimatedContent
                key={`${pathname}-nav`}
                distance={50}
                direction="horizontal"
                reverse={false}
                duration={1}
                threshold={0.1}
                delay={0.7}
                >
                <nav className="flex items-center gap-4 sm:gap-6">
                    <DashboardLink />
                    
                    <div suppressHydrationWarning className="flex items-center">
                    <CustomUserButton />
                    </div>
                </nav>
                </AnimatedContent>
            </div>
        </header>
        );
    } 