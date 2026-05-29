"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import SplitText from "@/components/animation-ui/SplitText";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";

interface ToastProps {
  message: string;
  type: "error" | "success";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {

  /* Efek buat nutup toast otomatis setelah 4 detik */
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ 
            opacity: 0, 
            y: -20, 
            transition: { duration: 0.3, ease: "easeInOut" } 
        }}
        className={`fixed top-20 left-0 right-0 z-[100] mx-auto w-fit min-h-[52px] min-w-[280px] max-w-[92%] md:max-w-xl flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md overflow-hidden ${
          type === "error"
            ? "bg-red-950/90 border-red-500/50 text-red-100"
            : "bg-emerald-950/90 border-emerald-500/50 text-emerald-100"
        }`}
      >

      { /* Tampilan Toastnya */ }
        <div className="flex items-center">
          <AnimatedContent
            distance={10} 
            direction="horizontal"
            reverse={true}
            duration={1}
            threshold={0.1}
            delay={0.5}
          >
            {type === "error" ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
          </AnimatedContent>
        </div>
        
        <div className="flex-1 flex items-center overflow-hidden pr-1">
          <SplitText
            text={message}
            className="text-xs md:text-sm font-medium leading-snug text-center"
            delay={10}
            duration={0.5}
            splitType="words"
            tag="p"
            textAlign="center"
          />
        </div>
        
        <div className="flex items-center">
          <AnimatedContent
            distance={10}
            direction="horizontal"
            reverse={false}
            duration={1}
            threshold={0.1}
            delay={0.5}
          >
            <button 
              onClick={onClose}
              className="flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/15 p-1.5 rounded-full transition-all shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </AnimatedContent>
        </div>
      </motion.div>
  );
}