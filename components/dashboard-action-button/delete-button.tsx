"use client";
import { Trash2 } from "lucide-react";

{/* Tombol hapus dengan warna merah */}
export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className=" group p-2 -translate-y-[1px] rounded-lg border border-white/10 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
    >
      <Trash2 
        size={16} 
        className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-20" 
      />
    </button>
  );
}