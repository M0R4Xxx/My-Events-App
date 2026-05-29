"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  /* Fungsi buat nyalin teks ke clipboard, ada delay 3 detik buat balikin icon ke semula */
  const handleCopy = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
    /* Reset state biar icon copy muncul lagi setelah 3 detik */
      setTimeout(() => setCopied(false), 3000); 
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  return (
    <div className="group h-9 w-9 -translate-y-[2px] rounded-lg border border-white/60 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shrink-0">
      <button
        onClick={handleCopy}
        disabled={copied}
        title="Salin link"
        className="flex items-center justify-center w-full h-full"
      >
        {copied ? (
          <Check size={16} className="text-white" />
        ) : (
          <Copy 
            size={16} 
            className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-12" 
          />
        )}
      </button>
    </div>
  );
}