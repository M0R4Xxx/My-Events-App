import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EventTimer } from "@/components/timer/event-timer"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import ShinyText from "@/components/animation-ui/ShinyText";
import SplitText from "@/components/animation-ui/SplitText";
import { Calendar, MapPin } from "lucide-react";

export default async function VerifySuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const query = await searchParams;
  const rsvpId = query.rsvpId;

  // Pastikan rsvpId ada, jika tidak, arahkan ke 404 agar user tidak melihat halaman kosong
  if (!rsvpId) notFound();

  // Mengambil data RSVP beserta detail event dan pemiliknya dalam satu query (optimasi)
  const rsvp = await prisma.eventRsvp.findUnique({
    where: { id: rsvpId },
    include: {
      event: { 
        include: { owner: true } 
      }
    }
  });

  // Jika record tidak ditemukan di database, anggap link invalid
  if (!rsvp) notFound();
  
  const { event } = rsvp;
  const { owner } = event;

  const formattedDate = event.eventDate 
    ? event.eventDate.toLocaleDateString('id-ID', { dateStyle: 'full' })
    : "No date specified";

  return (
    <div className="flex w-full justify-center pt-4">
      <div className="py-8 max-w-2xl w-full rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
        
      {/* Info undangan dari pembuate */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2">
            <AnimatedContent 
              distance={20} 
              direction="horizontal" 
              reverse={false} 
              duration={1} 
              threshold={0} 
              delay={0.6}
            >
              <div className="text-xs sm:text-[14px] text-center font-semibold tracking-wide uppercase flex flex-col items-center">
                <ShinyText
                  text="An invitation from the user below"
                  speed={5}
                  delay={0}
                  color="#c084fc"
                  shineColor="#ffffff"
                  spread={100}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
                <ShinyText
                  text=" See event details"
                  speed={5}
                  delay={0}
                  color="#c084fc"
                  shineColor="#ffffff"
                  spread={100}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </div>
            </AnimatedContent>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-center gap-6 sm:ml-8.5 mb-6">
          <AnimatedContent
            distance={50}
            direction="horizontal"
            reverse={true}
            duration={1}
            threshold={0.1}
            delay={0.5}
          >
            <div className="group/avatar relative h-24 w-24 flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-purple-600 border-[3px] border-white/90 flex items-center justify-center shadow-[0_0_50px_15px_rgba(168,85,247,0.6)] overflow-hidden transition-all duration-300 group-hover/avatar:scale-105 cursor-pointer">
                {owner.avatarUrl ? (
                  <img 
                    src={owner.avatarUrl} 
                    alt={owner.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                // Fallback jika tidak ada avatar: ambil inisial nama
                  <span className="text-4xl font-bold text-white">
                    {owner.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </AnimatedContent>

        {/* Info pembuat event */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1 w-full min-w-0">
            <h1 className="text-2xl font-bold tracking-tight w-full flex justify-center sm:justify-start">
              <div 
                className="truncate break-words leading-tight max-w-[90%] sm:max-w-[90%]"
                style={{ 
                  maskImage: 'linear-gradient(to right, black 85%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)',
                  overflow: 'hidden'
                }}
              >
                <ShinyText
                  text={owner.name}
                  speed={5}
                  delay={0}
                  color="#ffffff"
                  shineColor="#c181ff"
                  spread={120}
                  direction="left"
                />
              </div>
            </h1>
            <div 
              className="w-full flex justify-center sm:justify-start"
              style={{ 
                maskImage: 'linear-gradient(to right, black 85%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)',
                overflow: 'hidden'
              }}
            >
              <div className="max-w-[98%] sm:max-w-[88%] truncate">
                <SplitText
                  text={owner.email}
                  className="text-purple-300/90 text-sm font-medium"
                  delay={30}
                  duration={1}
                  splitType="words"
                  tag="p"
                  textAlign="center"
                />
              </div>
            </div>
          </div>
        </div>
        <div 
          className="w-full h-[2px] bg-white/20 mb-6 mt-4" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
          }}
        ></div>

      {/* Event details */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 w-full max-w-2xl pr-14 min-w-0">
            <div className="break-words hyphens-auto overflow-hidden">
              <AnimatedContent 
                distance={30} 
                direction="horizontal" 
                reverse={true} 
                duration={1} 
                threshold={0} 
                delay={0.7}
              >
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, #ffffff, #d8b4fe)',
                  }}
                >
                  {event.title}
                </span>
              </AnimatedContent>
            </div>
          </h1>
          
        {/* Detail waktu dan lokasi */}
          <div className="space-y-3">
            <AnimatedContent 
              distance={30} 
              direction="horizontal" 
              reverse={true} 
              duration={1} 
              threshold={0} 
              delay={0.8}
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm text-purple-200 leading-relaxed">
                <div className="group p-2 -translate-y-[2px] rounded-lg border border-white/60 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shrink-0">
                  <Calendar 
                    size={16} 
                    className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-12" 
                  />
                </div>
                <span className="flex items-center -translate-y-[2px] font-semibold">
                  {event.eventDate ? new Date(event.eventDate).toLocaleString() : "No date"}
                </span>
              </div>
            </AnimatedContent>

            {event.location && (
              <AnimatedContent 
                distance={30} 
                direction="horizontal" 
                reverse={false} 
                duration={1} 
                threshold={0} 
                delay={0.9}
              >
                <div className="flex items-center gap-3 text-xs sm:text-sm text-purple-200 leading-tight">
                  <div className="group p-2 -translate-y-[2px] rounded-lg border border-white/60 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shrink-0">
                    <MapPin 
                      size={16} 
                      className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-12" 
                    />
                  </div>
                  <span className="break-words hyphens-auto overflow-hidden -translate-y-[2.5px] font-semibold">
                    {event.location}
                  </span>
                </div>
              </AnimatedContent>
            )}
          </div>

        {/* Deskripsi event  */}
          {event.description && (
            <div className="w-full min-w-0 mt-4 pl-4 relative mb-2 ">
              <div 
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-white to-purple-500" 
              />
              <AnimatedContent 
                distance={20} 
                direction="vertical" 
                reverse={true} 
                duration={1} 
                threshold={0} 
                delay={0.9}
              >
                <h3 className="text-xs sm:text-sm font-bold text-purple-100 uppercase tracking-wider mb-2">
                  <ShinyText
                    text="Event Description"
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
                </h3>
              </AnimatedContent>
              <AnimatedContent 
                  distance={20} 
                  direction="vertical" 
                  reverse={false} 
                  duration={1} 
                  threshold={0} 
                  delay={0.9}
                >
                  <p className="text-purple-100 text-sm sm:text-base max-w-3xl pr-2 leading-snug whitespace-normal font-medium break-words hyphens-auto overflow-hidden">
                    {event.description}
                  </p>
              </AnimatedContent>
            </div>
          )}
           <div 
          className="w-full h-[2px] bg-white/20 mb-4 mt-3" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
          }}
        ></div>
          <div  className="text-lg sm:text-xl font-bold text-purple-100 tracking-wider mt-2 text-center">
            <ShinyText
              text="Countdown To The Event"
              speed={5}
              delay={0}
              color="#ffffff"
              shineColor="#c181ff"
              spread={100}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
          </div>

      {/* Countdown timer */}
        <EventTimer targetDate={event.eventDate} />
        </div>
    
    {/* Footer konfirmasi */}
      <AnimatedContent 
        distance={20} 
        direction="vertical" 
        reverse={false} 
        duration={1} 
        threshold={0} 
        delay={0.8}
      >
        <p className="text-xs sm:text-sm text-purple-200 mt-8 text-center px-6">
          Verification Successful! Your attendance has been confirmed. We look forward to your presence at this event and hope you are pleased to attend.
        </p>
      </AnimatedContent>
  </div>
</div>
  );
}