"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";
import { RsvpStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { transporter } from "../email";

/* Memvalidasi dan membersihkan data form untuk pembuatan event */
function parseCreateEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3 || title.length > 120) {
    throw new Error("Title must be between 3 and 120 characters.");
  }
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  return {
    title,
    description: description.length ? description.slice(0, 2000) : null,
    location: location.length ? location.slice(0, 200) : null,
    eventDate: eventDate.length ? eventDate : null,
  };
}
const RSVP_STATUSES = ["going", "maybe", "not_going"] as const;

/* Utility untuk memverifikasi apakah status string valid sesuai dengan RsvpStatus */
function isRsvpStatus(s: string): s is RsvpStatus {
  return (RSVP_STATUSES as readonly string[]).includes(s);
}

/* Memvalidasi dan membersihkan data form untuk RSVP tamu */
function parseRsvp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    throw new Error("Name must be between 2 and 120 characters.");
  }
  const email = String(formData.get("email") ?? "").trim();
  if (email.length < 3 || email.length > 320 || !email.includes("@")) {
    throw new Error("Please enter a valid email.");
  }
  const status = String(formData.get("status") ?? "").trim();
  if (!isRsvpStatus(status)) {
    throw new Error("Invalid RSVP status.");
  }
  return { name, email, status };
}

/* Server action: Membuat event baru di database dan mengarahkan ke halaman detail event */
export async function createEventAction(formData: FormData) {
  try {
  const session = await getSession();
  if (!session?.data?.user) redirect("/auth/sign-in");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  if (title.length < 3 || title.length > 50) {
    throw new Error("Title must be between 3 and 50 characters.");
  }
  if (description.length < 3 || description.length > 98) {
    throw new Error("Description must be between 3 and 98 characters.");
  }
  if (location.length < 3 || location.length > 50) {
    throw new Error("Location must be between 3 and 50 characters.");
  }
  const created = await prisma.event.create({
    data: {
      ownerUserId: session.data.user.id,
      title,
      description: description || null,
      location: location || null,
      eventDate: eventDate ? new Date(eventDate) : null,
    },
  });

  redirect(`/events/${created.id}`);
} catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("[Create Event Error]:", error);
    throw new Error("Gagal membuat event. Silakan periksa kembali data Anda.");
  }
}

/* Server action: Menghapus event spesifik berdasarkan ID */
export async function deleteEventAction(eventId: string) {
  try {
  const session = await getSession();
  if (!session?.data?.user) throw new Error("Unauthorized");
  const event = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: session.data.user.id }
  });

  if (!event) throw new Error("Event not found or unauthorized");
  await prisma.event.delete({
    where: { id: eventId }
  });
  return { success: true };
  } catch (error) {
    console.error("[Delete Event Error]:", error);
    throw new Error("Gagal menghapus event. Silakan coba lagi nanti.");
  }
}

/* Server action: Memperbarui detail informasi event yang sudah ada */
export async function updateEventAction(eventId: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.data?.user) throw new Error("Unauthorized");

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const eventDate = String(formData.get("eventDate") ?? "").trim();
    if (title.length < 3 || title.length > 50) {
      throw new Error("Title must be between 3 and 50 characters.");
    }
    if (description.length < 3 || description.length > 98) {
      throw new Error("Description must be between 3 and 98 characters.");
    }
    if (location.length < 3 || location.length > 50) {
      throw new Error("Location must be between 3 and 50 characters.");
    }

    await prisma.event.update({
      where: { id: eventId, ownerUserId: session.data.user.id },
      data: { title, description, location, eventDate: new Date(eventDate) },
    });

    revalidatePath("/dashboard");
  return { success: true };
    } catch (error) {
      console.error("[Update Event Error]:", error);
      throw new Error("Gagal mengupdate event. Silakan coba lagi nanti.");
    }
}

/* Server action: Membuat token unik untuk link undangan event */
export async function createInviteLinkAction(eventId: string) {
  try {
    const session = await getSession();
    if (!session?.data?.user) {
      throw new Error("Unauthorized.");
    }
    const existingInvite = await prisma.eventInvite.findUnique({
      where: { eventId },
    });
    if (existingInvite) {
      return;
    }
    const token = crypto.randomUUID().replace(/-/g, "");
    await prisma.eventInvite.create({
      data: { eventId, token },
    });

    revalidatePath(`/events/${eventId}`);
  } catch (error) {
      console.error("[Create Invite Link Error]:", error);
      throw new Error("Gagal membuat link undangan.");
    }
  }

/* Server action: Menyimpan data RSVP tamu dan mengirimkan email verifikasi */
export async function submitOrUpdateRsvpAction(
  token: string,
  formData: FormData,
) {
  try {
  const input = parseRsvp(formData);
  const invite = await prisma.eventInvite.findFirst({
    where: { token },
    include: { event: true },
  });

  if (!invite) throw new Error("Invite link is invalid.");
  const eventId = invite.event.id;
  const emailNormalized = input.email.toLowerCase();

  const existingRsvp = await prisma.eventRsvp.findUnique({
    where: { eventId_emailNormalized: { eventId, emailNormalized } },
  });

  if (existingRsvp) {
    if (existingRsvp.isVerified) {
      redirect(`/invite/status?mode=processed&token=${token}`);
    } else {
      redirect(`/invite/status?mode=pending&token=${token}`);
    }
  }
  const verificationToken = crypto.randomUUID(); 

  await prisma.eventRsvp.create({
    data: {
      eventId,
      inviteId: invite.id,
      name: input.name,
      email: input.email,
      emailNormalized,
      status: input.status as RsvpStatus,
      isVerified: false, 
      verificationToken,
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify/${verificationToken}`;
  await transporter.sendMail({
  from: '"Event Planner" <noreply@events.com>',
  to: input.email,
  subject: `Confirm your attendance: ${invite.event.title}`,
  html: `
    <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
      <h2 style="color: #7c3aed;">Confirm RSVP</h2>
      <p>Hi <b>${input.name}</b>,</p>
      <p>Thank you for your interest in <b>${invite.event.title}</b>. Please click the button below to verify your email and confirm your attendance:</p>
      
      <div style="margin: 25px 0;">
        <a href="${verifyUrl}" style="background: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verify Email
        </a>
      </div>
      
      <p style="font-size: 0.9rem; color: #666;">
        If you did not request this, please ignore this email.
      </p>
    </div>
  `,
});

  redirect(`/invite/status?mode=pending&token=${token}`);
} catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[Submit RSVP Error]:", error);
    throw new Error("Gagal memproses RSVP. Silakan coba lagi nanti.");
  }
}

/* Server action: Memverifikasi status RSVP tamu melalui token verifikasi email */
export async function verifyRsvpAction(verificationToken: string) {
    try {
    const rsvp = await prisma.eventRsvp.findFirst({
      where: { verificationToken },
      include: { event: true }
    });
    if (!rsvp) {
      throw new Error("Link verifikasi tidak valid.");
    }
    if (rsvp.isVerified) {
      redirect(`/verify-success?rsvpId=${rsvp.id}`);
    }
    await prisma.eventRsvp.update({
      where: { id: rsvp.id },
      data: { 
        isVerified: true, 
      }
    });
    redirect(`/verify-success?rsvpId=${rsvp.id}`); 
  }
  catch (error) {
      console.error("[Verify RSVP Error]:", error);
      if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
      throw new Error("Gagal memverifikasi RSVP. Link mungkin sudah kedaluwarsa.");
    }
}