"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; 
import { ChevronDown, ListChecks, CheckCircle2 } from "lucide-react";

interface Coords {
  top: number;
  left: number;
  right: number;
  width: number;
}

export function CustomSelect({ name, options, defaultValue, className = "" }: { 
  name: string, 
  options: { label: string, value: string }[],
  defaultValue: string,
  className?: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options.find(o => o.value === defaultValue) || options[0]);
  
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0, right: 0, width: 0 });
  
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Hitung koordinat posisi tombol buat penempatan portal
  const updateCoords = () => {
  if (buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX, 
      width: rect.width,
    });
  }
};

  // Sync posisi dropdown kalau user scroll atau resize layar 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isInsideButton = buttonRef.current?.contains(e.target as Node);
      const isInsideDropdown = (e.target as HTMLElement).closest('[role="menu"]'); 

      if (!isInsideButton && !isInsideDropdown) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) updateCoords();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const toggle = () => {
    updateCoords();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <input type="hidden" name={name} value={selected.value} />
      
      <ListChecks 
        strokeWidth={2.5} 
        className={`absolute left-3 top-0 bottom-0 my-auto z-10 w-4 h-4 pointer-events-none transition-colors ${isOpen ? "text-purple-500" : "text-purple-400/50 peer-focus:text-purple-500"}`} 
      />

    {/* Button dropdownnya */}
      <button
        type="button"
        ref={buttonRef}
        onClick={toggle}
        className={`peer w-full flex items-center justify-between pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all ${className}`}
      >
        <span className={selected.value === "" ? "text-purple-200/40" : "text-white"}>
          {selected.label || "Select option"}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-all duration-200 ease-in-out text-purple-400/50 hover:text-purple-300 active:scale-90 ${isOpen ? "rotate-180" : ""}`} 
        />  
      </button>

    {/* Render dropdown di luar DOM tree utama pake Portal */}
      {isOpen && createPortal(
        <div 
          role="menu"
          className="absolute mt-1 py-1 rounded-lg bg-purple-950 border border-white/10 shadow-2xl z-[9999] animate-in fade-in zoom-in-95 duration-200"
          style={{ 
            top: `${coords.top}px`, 
            left: `${coords.right - 200}px`, 
            width: '200px'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === selected.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`w-full px-3 py-1.5 text-xs sm:text-[14px] font-semibold text-left text-purple-100 hover:bg-white/10 transition-colors flex items-center justify-between ${isSelected ? "bg-white/5" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(opt);
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
    </div>
  );
}