"use client";

import { User, Mail } from "lucide-react";
import { CustomSelect } from "@/components/custom/custom-select";
import { SubmitButton } from "../invite/submit-button"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import { useToast } from "@/components/toast/toast-wrapper"; 

export function RsvpForm({ submitRsvpForToken }: { submitRsvpForToken: any }) {
  const { showToast } = useToast(); 

/* Fungsi buat validasi custom di sisi client: minimal karakter untuk nama & pengecekan akhiran email */
  const handleValidation = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.setCustomValidity("");

    if (target.name === "name" && target.value.length > 0 && target.value.length < 3) {
      target.setCustomValidity("Name must be at least 3 characters");
    }
    if (target.name === "email" && target.value.length > 0 && !target.value.endsWith("@gmail.com")) {
      target.setCustomValidity("Email must end with @gmail.com");
    }
  };

/* Fungsi buat ngecek error form sebelum dikirim, sekalian nampilin toast notification kalo ada yang gak valid */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    
    const inputs = form.querySelectorAll("input");
    let firstError: string | null = null;

    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        if (!firstError) {
          firstError = input.validationMessage;
        }
      }
    });

    if (firstError) {
      e.preventDefault();
      showToast(firstError, "error");
      return;
    }
  };

  return (
    <form 
      action={submitRsvpForToken} 
      className="space-y-4" 
      noValidate 
      onSubmit={handleSubmit}
    >
    { /* Dropdown seleksi status kehadiran (Going/Maybe/Not going) */ }
          <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.2}>
          <div>
            <label className="block text-[13px] font-medium text-purple-300 mb-1">Attendance</label>
            <CustomSelect 
              name="status" 
              defaultValue="going"
              options={[
                { label: "Going", value: "going" },
                { label: "Maybe", value: "maybe" },
                { label: "Not going", value: "not_going" }
              ]}
            />
          </div>
      </AnimatedContent>

    { /* Input field untuk nama tamu */ }
      <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.3}>
        <div>
          <label className="block text-[13px] font-medium text-purple-300 mb-1">Name</label>
          <div className="relative flex items-center">
            <input
              name="name"
              maxLength={40} 
              required
              onInput={handleValidation}
              placeholder="Your name"
              className="peer w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all placeholder:text-purple-200/40"
            />
            <User strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
          </div>
        </div>
      </AnimatedContent>

    { /* Input field untuk email tamu */ }
      <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.4}>
        <div>
          <label className="block text-[13px] font-medium text-purple-300 mb-1">Email</label>
          <div className="relative flex items-center">
            <input
              name="email"
              type="email"
              maxLength={40} 
              required
              onInput={handleValidation}
              placeholder="you@example.com"
              className="peer w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all placeholder:text-purple-200/40"
            />
            <Mail strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
          </div>
          <p className="text-[10.5px] text-purple-300/50 italic mt-2">Fill in your details and status. You will receive a confirmation via email shortly after submitting.</p>
        </div>   
      </AnimatedContent>

    { /* Tombol submit yang terintegrasi dengan status loading form */ }
      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}