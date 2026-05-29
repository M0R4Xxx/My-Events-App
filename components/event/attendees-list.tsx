"use client";
import { useMemo, useEffect } from "react";
import { useRsvpSortStore } from "@/store/use-rsvp-sort-store";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import { Users } from "lucide-react";
import { getStatusStyles } from "@/lib/utils"; 
import ShinyText from "@/components/animation-ui/ShinyText";
import SplitText from "@/components/animation-ui/SplitText";

export function AttendeesList({ rsvps }: { rsvps: any[] }) {
  const { sortType, setSortType } = useRsvpSortStore();
  
  useEffect(() => {
    setSortType("newest");
  }, [setSortType]); 

  // Filter & sorting data rsvp, pake useMemo biar gak hitung ulang terus-terusan tiap re-render 
  const sortedRsvps = useMemo(() => {
    let result = [...rsvps];
    if (sortType.startsWith('status_')) {
      const statusMap: Record<string, string> = {
        status_going: 'going', 
        status_maybe: 'maybe',
        status_not_going: 'not_going',
        status_pending: 'pending'
        };
      const targetStatus = statusMap[sortType];
      
      result = result.filter(r => {
        if (targetStatus === 'pending') {
          return r.isVerified === false;
        } else {
          return r.isVerified === true && r.status === targetStatus;
        }
      });
    }
    
    // Sort berdasarkan waktu respon, default ke yang paling baru
    return [...result].sort((a, b) => { 
      if (sortType === 'newest') return new Date(b.respondedAt).getTime() - new Date(a.respondedAt).getTime();
      if (sortType === 'oldest') return new Date(a.respondedAt).getTime() - new Date(b.respondedAt).getTime();
      return new Date(b.respondedAt).getTime() - new Date(a.respondedAt).getTime();
    });
  }, [rsvps, sortType]); 

  return (
    <div className="space-y-4">

    {/* Kalo list rsvp kosong, tampilin UI ginian biar gk sepi banget */}
      {sortedRsvps.length === 0 ? (
        <div className="flex justify-center items-center py-4">
            <div 
                className="max-w-md rounded-2xl border border-white/20 bg-purple-950/20 p-8 backdrop-blur-xl shadow-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-purple-950/35 hover:border-purple-500 text-center min-w-0"
            >
            <AnimatedContent 
                key={sortType}
                distance={10} 
                direction="vertical" 
                reverse={true} 
                duration={1} 
                threshold={0.1} 
                delay={0.6}
            >  
            <h2 className="text-[17px] sm:text-lg font-semibold text-white mb-2 flex items-center justify-center gap-3">
                <ShinyText
                text="No guests found"
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
                <Users className="text-purple-300" size={20} />
            </h2>
            </AnimatedContent>  
            <SplitText
                text="We couldn't find any guests matching this filter. Try adjusting your selection to view a different set of RSVP responses."
                className="text-purple-200 text-[13px] font-medium sm:text-[15px] mt-2"
                delay={30}
                duration={1}
                splitType="words"
                tag="p"
                textAlign="center"
            />
            </div>
        </div>
      ) : (
    /* Kalo ada datanya, grid-in semua rsvp-nya */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-1">
        {sortedRsvps.map((rsvp) => (
        <div key={rsvp.id}
            className=" rounded-2xl border border-white/20 bg-purple-950/20 p-5 backdrop-blur-xl shadow-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-purple-950/35 hover:border-purple-500 min-w-0">
                <div className="flex items-start justify-between gap-1 mb-1 min-w-0">
                <div className="min-w-0 flex-1">
                    <AnimatedContent 
                    key={`${rsvp.id}-${sortType}`}
                    distance={10} 
                    direction="horizontal" 
                    reverse={true} 
                    duration={1} 
                    threshold={0.1} 
                    delay={0.6}
                    >
                    <h3 className="text-[17px] sm:text-lg md:text-[19px] lg:text-xl font-bold text-white flex items-center justify-start gap-2 min-w-0">
                        {rsvp.isVerified && <Users className="text-purple-300 shrink-0" size={19} />}
                        <span 
                            className="truncate block min-w-0 bg-clip-text text-transparent"
                            style={{ 
                            backgroundImage: 'linear-gradient(to right, #ffffff, #d8b4fe)',
                            }}
                        >
                        {rsvp.name}
                        </span>
                    </h3>
                    </AnimatedContent>
                </div>
                
                </div>
                <div className="space-y-1.5 mt-auto mb-4">
                <AnimatedContent 
                    key={`${rsvp.id}-${sortType}`}
                    distance={10} 
                    direction="horizontal" 
                    reverse={true} 
                    duration={1} 
                    threshold={0.1} 
                    delay={0.8}
                >
                    <p className="text-purple-200 text-sm font-semibold md:text-[14.5px] lg:text-[15px] pr-4 truncate">
                    {rsvp.email}
                    </p>
                </AnimatedContent>
                </div>

                <div className="mt-auto grid grid-cols-[1fr,auto] items-center gap-3">
                <AnimatedContent 
                    key={`${rsvp.id}-${sortType}`}
                    distance={10} 
                    direction="vertical" 
                    reverse={false} 
                    duration={1} 
                    threshold={0} 
                    delay={0.7}
                    className="min-w-0"
                >
                    <p className="text-xs md:text-[12.5px] lg:text-[13px] text-purple-300/80 justify-start font-semibold truncate block">
                    Submitted : {new Date(rsvp.respondedAt).toLocaleString('id-ID', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                    </p>
                </AnimatedContent>
                <div className="flex justify-end">
                <span className={`whitespace-nowrap w-fit px-3 py-1 md:px-3.5 md:py-1.5 rounded-md md:rounded-lg text-xs font-semibold border backdrop-blur-xl shadow-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 uppercase shrink-0 ${getStatusStyles(rsvp.status, rsvp.isVerified)}`}>
                    {rsvp.isVerified ? rsvp.status.replace("_", " ") : "Pending"}
                </span>
                </div>
                </div>
            </div>
            ))}
        </div>
        )}
        {/* Footer penjelas: Biar user ngerti kenapa ada status 'Pending' */}
            <AnimatedContent 
                distance={10} 
                direction="vertical" 
                reverse={false} 
                duration={1} 
                threshold={0} 
                delay={0.7}
                className="min-w-0"
            >
            <p className="w-full text-[10.5px] text-purple-300/50 italic">
                This list tracks your event RSVPs (Going, Maybe, Not Going). Note: "Pending" status means the guest hasn't verified their email, so they are excluded from the final attendee count.
            </p>
            </AnimatedContent>
        </div>
    );
}