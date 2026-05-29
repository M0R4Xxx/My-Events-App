import Link from "next/link";
import { cookies } from "next/headers";
import ShinyText from "@/components/animation-ui/ShinyText"; 
import SplitText from "@/components/animation-ui/SplitText"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import { ArrowRight, Calendar, Share2, Users, Info } from "lucide-react";

export default async function Home() { 
  {/* Cek status login lewat cookie, jadi tahu mau arahin user ke mana */}
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const isAuthenticated = !!token; 
  
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-4">
    {/* Hero section buat user */}
      <section className="space-y-4 max-w-3xl">
        <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/30 text-purple-200 text-sm font-medium backdrop-blur-md transition-colors duration-300 ease-in-out hover:bg-purple-950/40">
          Welcome to MyEvents by Jeremy
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          <ShinyText
            text="Plan, manage, and track event RSVPs with professional speed."
            speed={5}
            delay={0}
            color="#ffffff"
            shineColor="#c181ff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </h1>
        <SplitText
          text="Create events, share a unique invite link, and watch attendee status update in real-time with Going, Maybe, and Not going counts for every event."
          className="text-purple-100 text-base md:text-lg max-w-2xl"
          delay={30}
          duration={1}
          splitType="words"
          tag="p"
          textAlign="left"
        />
        
        <AnimatedContent
          distance={50}
          direction="horizontal"
          reverse={true}
          duration={1}
          threshold={0.1}
          delay={0.5}
        >
          <div className="pt-2">
            <Link 
              href={isAuthenticated ? "/dashboard" : "/auth/sign-in"}
              className="group inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-white/90 hover:bg-white text-black font-bold border border-black/40 backdrop-blur-sm shadow-lg shadow-purple-950/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95"
            >
              Let's Start
              <ArrowRight 
                size={16} 
                className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" 
              />
            </Link>
          </div>
        </AnimatedContent>
      </section>

    {/* Penjelasan apa aja yang bisa dilakuin di web ini */}
      <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
            <div className="flex items-center gap-2 mb-0.5 mt-1">
              <Info size={19} className="text-purple-300" />
              <h3 className="text-md font-bold text-white">About MyEvents</h3>
            </div>
            <p className="text-sm text-purple-200/60">
              MyEvents is your ultimate companion for seamless event management. Designed to simplify every step of your planning process, it provides all the tools you need to organize, track, and manage your guest list, ensuring you can celebrate with total peace of mind for every special occasion.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
            <div className="flex items-center gap-2 mb-0.5">
              <Calendar size={18} className="text-purple-300" />
              <h3 className="text-md font-bold text-white">Create events</h3>
            </div>
            <p className="text-sm text-purple-200/60 mb-3">
              Easily set up your event details with an intuitive interface, keeping your focus on the celebration.
            </p>
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 mb-0.5">
                <Share2 size={18} className="text-purple-300" />
                <h3 className="text-md font-bold text-white">Share invite links</h3>
              </div>
              <p className="text-sm text-purple-200/60">
                Quickly share secure, personalized event links across your favorite messaging platforms.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
            <div className="flex items-center gap-2 mb-0.5">
              <Users size={18} className="text-purple-300" />
              <h3 className="text-md font-bold text-white">Track attendance</h3>
            </div>
            <p className="text-sm text-purple-200/60 mb-2">
              Monitor your attendee list and get real-time totals at a glance. Easily manage your guest capacity with our smart, live-updating counter system.
            </p>
            <div className="pt-2 border-t border-white/10 text-sm text-purple-200/50">
              Stay fully informed with real-time updates for 'Going', 'Maybe', and 'Not going' statuses, keeping your guest list accurate.
            </div>
          </div>
      </section>
    </div>
  );
}
