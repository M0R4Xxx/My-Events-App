import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { submitOrUpdateRsvpAction } from "@/lib/actions/events";
import { Calendar, MapPin } from "lucide-react";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import ShinyText from "@/components/animation-ui/ShinyText";
import { RsvpForm } from "./rsvp/rsvp-form";
import { ToastWrapper } from "@/components/toast/toast-wrapper"; 

/* Komponen utama untuk menampilkan halaman undangan event bagi tamu */
export async function InviteRsvpContent({
  token,
  submitted,
  searchParams,
}: {
  token: string;
  submitted: boolean;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const query = await searchParams;
  const isAlreadyVerified = query.status === "already_verified";
  
  /* Mencari data event berdasarkan token undangan yang diberikan */
  const row = await prisma.eventInvite.findFirst({
    where: { token },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          eventDate: true,
        },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const e = row.event;
  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
  };

  /* Mendefinisikan action server untuk memproses input RSVP dari tamu */
  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);

  return (
    <ToastWrapper>
    <div className="mx-auto w-full max-w-2xl pt-4 p-1">
    { /* Menampilkan detail event (Judul, Waktu, Lokasi, Deskripsi) */ }
      <div className="pb-5 rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
        <div className="mb-6">
          <div className="mb-2">
            <AnimatedContent 
              distance={20} 
              direction="horizontal" 
              reverse={false} 
              duration={1} 
              threshold={0} 
              delay={0.6}
            >
              <div className="text-xs sm:text-[13px] font-semibold tracking-wide uppercase">
                <ShinyText
                  text="Please confirm your attendance"
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
          
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 w-full max-w-2xl pr-14 min-w-0">
            <div className="break-words hyphens-auto overflow-hidden">
              <AnimatedContent distance={20} direction="horizontal" reverse={false} duration={1} threshold={0} delay={0.8}>
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(to right, #ffffff, #d8b4fe)' }}
                >
                  {event.title}
                </span>
              </AnimatedContent>
            </div>
          </h1>

          <div className="space-y-3">
            <AnimatedContent distance={30} direction="horizontal" reverse={true} duration={1} threshold={0} delay={0.8}>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-purple-200 leading-relaxed">
                <div className="group p-2 -translate-y-[2px] rounded-lg border border-white/60 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shrink-0">
                  <Calendar size={16} className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-12" />
                </div>
                <span className="flex items-center -translate-y-[2px] font-semibold">
                  {event.eventDate ? new Date(event.eventDate).toLocaleString() : "No date"}
                </span>
              </div>
            </AnimatedContent>

            {event.location && (
              <AnimatedContent distance={30} direction="horizontal" reverse={false} duration={1} threshold={0} delay={0.9}>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-purple-200 leading-tight">
                  <div className="group p-2 -translate-y-[2px] rounded-lg border border-white/60 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shrink-0">
                    <MapPin size={16} className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-12" />
                  </div>
                  <span className="break-words hyphens-auto overflow-hidden -translate-y-[2.5px] font-semibold">
                    {event.location}
                  </span>
                </div>
              </AnimatedContent>
            )}
          </div>

          {event.description && (
            <div className="w-full min-w-0 mt-5 pl-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-[2.5px] rounded-full bg-gradient-to-b from-white to-purple-500" />
              <AnimatedContent distance={20} direction="vertical" reverse={true} duration={1} threshold={0} delay={0.9}>
                <h3 className="text-xs sm:text-sm font-bold text-purple-100 uppercase tracking-wider mb-1.5">
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
              <AnimatedContent distance={20} direction="vertical" reverse={false} duration={1} threshold={0} delay={0.9}>
                <p className="text-purple-100 text-[13px] sm:text-[15px] max-w-3xl pr-2 leading-tight whitespace-normal font-medium break-words hyphens-auto overflow-hidden">
                  {event.description}
                </p>
              </AnimatedContent>
            </div>
          )}
        </div>

        { /* Form RSVP: Komponen interaktif untuk tamu memilih status kehadiran */ }
          <RsvpForm submitRsvpForToken={submitRsvpForToken} />
      </div>
    </div>
    </ToastWrapper>
  );
}