"use client";
import { useState, useTransition, useMemo, useEffect } from "react"; 
import Link from "next/link";
import { Pencil, Trash2, X, Type, PenTool, MapPin, Calendar, Edit3 } from "lucide-react";
import { deleteEventAction, updateEventAction } from "@/lib/actions/events";
import { DeleteButton } from "@/components/dashboard-action-button/delete-button";
import { EditButton } from "@/components/dashboard-action-button/edit-button";
import ShinyText from "@/components/animation-ui/ShinyText"; 
import SplitText from "@/components/animation-ui/SplitText"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";

export function DashboardEvents({ events: initialEvents }: { events: any[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editFormData, setEditFormData] = useState<any>(null);
  const [minDateTime, setMinDateTime] = useState("");

  // Modal manager: buat nge-lock scroll body pas modal muncul biar nggak goyang-goyang 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDeleteTarget(null);
        setEditTarget(null);
      }
    };
    if (deleteTarget || editTarget) {
      document.addEventListener("keydown", handleKeyDown);
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [deleteTarget, editTarget]);

  useEffect(() => {
    if (editTarget) {
      const now = new Date();
      // Mengonversi ke format YYYY-MM-DDTHH:MM
      const tzOffset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
      setMinDateTime(localISOTime);
    }
  }, [editTarget]);

  // Action handler: pake useTransition biar UI responsif pas nunggu proses delete/update ke server 
  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteEventAction(deleteTarget);
      setEvents((prev) => prev.filter((event) => event.id !== deleteTarget));
      setDeleteTarget(null);
    });
  };
  
  const openEditModal = (event: any) => {
    setEditTarget(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : ""
    });
  };

  const isDirty = useMemo(() => {
  if (!editTarget || !editFormData) return false;
  return (
    editFormData.title !== editTarget.title ||
    editFormData.description !== editTarget.description ||
    editFormData.location !== editTarget.location ||
    editFormData.eventDate !== (editTarget.eventDate ? new Date(editTarget.eventDate).toISOString().slice(0, 16) : "")
  );
}, [editFormData, editTarget]);

// Form validator: biar tombol save cuma aktif kalau ada perubahan dan data valid 
const isEditFormValid = useMemo(() => {
  return (
    editFormData &&
    editFormData.title?.trim().length >= 3 &&
    editFormData.description?.trim().length >= 3 &&
    editFormData.location?.trim().length >= 3 &&
    editFormData.eventDate !== "" &&
    isDirty 
  );
}, [editFormData, isDirty]);

