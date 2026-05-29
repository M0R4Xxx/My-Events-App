"use client";
import { useFormStatus } from "react-dom";
import { Link } from "lucide-react";

interface GenerateInviteButtonProps {
  disabled?: boolean;
}

export function GenerateInviteButton({ disabled }: GenerateInviteButtonProps) {

  /* Pake useFormStatus buat nangkep status loading dari form, biar tombol otomatis disabled pas lagi proses */
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="mt-6 group px-4 py-2 text-[13px] sm:px-5 sm:py-2 sm:text-sm rounded-lg border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
    >
      <span className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
        {pending ? "Generating Invite Link..." : disabled ? "Link Already Generated" : (
          <>
            Generate Link
            <Link 
              size={14} 
              className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-90 group-hover:translate-x-1" 
            />
          </>
        )}
      </span>
    </button>
  );
}