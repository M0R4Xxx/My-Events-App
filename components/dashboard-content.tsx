import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma, RsvpStatus } from "@prisma/client";
import { UserSync } from "./user-sync";
import { Plus, CalendarPlus } from "lucide-react"; 
import ShinyText from "@/components/animation-ui/ShinyText"; 
import SplitText from "@/components/animation-ui/SplitText"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import { DashboardEvents } from "@/components/dashboard-content/dashboard-events";

type EventWithRsvps = Prisma.EventGetPayload<{
  select: {
    id: true;
    title: true;
    description: true; 
    eventDate: true;
    location: true;
    rsvps: { select: { status: true } };
  };
}>;

/* Fungsi untuk menghitung jumlah RSVP berdasarkan status (going, maybe, not_going) */
export function countByStatus(rsvps: { status: RsvpStatus }[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;
  for (const r of rsvps) {
    if (r.status === "going") goingCount += 1;
    else if (r.status === "maybe") maybeCount += 1;
    else if (r.status === "not_going") notGoingCount += 1;
  }
  return { goingCount, maybeCount, notGoingCount };
}

type EventSummary = {
  id: string;
  title: string;
  description: string | null; 
  eventDate: string | null;
  location: string | null;
  goingCount: number;
  maybeCount: number;
  notGoingCount: number;
};

/* Komponen utama Dashboard untuk menampilkan ringkasan semua event user */
export async function DashboardContent({ userId }: { userId: string }) {
  try {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, avatarUrl: true }
  });
  const rows: any[] = await prisma.$queryRaw`
    SELECT 
      e.id, 
      e.title, 
      e.description, 
      e.event_date AS "eventDate", 
      e.location,
      (SELECT COUNT(*) FROM event_rsvps r WHERE r.event_id = e.id AND r."isVerified" = true AND r.status = 'going')::int as "goingCount",
      (SELECT COUNT(*) FROM event_rsvps r WHERE r.event_id = e.id AND r."isVerified" = true AND r.status = 'maybe')::int as "maybeCount",
      (SELECT COUNT(*) FROM event_rsvps r WHERE r.event_id = e.id AND r."isVerified" = true AND r.status = 'not_going')::int as "notGoingCount"
    FROM events e
    WHERE e.owner_user_id = ${userId}::uuid
    ORDER BY e.created_at DESC;
  `;

  /* Mapping data hasil query ke format EventSummary yang lebih rapi */
  const events: EventSummary[] = rows.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    eventDate: e.eventDate ? new Date(e.eventDate).toISOString() : null,
    location: e.location,
    goingCount: e.goingCount,
    maybeCount: e.maybeCount,
    notGoingCount: e.notGoingCount,
  }));

  return (
    <div className="flex flex-1 flex-col gap-6">
      <UserSync userData={user} />
      

      <div className="flex flex-wrap items-center justify-between gap-6 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            <ShinyText
              text="Your Event Command Center"
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
          </h1>

          <SplitText
            text="Your complete dashboard to create, track, and manage your upcoming events with professional precision, keeping you in total control of every attendee response in real-time."
            className="text-purple-100 text-sm sm:text-base max-w-sm md:max-w-lg lg:max-w-2xl pr-2"
            delay={30}
            duration={1}
            splitType="words"
            tag="p"
            textAlign="left"
          />
        </div>

        <AnimatedContent
          distance={50}
          direction="horizontal"
          reverse={false}
          duration={1}
          threshold={0.1}
          delay={0.5}
          
        >
          <Link 
            href="/events/new"
            className="group inline-flex items-center gap-2 px-6 py-2 sm:px-8 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/90 hover:bg-white text-black font-bold border border-black/40 backdrop-blur-sm shadow-lg shadow-purple-950/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95"
          >
            Create Event
            <Plus 
              size={16} 
              className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-90" 
            />
          </Link>
        </AnimatedContent>
      </div>

    { /* Kondisi untuk menampilkan pesan kosong atau list event via komponen DashboardEvents */ }
      {events.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-purple-950/20 px-8 py-10 backdrop-blur-xl shadow-xl text-center transition-colors duration-300 ease-in-out hover:bg-purple-950/30">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <ShinyText
              text="No events yet"
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
            <CalendarPlus className="text-purple-300" size={24} />
          </h2>
          <div className="text-sm text-purple-200/60 max-w-sm mx-auto">
            <SplitText
              text="Your event dashboard is currently empty. Create your first event today to start collecting RSVPs, managing guest lists, and tracking responses in real-time."
              delay={30}
              duration={1}
              splitType="words"
              tag="p"
              textAlign="center"
            />
          </div>
        </div>
      ) : (
        <DashboardEvents events={events} /> 
      )}
    </div>
  );
} catch (error) {

    /* Penanganan error jika gagal mengambil data dari database */
    console.error("[Dashboard Read Error]:", error);
    throw new Error("Gagal memuat dashboard. Silakan coba lagi nanti.");
  }
}