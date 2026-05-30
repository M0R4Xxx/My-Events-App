
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import Link from "next/link";
import { createInviteLinkAction } from "@/lib/actions/events";
import { GenerateInviteButton } from "@/components/invite/generate-invite-button";
import { CopyButton } from "@/components/invite/copy-button";
import { ArrowLeft, MapPin, Calendar, CheckCircle2, Info, Inbox, Users } from "lucide-react";
import ShinyText from "@/components/animation-ui/ShinyText";
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import SplitText from "@/components/animation-ui/SplitText";
import { AttendeesList } from "@/components/event/attendees-list";
import { SortModal } from "@/components/event/sort-modal";


/* Komponen utama untuk menampilkan detail spesifik sebuah event, manajemen link undangan, dan daftar tamu */
export async function EventDetailContent({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) {
  const row = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      invite: { select: { token: true } },
      rsvps: { 
        where: { isVerified: true },
        select: { status: true } 
      },
    },
  });

  if (!row) {
    notFound();
  }

  /* Menghitung ringkasan status RSVP dan menyiapkan objek event untuk dirender */
  const counts = countByStatus(row.rsvps);

  const event = {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    inviteToken: row.invite?.token ?? null,
    goingCount: counts.goingCount,
    maybeCount: counts.maybeCount,
    notGoingCount: counts.notGoingCount,
  };

  const formattedDate = event.eventDate 
  ? (() => {
      const date = new Date(event.eventDate);
      const dayPart = date.toLocaleDateString("id-ID", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: "Asia/Jakarta"
      });
      const timePart = date.toLocaleTimeString("id-ID", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: "Asia/Jakarta"
      }).replace(".", ":");
      return `${dayPart}, ${timePart}`;
    })()
  : "No date";

  /* Mengambil daftar tamu (RSVP) untuk event tersebut, diurutkan berdasarkan waktu respons terbaru */
  const rsvpRows = await prisma.eventRsvp.findMany({
    where: { eventId },
    orderBy: { respondedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      respondedAt: true,
      isVerified: true,
    },
  });

  const rsvps = rsvpRows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    status: r.status,
    respondedAt: r.respondedAt.toISOString(),
    isVerified: r.isVerified, 
  }));

  const createInviteActionForEvent = createInviteLinkAction.bind(null, event.id);

  const inviteUrl = event.inviteToken
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}`
    : null;

  return (
    <div className="flex flex-col gap-6 p-1">

    { /* HEADER: Menampilkan judul, waktu, lokasi, dan deskripsi event */ }
      <div className="flex flex-wrap items-start justify-between gap-6 w-full">
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
                  {formattedDate}
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
                <div className=" flex items-center gap-3 text-xs sm:text-sm text-purple-200 leading-tight">
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
        </div>
        <AnimatedContent 
          distance={30} 
          direction="horizontal" 
          reverse={false} 
          duration={1} 
          threshold={0.1} 
          delay={0.7}
          className="basis-full sm:basis-auto"
        >
          <Link
            href={"/dashboard"}
            className=" -translate-y-0.5 group inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] sm:gap-2 sm:px-5 sm:py-3 sm:text-sm rounded-lg bg-white/90 hover:bg-white text-black font-bold border border-black/40 backdrop-blur-sm shadow-lg shadow-purple-950/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-1"
            />
            Back to Dashboard
          </Link>
        </AnimatedContent>
      </div>

      { /*  Menampilkan counter jumlah tamu (Going, Maybe, Not Going) */ }
      <div className="flex flex-wrap gap-2 items-center">
        <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg bg-green-500/20 text-green-200 text-xs font-medium border border-green-500/20 backdrop-blur-xl shadow-xl shadow-green-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-green-500/30 hover:-translate-y-1">
          Going: {event.goingCount}
        </span>
        <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg bg-yellow-500/20 text-yellow-200 text-xs font-medium border border-yellow-500/20 backdrop-blur-xl shadow-xl shadow-yellow-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-yellow-500/30 hover:-translate-y-1">
          Maybe: {event.maybeCount}
        </span>
        <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg bg-red-500/20 text-red-200 text-xs font-medium border border-red-500/20 backdrop-blur-xl shadow-xl shadow-red-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-red-500/30 hover:-translate-y-1">
          Not Going: {event.notGoingCount}
        </span>
      </div>

    { /* INVITE SECTION: Form/Button untuk generate dan menyalin link undangan */ }
      <div className="rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
        <h2 className="text-lg sm:text-xl text-white font-bold mb-1 w-full">
          <ShinyText
            text="Generate Event Invite Link"
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
        </h2>
        <div className="space-y-4">
          <SplitText
            text="Share this unique link with your guests so they can easily RSVP to your event without needing to create an account."
            className="text-purple-200 text-sm font-medium sm:text-[15px] pr-4"
            delay={30}
            duration={1}
            splitType="words"
            tag="p"
            textAlign="left"
          />
          
          {inviteUrl ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <AnimatedContent 
                    distance={10} 
                    direction="horizontal" 
                    reverse={true} 
                    duration={1} 
                    threshold={0} 
                    delay={0.7}
                    className="w-full"
                  >
                <input 
                  type="text" 
                  value={inviteUrl} 
                  readOnly 
                  className="-translate-y-[2px] peer w-full pl-3 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all placeholder:text-purple-200/40"
                />
                </AnimatedContent>
                <AnimatedContent 
                    distance={10} 
                    direction="horizontal" 
                    reverse={false} 
                    duration={1} 
                    threshold={0} 
                    delay={0.7}
                  >
                  <CopyButton text={inviteUrl} />
                </AnimatedContent>
              </div>
              <AnimatedContent 
                distance={20} 
                direction="vertical" 
                reverse={false} 
                duration={1} 
                threshold={0} 
                delay={0.8}
              >
                <div className="flex items-center gap-1.5 text-xs text-green-400/80 animate-in fade-in slide-in-from-left-1 duration-500">
                  <CheckCircle2 size={15} />
                  <span className="text-[11.5px] sm:text-[12.5px] font-medium">Link has been generated successfully.</span>
                </div>
              </AnimatedContent>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatedContent 
                distance={10} 
                direction="horizontal" 
                reverse={true} 
                duration={1} 
                threshold={0} 
                delay={0.7}
                className="w-full"
              >
              <input 
                type="text" 
                value="No invite link generated yet." 
                readOnly 
                className="-translate-y-[2px] peer w-full pl-3 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-purple-200/40 italic font-mono transition-all"
              />
            </AnimatedContent>
              <AnimatedContent 
                distance={20} 
                direction="vertical" 
                reverse={false} 
                duration={1} 
                threshold={0} 
                delay={0.8}
              >
              <div className="flex items-center gap-1.5 text-xs text-purple-400/80">
                <Info size={15} />
                <span className="text-[11.5px] sm:text-[12.5px] font-medium">Click below to generate your event link.</span>
              </div>
            </AnimatedContent>
            </div>
          )}

          <form action={createInviteActionForEvent}>
            <AnimatedContent 
                distance={20} 
                direction="horizontal" 
                reverse={false} 
                duration={1} 
                threshold={0} 
                delay={0.9}
              >
            <GenerateInviteButton disabled={!!inviteUrl}/>
            </AnimatedContent>
          </form>
        </div>
      </div>

    { /* Menampilkan tabel daftar tamu atau pesan jika daftar masih kosong */ }
      <div className=" rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
        <h2 className="text-lg sm:text-xl text-white font-bold mb-1 w-full">
          <ShinyText
            text="Attendees List Overview"
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
        </h2>
        
        <div className="space-y-4">
          <SplitText
            text="Monitor your event guest list and track real-time RSVP responses here to easily manage your event attendance."
            className="text-purple-200 text-sm font-medium sm:text-[15px] pr-4"
            delay={30}
            duration={1}
            splitType="words"
            tag="p"
            textAlign="left"
          />
            {rsvps.length === 0 ? (
              <>
                <h2 className=" text-[17px] sm:text-lg font-semibold text-white mb-2 flex items-center justify-center gap-3 mt-8">
                  <ShinyText
                    text="No responses yet"
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
                <div className="text-[13px] sm:text-sm text-purple-200/60 max-w-md mx-auto pb-10">
                  <AnimatedContent 
                    distance={20} 
                    direction="vertical" 
                    reverse={false} 
                    duration={1} 
                    threshold={0} 
                    delay={0.9}
                  >
                    <p className="text-center">
                      There are currently no RSVPs for this event. Your guest list will appear here as soon as people start responding to your invitation.
                    </p>
                  </AnimatedContent>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <AnimatedContent 
                    distance={10} 
                    direction="horizontal" 
                    reverse={false} 
                    duration={1} 
                    threshold={0} 
                    delay={0.9}
                  >
                    <SortModal />
                  </AnimatedContent>
                </div>
                <AttendeesList rsvps={rsvps} />
              </div>
              )}
          </div>
        </div>
    </div>
  );
}
