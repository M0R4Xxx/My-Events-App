"use client";

import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import ShinyText from "@/components/animation-ui/ShinyText";
import SplitText from "@/components/animation-ui/SplitText";
import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export default function VerifyErrorPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 -mt-20">
      <div className="group/icon w-full max-w-sm rounded-2xl border border-white/10 bg-purple-950/20 p-8 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30 text-white text-center">
        
        <AnimatedContent 
          distance={20} 
          direction="vertical" 
          reverse={true} 
          duration={1} 
          delay={0.2}
        >
          <div className="flex justify-center mb-4">
            <XCircle size={48} className="text-purple-100 transition-colors duration-300 ease-in-out group-hover/icon:text-purple-200" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            <ShinyText
              text="Verification Failed"
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
              text="The link you clicked is invalid or the event has been removed by the organizer. Please contact the host for more information."
              className="text-sm text-purple-200/60"
              delay={30}
              duration={1}
              splitType="words"
              tag="p"
              textAlign="center"
            />
          </div>

          <AnimatedContent 
            distance={20} 
            direction="vertical" 
            reverse={false} 
            duration={1} 
            threshold={0.1} 
            delay={0.5}
          >
            <Link 
              href="/" 
              className="group mx-auto min-w-[160px] px-8 h-10 rounded-md border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center w-fit"
            >
              <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                <ArrowLeft 
                  size={16} 
                  className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-1" 
                />
                Back to Home
              </span>
            </Link>
          </AnimatedContent>
        </AnimatedContent>
      </div>
    </div>
  );
}