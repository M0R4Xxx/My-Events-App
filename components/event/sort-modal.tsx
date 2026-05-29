"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ListFilter, CheckCircle2, ChevronDown } from "lucide-react";
import { useRsvpSortStore } from "@/store/use-rsvp-sort-store";

export function SortModal() {

/* State buat ngatur buka-tutup dropdown sama posisi koordinatnya biar nempel pas di tombol */
  const [isOpen, setIsOpen] = useState(false);
  const { sortType, setSortType } = useRsvpSortStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Going", value: "status_going" },
    { label: "Maybe", value: "status_maybe" },
    { label: "Not Going", value: "status_not_going" },
    { label: "Pending", value: "status_pending" },
    ];


/* Hitung posisi tombol di layar, biar portal-nya muncul tepat di bawah tombol */
  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  /* Efek buat nutup dropdown otomatis kalo user ngeklik di luar area tombol/menu */
  useEffect(() => {
  const handleOutside = (e: MouseEvent) => {
    const isClickInsideButton = buttonRef.current?.contains(e.target as Node);
    const isClickInsideDropdown = dropdownRef.current?.contains(e.target as Node);

    if (!isClickInsideButton && !isClickInsideDropdown) {
      setIsOpen(false);
    }
  };
  document.addEventListener("mousedown", handleOutside);
  return () => document.removeEventListener("mousedown", handleOutside);
}, []);

const currentLabel = options.find((opt) => opt.value === sortType)?.label || "Newest";

  return (
    <>
    {/* Tombol pemicu dropdown, pake ref buat nentuin posisi menu */}
      <button
        ref={buttonRef}
        onClick={() => { updateCoords(); setIsOpen(!isOpen); }}
        className="group flex w-[160px] flex-nowrap items-center gap-2 px-4 py-2 text-[13px] sm:text-sm rounded-lg border border-white/60 bg-purple-600 hover:bg-purple-700 text-white  font-bold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40"
        >
        <ListFilter 
            size={16} 
            strokeWidth={3}
            className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] text-white hover:text-purple-100 active:scale-90 ${
                isOpen ? "-rotate-12" : "rotate-0"
            }`} 
            />
        
        <span className="flex-1 text-center truncate min-w-0">
            {currentLabel}
        </span>
        
        <ChevronDown 
        size={16} 
        strokeWidth={3}
        className={`transition-all duration-200 ease-in-out text-white hover:text-purple-100 active:scale-90 ${isOpen ? "rotate-180" : ""}`} 
        />
        </button>

    {/* Pake createPortal biar menu dropdown gak kena masalah overflow/z-index di parent container */}
      {isOpen && createPortal(
        <div 
            ref={dropdownRef}
            role="menu"
            className="absolute py-1 rounded-lg bg-purple-950 border border-white/10 shadow-2xl z-[9999] animate-in fade-in zoom-in-95 duration-200"
            style={{ top: `${coords.top}px`, left: `${coords.left}px`, width: '160px' }}
        >
            {options.map((opt) => {
            const isSelected = sortType === opt.value;
            return (
                <button
                key={opt.value}
                type="button"
                className={`w-full px-3 py-1.5 text-xs sm:text-[14px] font-semibold text-left text-purple-100 hover:bg-white/10 transition-colors flex items-center justify-between ${
                    isSelected ? "bg-white/5" : ""
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    setSortType(opt.value as any);
                    setIsOpen(false);
                }}
                >
                {opt.label}
                {isSelected && <CheckCircle2 size={15} className="text-white-100" />}
                </button>
            );
            })}
        </div>,
        document.body
        )}
    </>
  );
}