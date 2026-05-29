import { EventDetailContent } from "@/components/event-detail-content";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getSession();

  // mastikan user sudah login sebelum bisa mengakses detail event.
  // Kalau session nggak valid, arahkan ke login.
  if (!session || !session.data || !session.data.user) {
    redirect("/login");
  }
  return <EventDetailContent userId={session.data.user.id} eventId={eventId} />;
}