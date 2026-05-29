"use client";
import { useState, useEffect } from "react";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";

/* State buat nyimpen nilai hari, jam, menit, dan detik yang bakal ditampilin di layar */
export function EventTimer({ targetDate }: { targetDate: Date | null }) {
  const [time, setTime] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  /* Efek buat ngejalanin interval perhitungan mundur setiap 1 detik sampai targetDate tercapai */
  useEffect(() => {
    if (!targetDate) return;

    /* Logika matematika buat ngitung selisih waktu sekarang dengan waktu acara */
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
      } else {
        setTime({
          days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
          minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
          seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="mt-2 flex flex-col items-center gap-3">
    { /* Mapping array data waktu (D, H, M, S) untuk ngerender kotak penunjuk waktu */ }
      <div className="flex gap-2">
        {[
          { label: "D", value: time.days },
          { label: "H", value: time.hours },
          { label: "M", value: time.minutes },
          { label: "S", value: time.seconds },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-[3px] w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-purple-950/30 border border-white/20 backdrop-blur-xl shadow-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-purple-950/40 hover:border-purple-500">
              <AnimatedContent
                distance={10}
                direction="vertical"
                reverse={true}
                duration={0.5}
                delay={0.5 + (i * 0.1)}
              >
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {item.value}
                </span>
              </AnimatedContent>
            </div>

          { /* Label di bawah angka (D/H/M/S) */ }
            <AnimatedContent
              distance={20}
              direction="vertical"
              reverse={false}
              duration={0.5}
              delay={0.7 + (i * 0.1)}
            >
              <span className="text-[13px] sm:text-[15px] font-bold text-purple-200/70 mt-1 uppercase tracking-widest">
                {item.label}
              </span>
            </AnimatedContent>
          </div>
        ))}
      </div>
    </div>
  );
}