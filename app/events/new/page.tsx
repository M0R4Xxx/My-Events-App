"use client";
import { useFormStatus } from "react-dom";
import { createEventAction } from "@/lib/actions/events";
import Link from "next/link";
import { useState } from "react";
import ShinyText from "@/components/animation-ui/ShinyText";
import SplitText from "@/components/animation-ui/SplitText"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import { Type, PenTool, MapPin, Calendar, X, Plus } from "lucide-react";

function SubmitButton({ isFormValid }: { isFormValid: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || !isFormValid;

  return (

      // Tampilan Buttn Submit
    <AnimatedContent 
      distance={20} 
      direction="vertical" 
      reverse={false} 
      duration={1} 
      threshold={0.1} 
      delay={0.6}
    >
      <button
        type="submit"
        disabled={disabled}
        className="group px-4 py-2 text-[13px] sm:px-5 sm:py-2 sm:text-sm rounded-lg border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-bold  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
          {pending ? "Creating now..." : (
            <>
              Create Event
              <Plus 
                size={14} 
                className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-90 group-hover:translate-x-1" 
              />
            </>
          )}
        </span>
      </button>
    </AnimatedContent>
  );
}

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  
  // Menghitung waktu minimal (sekarang) agar user tidak bisa membuat event di masa lalu.
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  // Validasi form reaktif: tombol submit hanya aktif jika semua field 
  // sudah memenuhi syarat panjang karakter minimal.
  const isFormValid = 
    title.trim().length >= 3 && 
    description.trim().length >= 3 && 
    location.trim().length >= 3 && 
    eventDate !== "";

  const cardBase = "rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30";

  return (
    <div className="mx-auto w-full max-w-2xl pt-2 p-1">
      <div className={`${cardBase} pt-6 pb-8`}>
        <h1 className="text-2xl sm:text-[25px] font-bold text-white/90 tracking-tight mb-2">
          <ShinyText
            text="Design Your Event"
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
        
        <div className="mb-3">
          <SplitText
            text="Fill in the details below to initialize your new event. Set the title, description, and schedule to keep your attendees informed and organized."
            className="text-purple-200/90 text-sm sm:text-[14.5px] max-w-lg sm:max-w-xl md:max-w-2xl"
            delay={30}
            duration={1}
            splitType="words"
            tag="p"
            textAlign="left"
          />
        </div>
        
      {/* Form Pengisian Eventnya */}
        <form action={createEventAction} className="space-y-4">
          <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.2}>
            <div>
              <label className="block text-[13px] font-medium text-purple-300 mb-1">Title</label>
              <div className="relative flex items-center">
                <input
                  name="title"
                  required
                  maxLength={50}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Team dinner..."
                  className="peer w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none  focus:border-purple-500 text-white transition-all placeholder:text-purple-200/40"
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  value={eventDate} 
                  onChange={(e) => setEventDate(e.target.value)} 
                  className="calendar-input-custom peer w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all [color-scheme:dark]"
                />
                <Calendar strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
              </div>
              <p className="text-[10.5px] text-purple-300/50 italic mt-2">Please ensure the title, description, location, and event date are filled out accurately & completely to proceed.</p>
            </div>
          </AnimatedContent>


          <div className="flex items-center gap-3 pt-2">
          {/* Tombol submit yang bereaksi terhadap state validasi */}
            <SubmitButton isFormValid={isFormValid} />
            <AnimatedContent 
              distance={20} 
              direction="vertical" 
              reverse={false} 
              duration={1} 
              threshold={0.1} 
              delay={0.7}
            >
              <Link
                href={"/dashboard"}
                className="group inline-flex items-center gap-1.5 px-4 py-2 text-[13px] sm:gap-2 sm:px-5 sm:py-2 sm:text-sm rounded-lg bg-white/90 hover:bg-white text-black font-bold  border border-black/40 backdrop-blur-sm shadow-lg shadow-purple-950/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95"
              >
                Cancel
                <X
                  size={14}
                  className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-90 group-hover:translate-x-1"
                />
              </Link>
            </AnimatedContent>
          </div>
        </form>
      </div>
    </div>
  );
}