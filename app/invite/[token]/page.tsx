import { EventDetailContent } from "@/components/event-detail-content";
import { InviteRsvpContent } from "@/components/invite-rsvp-content";
        
export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ submitted?: string, status?: string }>; 
}) {    
  const { token } = await params;
  const query = await searchParams;

  // nerusin token dari URL dan status submit ke komponen konten
  // untuk menentukan apakah form harus ditampilkan atau status berhasil.
  return (
    <InviteRsvpContent 
    token={token} 
    submitted={query.submitted === "1"} 
    searchParams={searchParams} 
    />
  );
} 