// Mendapatkan offset timezone lokal
const formatForInput = (dateString: string | null) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const wibOffset = 7 * 60 * 60 * 1000;
  const wibDate = new Date(date.getTime() + wibOffset);

  const year = wibDate.getUTCFullYear();
  const month = (wibDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = wibDate.getUTCDate().toString().padStart(2, '0');
  const hours = wibDate.getUTCHours().toString().padStart(2, '0');
  const minutes = wibDate.getUTCMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-purple-950/20 p-5 backdrop-blur-xl shadow-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-purple-950/30 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-4 min-w-0">
                <AnimatedContent 
                    distance={10} 
                    direction="horizontal" 
                    reverse={true} 
                    duration={1} 
                    threshold={0.1} 
                    delay={0.6}
                  >
                  <h3 className="translate-y-[2px] text-[18px] font-bold items-center bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent line-clamp-1 break-all sm:break-word max-w-[100%]">
                    {event.title}
                  </h3>
                </AnimatedContent>
                
                <div className="flex items-center gap-1.5 shrink-0 pl-2.5">
                  <AnimatedContent 
                    distance={10} 
                    direction="vertical" 
                    reverse={false} 
                    duration={1} 
                    threshold={0.1} 
                    delay={0.6}
                  >
                    <Link
                      href={`/events/${event.id}`}
                      className="-translate-y-[2px] px-3 py-1.5 rounded-lg border border-white/10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md shadow-purple-900/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                    >
                      Open
                    </Link>
                  </AnimatedContent>

                  <AnimatedContent 
                    distance={10} 
                    direction="vertical" 
                    reverse={false} 
                    duration={1} 
                    threshold={0.1} 
                    delay={0.7}
                  >
                    <EditButton onClick={() => openEditModal(event)} />
                  </AnimatedContent>

                  <AnimatedContent 
                    distance={10} 
                    direction="vertical" 
                    reverse={false} 
                    duration={1} 
                    threshold={0.1} 
                    delay={0.8}
                  >
                    <DeleteButton onClick={() => setDeleteTarget(event.id)} />
                  </AnimatedContent>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4 items-center translate-y-[2px]">
                <span className="px-2.5 py-0.5 rounded-md bg-green-500/20 text-green-200 text-[11px] font-medium border border-green-500/20 backdrop-blur-xl shadow-xl shadow-green-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-green-500/30 hover:-translate-y-1">
                  Going : {event.goingCount}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-yellow-500/20 text-yellow-200 text-[11px] font-medium border border-yellow-500/20 backdrop-blur-xl shadow-xl shadow-yellow-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-yellow-500/30 hover:-translate-y-1">
                  Maybe : {event.maybeCount}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-200 text-[11px] font-medium border border-red-500/20 backdrop-blur-xl shadow-xl shadow-red-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-red-500/30 hover:-translate-y-1">
                  Not Going : {event.notGoingCount}
                </span>
              </div>

              <AnimatedContent 
                    distance={10} 
                    direction="vertical" 
                    reverse={false} 
                    duration={1} 
                    threshold={0} 
                    delay={0.7}
                  >
                <p className="text-xs sm:text-sm text-purple-200/80 truncate block max-w-[97%]">
                  {event.eventDate ? (
                    (() => {
                      const date = new Date(event.eventDate);
                      const day = date.toLocaleDateString("id-ID", { 
                        day: "numeric", 
                        month: "long", 
                        year: "numeric",
                        timeZone: "Asia/Jakarta"
                      });
                      const time = date.toLocaleTimeString("id-ID", { 
                        hour: "2-digit", 
                        minute: "2-digit", 
                        hour12: false,
                        timeZone: "Asia/Jakarta"
                      }).replace(".", ":");             
                      return `${day}, ${time}`;
                    })()
                  ) : "No date"}
                  {event.location ? ` • ${event.location}` : ""}
                </p>
              </AnimatedContent>
            </div>
          ))}
        </div>

    {/* Modal Delete: konfirmasi hapus event */}
     {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden">
          <div className="rounded-2xl border border-white/10 bg-purple-950/20 p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-purple-950/30 max-w-sm w-full my-auto">
            <div className="text-xl font-bold text-white tracking-tight">
              <ShinyText
                text="Confirm Event Deletion"
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
            </div>
            <SplitText
              text={`Are you sure you want to delete "${events.find(e => e.id === deleteTarget)?.title}"? This action is permanent and cannot be undone.`}
              className="text-purple-200/80 mt-2 text-sm w-full"
              delay={30}
              duration={1}
              splitType="words"
              tag="p"
              textAlign="left"
            />
            
            <div className="flex gap-3 mt-5">
              <div className="flex-1">
              <AnimatedContent distance={10} direction="vertical" duration={0.8} delay={0.4}>
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="w-full group flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/90 hover:bg-white text-black font-bold border border-black/40 backdrop-blur-sm shadow-lg shadow-white-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
                <X 
                  size={14} 
                  className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-90 group-hover:translate-x-1" 
                />
              </button>
              </AnimatedContent>
            </div>
            <div className="flex-1">
            <AnimatedContent distance={10} direction="vertical" duration={0.8} delay={0.6}>
              <button 
                onClick={handleDelete} 
                disabled={isPending} 
                className="w-full group flex-1 px-4 py-2 rounded-lg border border-white/10 bg-red-600 hover:bg-red-700 text-white text-sm font-bold backdrop-blur-sm shadow-lg shadow-red-900/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Trash2 
                  size={16} 
                  className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-20" 
                />
                {isPending ? "Deleting..." : "Delete"}
              </button>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* Modal Edit: form buat update data event */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex justify-center p-4 pt-24 pb-8 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-purple-950/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl h-fit my-auto">
            
            <h1 className="text-2xl sm:text-[25px] font-bold text-white/90 tracking-tight mb-2">
              <ShinyText
                text="Edit Your Event"
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

            <div className="mb-6">
              <SplitText
                text="Modify the details below to update your event. Keep your attendees informed with the latest information."
                className="text-purple-200/90 text-sm sm:text-[14.5px] max-w-lg sm:max-w-xl md:max-w-2xl"
                delay={30}
                duration={1}
                splitType="words"
                tag="p"
                textAlign="left"
              />
            </div>

            <form 
              action={(formData) => startTransition(async () => {
                try {
                  await updateEventAction(editTarget.id, formData);
                  setEvents(prev => prev.map(e => {
                    if (e.id === editTarget.id) {
                      const data = Object.fromEntries(formData);
                      return { 
                        ...e, 
                        ...data, 
                        // Ganti bagian ini di dalam setEvents
                        eventDate: data.eventDate ? new Date(data.eventDate as string) : null
                      };
                    }
                    return e;
                  }));
                  setEditTarget(null);
                } catch (error) {
                  alert(error instanceof Error ? error.message : "Failed to update event");
                }
              })} 
              className="space-y-4"
            >
              <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.2}>
                <div>
                  <label className="block text-[13px] font-medium text-purple-300 mb-1">Title</label>
                  <div className="relative flex items-center">
                    <input
                      name="title"
                      required
                      maxLength={50}
                      defaultValue={editTarget.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      placeholder="Team dinner..."
                      className="peer w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all placeholder:text-purple-200/40"
                    />
                    <Type strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.3}>
                <div>
                  <label className="block text-[13px] font-medium text-purple-300 mb-1">Description</label>
                  <div className="relative flex items-start">
                    <textarea
                      name="description"
                      rows={2}
                      maxLength={98}
                      defaultValue={editTarget.description || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      placeholder="Optional details..."
                      className="peer w-full pl-9 pr-3 py-3 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all resize-none placeholder:text-purple-200/40"
                    />
                    <PenTool strokeWidth={2.5} className="absolute left-3 top-3 w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.4}>
                <div>
                  <label className="block text-[13px] font-medium text-purple-300 mb-1">Location</label>
                  <div className="relative flex items-center">
                    <input
                      name="location"
                      maxLength={50}
                      defaultValue={editTarget.location || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      placeholder="Optional location"
                      className="peer w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all placeholder:text-purple-200/40"
                    />
                    <MapPin strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.5}>
                <div>
                  <label className="block text-[13px] font-medium text-purple-300 mb-1">Date & Time</label>
                  <div className="relative flex items-center">
                    <input 
                      type="datetime-local" 
                      name="eventDate"
                      min={minDateTime}
                      defaultValue={formatForInput(editTarget.eventDate)}
                      onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })} 
                      className="peer w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all [color-scheme:dark]"
                    />
                    <Calendar strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
                  </div>
                  <p className="text-[10.5px] text-purple-300/50 italic mt-2">Required to proceed.</p>
                </div>
              </AnimatedContent>

              <div className="flex items-center gap-3 pt-2">
                <AnimatedContent distance={20} direction="vertical" reverse={false} duration={1} threshold={0.1} delay={0.6}>
                  <button
                    type="submit"
                    disabled={!isEditFormValid || isPending}
                    className="group px-4 py-2 text-[13px] sm:px-5 sm:py-2 sm:text-sm rounded-lg border border-white/10 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-900/40 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                      {isPending ? "Updating..." : (
                        <>
                          Save Event
                          <Edit3 size={14} className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-22 group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </AnimatedContent>

                <AnimatedContent distance={20} direction="vertical" reverse={false} duration={1} threshold={0.1} delay={0.7}>
                  <button
                    type="button"
                    onClick={() => setEditTarget(null)}
                    className="group inline-flex items-center gap-1.5 px-4 py-2 text-[13px] sm:gap-2 sm:px-5 sm:py-2 sm:text-sm rounded-lg bg-white/90 hover:bg-white text-black font-bold border border-black/40 backdrop-blur-sm shadow-lg shadow-purple-950/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95"
                  >
                    Cancel
                    <X size={14} className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-90 group-hover:translate-x-1" />
                  </button>
                </AnimatedContent>
              </div>
            </form>
          </div>
        </div>
      )}
    </> 
  );
}