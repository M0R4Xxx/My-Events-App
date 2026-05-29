"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ShinyText from "@/components/animation-ui/ShinyText"; 
import SplitText from "@/components/animation-ui/SplitText"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import Toast from "@/components/toast/Toast"; 
import { AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, User, KeyRound, Eye, EyeOff, Send, ArrowLeft } from "lucide-react"; 

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const params = useParams();
  const path = params?.path as string;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);


  useEffect(() => {
    if (path === "verify-otp" || path === "reset-password") {
      const savedEmail = localStorage.getItem("registered_email");
      if (savedEmail) setEmail(savedEmail);
    }
  }, [path]);

  useEffect(() => {
    const wasEmailSent = localStorage.getItem("email_sent_state");

    if (path === "forgot-password" && wasEmailSent === "true") {
      localStorage.removeItem("email_sent_state"); 
      router.push("/auth/sign-in");
    }
  }, [path, router]);


  useEffect(() => {
    if (path === "reset-password" && token) {
      const validateToken = async () => {
        try {
          const res = await fetch(`/api/auth/validate-reset?token=${token}`, { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }
          });
          
          if (res.ok) {
            setIsTokenValid(true);
          } else {
            setIsTokenValid(false);
          }
        } catch (err) {
          setIsTokenValid(false);
        }
      };
      validateToken();
    } else if (path !== "reset-password") {
      setIsTokenValid(null);
    }
  }, [path, token]);

  // Menangani semua jenis pengiriman form (login, registrasi, OTP, reset password).
  // Logikanya dibuat dinamis nurut path yang sedang diakses.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validasi tambahan khusus untuk reset password biar user tidak salah input
    if (path === "reset-password" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }


    setLoading(true);

    // nentuin endpoint dinamis berdasarkan state path saat ini
    let actionPath = path;
    if (path === "sign-up") actionPath = "register";
    if (path === "sign-in") actionPath = "login";
    const token = new URLSearchParams(window.location.search).get("token");
    let endpoint = `/api/auth/${actionPath}`;
    if (token) endpoint += `?token=${token}`;


    try {
      const payload = { 
        name, 
        email, 
        password, 
        otp, 
        newPassword: password,         
        confirmPassword: confirmPassword 
      };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Terjadi kesalahan");
      setToast({ message: data.message || "Action completed successfully!", type: "success" });

      if (path === "sign-in") {
        router.push("/dashboard");
        router.refresh();
      } else if (path === "sign-up") {
        localStorage.setItem("registered_email", email);
        setMessage("Registrasi berhasil! Kode OTP telah dikirim.");
        setTimeout(() => router.push("/auth/verify-otp"), 2000);
      } else if (path === "verify-otp") {
        setMessage("Akun berhasil diverifikasi!");
        localStorage.removeItem("registered_email");
        setTimeout(() => router.push("/auth/sign-in"), 2000);
      } else if (path === "forgot-password") {
        setIsEmailSent(true);
        localStorage.setItem("email_sent_state", "true");
      } else if (path === "reset-password") {
        setMessage("Password berhasil diubah!");
        setTimeout(() => router.push("/auth/sign-in"), 2000);
      }
    } catch (err: any) {
      setError(err.message);
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Validasi input real-time make API bawaan browser (setCustomValidity).
  // Mbantu memberikan feedback instan tanpa harus menunggu form disubmit.
  const handleValidation = (e: React.FormEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement;
  const { name, value } = target;
  target.setCustomValidity("");

  if (value.length === 0) return;
  if (name === "name") {
    if (value.length < 3) {
      target.setCustomValidity("Nama minimal harus 3 karakter");
    }
  }

  if (name === "email") {
    if (!value.endsWith("@gmail.com")) {
      target.setCustomValidity("Email harus menggunakan akhiran @gmail.com");
    }
  }

  if (name === "password" || name === "confirmPassword") {
    if (value.includes(" ")) {
      target.setCustomValidity("Password tidak boleh mengandung spasi");
    } else if (value.length < 6) {
      target.setCustomValidity("Password minimal 6 karakter");
    } else if (name === "confirmPassword" && value !== password) {
      target.setCustomValidity("Password tidak cocok");
    }
  }
};

  return (
    <main className="container mx-auto flex flex-col items-center justify-start pt-10 pb-24 px-4 md:px-6 w-full">
      <div 
        className="w-full max-w-md rounded-2xl border border-white/10 bg-purple-950/20 p-8 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30 text-white" 
        suppressHydrationWarning
      >
        <div className="flex justify-center mb-4">
          <AnimatedContent
            distance={20}
            direction="vertical" 
            reverse={true}
            duration={1}
            threshold={0.1}
            delay={0.5}
          >
            <Link 
              href={"/"} 
              className="group flex items-center gap-2 font-bold tracking-wide text-white transition-all duration-300 ease-in-out hover:text-purple-200"
            >
              <Sparkles className="w-6 h-6 text-purple-100 transition-colors duration-300 ease-in-out group-hover:text-purple-200" />
              MyEvents
            </Link>
          </AnimatedContent>
        </div>
    
      <h2 className="text-2xl font-bold text-center mb-2">
          <ShinyText
              text={
                path === "sign-in" ? "Sign In to Your Account" :
                path === "sign-up" ? "Create Your Account" :
                path === "forgot-password" ? (isEmailSent ? "Verification Sent" : "Reset Your Password") :
                path === "reset-password" ? (isTokenValid === false ? "Invalid Link" : "Set New Password") :
                path === "verify-otp" ? "Account Verification" : ""
                }
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

    {(path !== "reset-password" ? !isEmailSent : isTokenValid === true) && (
      <div className="w-full flex justify-center">
        <SplitText
          text={
            path === "sign-in" ? "Access your event management dashboard." :
            path === "sign-up" ? "Register to start planning your events." :
            path === "forgot-password" ? "Enter your email address to receive a secure OTP." :
            path === "reset-password" ? "Enter your new password to secure your account." :
            `Please enter the 6-digit code sent to ${email}`
          }
          className="text-sm text-purple-200/60 mb-6"
          delay={30}
          duration={1}
          splitType="words"
          tag="p"
          textAlign="center"
        />
      </div>
    )}

  {/* Tampilan khusus kalau user udah request reset password */}
    {path === "forgot-password" && isEmailSent ? (
      <div className="text-center space-y-6">
        <SplitText
          text="Password reset instructions have been sent to your email. Please check your inbox or spam folder."
          className="text-sm text-purple-200/60"
          delay={30}
          duration={1}
          splitType="words"
          tag="p"
          textAlign="center"
        />
        <AnimatedContent 
          distance={20} 
          direction="vertical" 
          reverse={false} 
          duration={1} 
          threshold={0.1} 
          delay={0.5}
        >
          <Link 
            href="/auth/sign-in"
            className="group mx-auto min-w-[160px] px-8 h-10 rounded-md border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center w-fit"
          >
            <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <ArrowLeft 
                size={16} 
                className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-1" 
              />
              Back to login
            </span>
          </Link>
        </AnimatedContent>
      </div>

      /* Proses pengecekan link reset yang lagi divalidasi */
    ) : path === "reset-password" && isTokenValid === null ? (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-purple-900/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        </div>
        <AnimatedContent 
          distance={15} 
          direction="vertical" 
          reverse={false} 
          duration={0.8} 
          threshold={0.1}
        >
          <p className="text-purple-400 text-sm font-medium tracking-wide animate-pulse">
            Verifying link validity...
          </p>
        </AnimatedContent>
      </div>

    /* Tampilan kalau link reset password udah kadaluarsa atau invalid */
    ) : path === "reset-password" && isTokenValid === false ? (
      <div className="text-center space-y-6">
          <div className="mx-auto max-w-[320px] p-4 rounded-xl bg-red-500/10 border border-red-500/50 backdrop-blur-sm mt-4 flex items-center justify-center min-h-[120px]">
            <SplitText
              text="The password reset link you are using is no longer valid. It may have already been used, or it has expired after the allowed time limit. Please request a new link to continue."
              className="text-sm text-red-300/90 leading-relaxed"
              delay={30}
              duration={1}
              splitType="words"
              tag="p"
              textAlign="center"
            />
          </div>
        <AnimatedContent 
          distance={20} 
          direction="vertical" 
          reverse={false} 
          duration={1} 
          threshold={0.1} 
          delay={0.5}
        >
          <Link 
            href="/auth/forgot-password"
            className="group mx-auto min-w-[160px] px-8 h-10 rounded-md border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center w-fit"
          >
            <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <ArrowLeft 
                size={16} 
                className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-1" 
              />
              Request new link
            </span>
          </Link>
        </AnimatedContent>
      </div>

    /* Halaman utama form untuk sign-in, sign-up, dan reset */
    ) : (
      <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
      {/* Form khusus untuk registrasi nama baru */}
        {path === "sign-up" && (
          <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.6}>
          <div>
            <label className="block text-xs font-medium text-purple-300 mb-1.5">Your Full Name</label>
            <div className="relative flex items-center">
              <input 
                type="text"
                name="name"
                maxLength={40} 
                required 
                value={name} 
                onInvalid={handleValidation} 
                onInput={handleValidation}  
                onChange={(e) => setName(e.target.value)} 
                className="peer w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white" 
                placeholder="John Doe" 
              />
              <User strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
            </div>
          </div>
          </AnimatedContent>
        )}

      {/* Input email untuk semua form kecuali verifikasi OTP & reset password */}
        {path !== "verify-otp" && path !== "reset-password" && (
          <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.7}>
          <div>
            <label className="block text-xs font-medium text-purple-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <input 
                type="text"
                name="email"
                required 
                maxLength={40}
                onInvalid={handleValidation} 
                onInput={handleValidation}  
                autoComplete="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="peer w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white" 
                placeholder="name@email.com" 
              />
              <Mail strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
            </div>
          </div>
        </AnimatedContent>
        )}

    {/* Khusus untuk input kode OTP */}
      {path === "verify-otp" && (
        <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.7}>
          <div className="flex flex-col items-center w-full">
            <label className="block text-xs font-medium text-purple-300 mb-1.5 w-full text-center">
              Verification Code
            </label>
            <div className="flex justify-center w-full max-w-[180px]">
              <input 
                type="text"
                name="otp"
                required 
                maxLength={6}
                pattern="\d{6}"
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                className="w-full py-2.5 text-center text-lg rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 
                text-white tracking-[0.5em] pl-[0.5em] font-mono placeholder:tracking-[0.5em]" 
                placeholder="000000" 
              />
            </div>
            
            <p className="text-[11px] text-purple-400 mt-2 text-center max-w-[300px]">
              Enter the 6-digit code sent to your email.
            </p>
          </div>
        </AnimatedContent>
      )}

      {/* Form password untuk masuk, daftar, atau bikin password baru */}
        {(path === "sign-in" || path === "sign-up" || path === "reset-password") && ( 
          <div className="space-y-4">
            <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.8}>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-purple-300">{path === "reset-password" ? "New Password" : "Password"}</label>
                {path === "sign-in" && <Link href="/auth/forgot-password" className="text-xs text-purple-400 hover:underline">Forgot password?</Link>}
              </div>
              <div className="relative flex items-center">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required 
                  maxLength={40}
                  onInvalid={handleValidation}
                  onInput={handleValidation}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="peer w-full pl-9 pr-10 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white" 
                  placeholder="••••••••" 
                />
                <Lock strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 inset-y-0 my-auto text-purple-400/50 hover:text-purple-300 transition-all duration-200 ease-in-out active:scale-90"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 transition-opacity duration-200" />
                  ) : (
                    <Eye className="w-4 h-4 transition-opacity duration-200" />
                  )}
                </button>
              </div>
            </div>
            </AnimatedContent>   

            {path === "reset-password" && (
              <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.9}>
              <div>
                <label className="block text-xs font-medium text-purple-300 mb-1.5">Confirm New Password</label>
                <div className="relative flex items-center">
                  <input 
                    type="password" 
                    name="confirmPassword"
                    maxLength={40}
                    required 
                    onInvalid={handleValidation}
                    onInput={handleValidation}
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="peer w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white" 
                    placeholder="••••••••" 
                  />
                  <KeyRound strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors peer-focus:text-purple-500" />
                </div>
              </div>
              </AnimatedContent>
            )}
          </div>
        )}

        {/* button submit */}
        <AnimatedContent 
          distance={20} 
          direction="vertical" 
          reverse={false} 
          duration={1} 
          threshold={0.1} 
          delay={1}
        > 
        <button 
          type="submit" 
          disabled={loading} 
          className="group mx-auto min-w-[160px] px-8 mt-7 h-10 rounded-md border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
            {loading ? "Processing..." : (
              <>
                {path === "sign-in" ? "Sign In" : 
                path === "sign-up" ? "Sign Up" : 
                path === "forgot-password" ? "Send OTP" : 
                path === "verify-otp" ? "Verify Your Code" : "Update Password"}
                <Send 
                  size={14} 
                  className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1 group-hover:rotate-45" 
                />
              </>
            )}
          </span>
        </button>
        </AnimatedContent>
      </form>
    )}

    {!isEmailSent && path !== "reset-password" && (
      <AnimatedContent 
          distance={15} 
          direction="vertical" 
          reverse={false} 
          duration={1} 
          threshold={0.1} 
          delay={1.1}
        >
        <div className="mt-6 text-center text-xs text-purple-300/50">
          {path === "sign-in" ? (
            <p>Don't have an account? <Link href="/auth/sign-up" className="text-purple-400 font-medium hover:underline">Sign up now</Link></p>
          ) : (
            <p>Already have an account? <Link href="/auth/sign-in" className="text-purple-400 font-medium hover:underline">Sign in here</Link></p>
          )}
        </div>
      </AnimatedContent>
    )}
  </div>
  <AnimatePresence mode="wait">
  {toast && (
    <Toast 
      key="unique-toast-key"
      message={toast.message} 
      type={toast.type} 
      onClose={() => setToast(null)} 
    />
  )}
</AnimatePresence>
</main>
  );
}