"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";

export function SubmitButton() {

  /* Pake useFormStatus juga, biar user tau kalo RSVP-nya lagi diproses sama server */
  const { pending } = useFormStatus();

  return (
    <AnimatedContent 
      distance={10} 
      direction="vertical" 
      reverse={false} 
      duration={1} 
      threshold={0.1} 
      delay={0.5}
    >
      <button
        type="submit"
        disabled={pending}
        className="group w-full px-4 py-2 text-[13px] sm:px-5 sm:py-2 sm:text-sm rounded-lg border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
          {pending ? "Processing your RSVP..." : (
            <>
              Accept This Invite
              <CheckCircle2 
                size={14} 
                className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-12 group-hover:translate-x-1" 
              />
            </>
          )}
        </span>
      </button>
    </AnimatedContent>
  );
}