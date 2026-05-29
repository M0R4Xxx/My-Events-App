"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useUser } from "@/context/UserContext"; 
import ShinyText from "@/components/animation-ui/ShinyText"; 
import SplitText from "@/components/animation-ui/SplitText"; 
import AnimatedContent from "@/components/animation-ui/AnimatedContent";
import { AnimatePresence } from "framer-motion";
import Toast from "@/components/toast/Toast";
import { useRef } from "react";
import { 
  User, 
  Mail, 
  Fingerprint, 
  CalendarDays, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Camera,
  UserCircle,
  ShieldCheck,
  CheckCircle2,
  LogOut, 
  DoorOpen 
} from "lucide-react";

export default function AccountForm({ user, joinedDate }: { user: any, joinedDate: string }) {
  const [name, setName] = useState(user.name);
    const [displayName, setDisplayName] = useState(user.name); 
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl); 
    const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { updateUser, setUser } = useUser();
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  /* Fungsi untuk validasi data profil, update ke server, dan sinkronisasi state user */
  const handleSave = async () => {
  if (name.trim().length < 3) {
    setToast({ message: "Nama minimal harus terdiri dari 3 karakter!", type: "error" });
    return;
  }

  if (password) {
    if (password.length < 6) {
      setToast({ message: "Password baru minimal harus 6 karakter!", type: "error" });
      return;
    }
    if (/\s/.test(password)) {
      setToast({ message: "Password tidak boleh mengandung spasi!", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Password baru tidak cocok!", type: "error" });
      return;
    }
  }

  setLoading(true);

  const newAvatar = tempAvatarUrl || avatarUrl;

  try {
    const response = await fetch("/api/auth/update-account", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        newPassword: password || null,
        avatarUrl: newAvatar 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui profil");
    }

    updateUser({ name, avatarUrl: newAvatar });
    router.refresh();
    setDisplayName(name);
    setToast({ message: "Profil berhasil diperbarui!", type: "success" });
    
    if (tempAvatarUrl) setAvatarUrl(tempAvatarUrl);
    setTempAvatarUrl(null);
    setPassword("");
    setConfirmPassword("");
  } catch (error: any) {
    setToast({ message: error.message || "Terjadi kesalahan saat menyimpan data.", type: "error" });
  } finally {
    setLoading(false);
  }
};

  /* Fungsi untuk proses logout user dan redirect ke halaman sign-in */
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "GET" });
      setUser(null); 
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  };
  
  const isChanged = 
    name !== user.name || 
    password.length > 0 || 
    tempAvatarUrl !== null;

  const cardBase = "rounded-2xl border border-white/10 bg-purple-950/20 px-5 py-4 backdrop-blur-xl shadow-xl transition-colors duration-300 ease-in-out hover:bg-purple-950/30";

  return (
    <>
    <div className="w-full max-w-lg space-y-6">

      { /* CARD PROFIL: Menampilkan foto avatar dan info dasar user */ }
      <div className={`${cardBase} py-8`}>
        <div className="justify-center px-2 sm:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-fit mx-auto">
            <AnimatedContent
              distance={50}
              direction="horizontal"
              reverse={true}
              duration={1}
              threshold={0.1}
              delay={0.5}
            >
              <div className="group/avatar relative h-24 w-24 flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-purple-600 border-[3px] border-white/90 flex items-center justify-center shadow-[0_0_50px_15px_rgba(168,85,247,0.6)] overflow-hidden transition-all duration-300 group-hover/avatar:scale-105 cursor-pointer">
                  {tempAvatarUrl || avatarUrl ? (
                    <img 
                      src={tempAvatarUrl || avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {user.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .substring(0, 2)  
                        .toUpperCase()}
                    </span>
                  )}

                    <div className="absolute inset-0 z-30 opacity-0 cursor-pointer">
                    <UploadButton<OurFileRouter, "imageUploader">
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => setTempAvatarUrl(res[0].url)}
                      appearance={{
                        button: "!w-24 !h-24 !rounded-full !cursor-pointer",
                        container: "!w-24 !h-24 !p-0 !m-0 !pointer-events-auto",
                        allowedContent: "hidden",
                      }}
                      content={{ button: "" }}
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 z-20 transition-all duration-300 hover:scale-110 active:scale-95 group/camera">
                  <div className="w-8 h-8 rounded-full bg-purple-600 border-[2px] border-white/90 flex items-center justify-center text-white pointer-events-none shadow-[0_0_50px_15px_rgba(168,85,247,0.6)]">
                    <Camera size={14} strokeWidth={3} className="transition-transform duration-300 group-hover/camera:rotate-22" />
                  </div>
                  <div className="absolute inset-0 opacity-0 cursor-pointer">
                    <UploadButton<OurFileRouter, "imageUploader">
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setTempAvatarUrl(res[0].url);
                      }}
                      appearance={{
                        button: "!w-8 !h-8 !p-0 !rounded-full !cursor-pointer",
                        container: "!w-8 !h-8 !p-0 !m-0",
                        allowedContent: "hidden",
                      }}
                      content={{ button: "" }}
                    />
                  </div>
                </div>
              </div>
            </AnimatedContent>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1 w-full min-w-0">
              <h1 className="text-2xl font-bold tracking-tight w-full flex justify-center sm:justify-start">
                <div 
                  className="truncate break-words leading-tight max-w-[90%] sm:max-w-[100%]"
                  style={{ 
                    maskImage: 'linear-gradient(to right, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)',
                    overflow: 'hidden'
                  }}
                >
                  <ShinyText
                    text={displayName}
                    speed={5}
                    delay={0}
                    color="#ffffff"
                    shineColor="#c181ff"
                    spread={120}
                    direction="left"
                  />
                </div>
              </h1>
              <div 
                className="w-full flex justify-center sm:justify-start max-w-[100%] sm:max-w-[96%] truncate"
                style={{ 
                  maskImage: 'linear-gradient(to right, black 85%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)',
                  overflow: 'hidden'
                }}
              >
                  <SplitText
                    text={user.email}
                    className="text-purple-300/90 text-sm font-medium"
                    delay={30}
                    duration={1}
                    splitType="words"
                    tag="p"
                    textAlign="center"
                  />
              </div>
            </div>
          </div>
        </div>
      </div>  


      { /* CARD DETAILS: Form untuk mengubah nama dan menampilkan info akun */ }
      <div className={`${cardBase} pt-4 pb-8`}>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center justify-center gap-1.5 sm:gap-2">
          <UserCircle className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-purple-300" />
          <ShinyText
            text="Account Profile Details"
            speed={5}
            delay={0}
            color="#ffffff"
            shineColor="#c181ff"
            spread={120}
            direction="left"
          />
        </h2>
        <div className="w-full h-px bg-white/20 mb-5"></div>
        <div className="space-y-5">
          <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.6}>
            <div className="group">
              <label className="block text-xs font-medium text-purple-300 mb-1.5">Your Full Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  maxLength={40} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="peer w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:outline-none placeholder:text-purple-200 focus:border-purple-500 text-white transition-all duration-300"
                  placeholder="Your Name"
                />
                <User strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors duration-300 peer-focus:text-purple-500" />
              </div>
            </div>
          </AnimatedContent>
          {[
            { label: "Email Address", value: user.email, Icon: Mail, delay: 0.7 },
            { label: "Account ID", value: user.id, Icon: Fingerprint, delay: 0.8 },
            { label: "Joined Since", value: joinedDate, Icon: CalendarDays, delay: 0.9 }
          ].map((field) => (
            <AnimatedContent key={field.label} distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={field.delay}>
              <div className="group">
                <label className="block text-xs font-medium text-purple-300 mb-1.5">{field.label}</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={field.value}
                    disabled
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 text-purple-200/80 cursor-not-allowed transition-all duration-300 group-hover:border-white/20"
                  />
                  <field.Icon strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors duration-300" />
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
        <AnimatedContent 
          distance={15} 
          direction="vertical" 
          reverse={false} 
          duration={0.8} 
          threshold={0.1} 
          delay={0.5}
        >
          <p className="text-[11px] sm:text-xs text-purple-300/70 mt-4 leading-relaxed">
            Update your profile photo and display name (min. 3 characters). 
            Click <strong>Save Changes</strong> button below to apply your updates.
          </p>
        </AnimatedContent>
      </div>
      

      { /* CARD SECURITY: Form untuk mengganti password baru */ }
      <div className={`${cardBase} pt-4 pb-8`}>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center justify-center gap-1.5 sm:gap-2">
          <ShieldCheck className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-purple-300" />
          <ShinyText
            text="Account Security Hub"
            speed={5}
            delay={0}
            color="#ffffff"
            shineColor="#c181ff"
            spread={120}
            direction="left"
          />
        </h2>
        <div className="w-full h-px bg-white/20 mb-5"></div>
        <div className="space-y-5">
          <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.6}>
            <div className="group">
              <label className="block text-xs font-medium text-purple-300 mb-1.5">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={40}
                  className="peer w-full pl-9 pr-10 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all duration-300"
                  placeholder="••••••••"
                />
                <Lock strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors duration-300 peer-focus:text-purple-500" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 inset-y-0 my-auto text-purple-400/50 hover:text-purple-300 transition-all duration-200 ease-in-out active:scale-90"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 transition-opacity duration-200" /> : <Eye className="w-4 h-4 transition-opacity duration-200" />}
                </button>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={20} direction="horizontal" reverse={true} duration={1} threshold={0.1} delay={0.7}>
            <div className="group">
              <label className="block text-xs font-medium text-purple-300 mb-1.5">Repeat New Password</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={40}
                  className="peer w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white transition-all duration-300"
                  placeholder="••••••••"
                />
                <KeyRound strokeWidth={2.5} className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-purple-400/50 transition-colors duration-300 peer-focus:text-purple-500" />
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent 
            distance={20} 
            direction="vertical" 
            reverse={false} 
            duration={1} 
            threshold={0.1} 
            delay={0.7}
          > 
            <button 
              onClick={handleSave}
              disabled={loading || !isChanged}
              className="group w-full h-10 rounded-md border border-white/10 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-900/40 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                {loading ? "Saving..." : (
                  <>
                    Save Changes
                    <CheckCircle2 
                      size={14} 
                      className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" 
                    />
                  </>
                )}
              </span>
            </button>
          </AnimatedContent>
        </div>
        <AnimatedContent 
          distance={15} 
          direction="vertical" 
          reverse={false} 
          duration={0.8} 
          threshold={0.1} 
          delay={0.8}
        >
          <p className="text-[11px] sm:text-xs text-purple-300/70 mt-4 leading-relaxed">
            Update your password (min. 6 characters, no spaces). 
            Click <strong>Save Changes</strong> button to secure your account.
          </p>
        </AnimatedContent>
      </div>

      { /* CARD ACCESS: Tombol untuk keluar dari sesi akun */ }
      <div className={`${cardBase} pt-4 pb-8`}>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center justify-center gap-1.5 sm:gap-2">
          <LogOut className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-purple-300" />
          <ShinyText
            text="Account Access"
            speed={5}
            delay={0}
            color="#ffffff"
            shineColor="#c181ff"
            spread={120}
            direction="left"
          />
        </h2>
        <div className="w-full h-px bg-white/20 mb-5"></div>

        <div className="flex items-center justify-between gap-4 px-1">
          <div className="w-auto">
            <AnimatedContent 
              distance={20}          
              direction="horizontal" 
              reverse={true}         
              duration={1} 
              threshold={0}          
              delay={0.2}            
            >
              <p className="text-purple-200 text-[12px] sm:text-sm font-medium max-w-sm">
                Safely end your session and log out.
              </p>
            </AnimatedContent>
          </div>

          <div className="w-auto pl-1">
            <AnimatedContent 
              distance={20} 
              direction="vertical" 
              reverse={false} 
              duration={1} 
              threshold={0.1} 
              delay={0.8}
            >
              <button 
                onClick={handleLogout}
                className="group w-26 h-9 sm:w-32 sm:h-10 rounded-md border border-white/10 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-red-900/40 flex items-center justify-center"
              >
                <span className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                  Sign Out
                  <LogOut 
                    size={14} 
                    className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" 
                  />
                </span>
              </button>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </div>

    { /* Komponen notifikasi (toast) untuk feedback aksi user */ }
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
    </>
  );
}