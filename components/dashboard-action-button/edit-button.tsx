"use client";
import { Pencil } from "lucide-react";

{/* Tombol edit dengan warna biru */}
export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group p-2 -translate-y-[2px] rounded-lg border border-white/10 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
    >
      <Pencil 
        size={16} 
        className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-12"
      />
    </button>
  );
}