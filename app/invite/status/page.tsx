'use client';

import { Suspense } from "react";
import { useSearchParams as useNavSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ShinyText from "@/components/animation-ui/ShinyText";
import SplitText from "@/components/animation-ui/SplitText";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";

function StatusContent() {
  const searchParams = useNavSearchParams();
  const mode = searchParams.get("mode"); // 'pending' (tunggu email) atau sudah diproses
  const token = searchParams.get("token");

  // Logika penentuan pesan berdasarkan parameter URL
  const title = mode === 'pending' ? "Check Your Inbox" : "Already processed!";
  const description = mode === 'pending' 
    ? "An invitation link is on its way to your inbox. Please open your email and verify your details to complete your RSVP process."
    : "The email address you provided has already been registered for this event. No further action is required at this time.";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-purple-950/20 p-8 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30 text-white text-center">
      <h2 className="text-2xl font-bold text-center mb-2">
        <ShinyText
          text={title}
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
      </h2>

      <div className="mb-5">
        <SplitText
          text={description}
          className="text-sm text-purple-200/60"
          delay={30}
          duration={1}
          splitType="words"
          tag="p"
          textAlign="center"
        />
      </div>
      
    {/* Tombol kembali hanya muncul jika token masih valid/tersedia */}
      {token && (
        <AnimatedContent 
          distance={20} 
          direction="vertical" 
          reverse={false} 
          duration={1} 
          threshold={0.1} 
          delay={0.5}
        >
          <Link 
            href={`/invite/${token}`}
            className="group mx-auto min-w-[160px] px-8 h-10 rounded-md border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center w-fit"
          >
            <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <ArrowLeft 
                size={16} 
                className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-1" 
              />
              Back to Form
            </span>
          </Link>
        </AnimatedContent>
      )}
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 -mt-20">

    {/* Suspense soalnya useSearchParams adalah Client Hooknya */}
      <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
        <StatusContent />
      </Suspense>
    </div>
  );
}