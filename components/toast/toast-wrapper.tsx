"use client";
import { useState, createContext, useContext } from "react";
import Toast from "./Toast";
import { AnimatePresence } from "framer-motion";

/* Konteks buat nyediain fungsi showToast ke seluruh aplikasi */
const ToastContext = createContext({
  showToast: (message: string, type: "error" | "success" = "error") => {}
});

export const useToast = () => useContext(ToastContext);

export function ToastWrapper({ children }: { children: React.ReactNode }) {

  /* State buat nyimpen data toast yang lagi muncul di layar */
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  /* Fungsi buat nge-trigger munculnya toast dengan pesan dan tipe tertentu */
  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

    { /* AnimatePresence buat ngatur animasi keluar-masuk komponen toast */ }
      <AnimatePresence mode="wait">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}