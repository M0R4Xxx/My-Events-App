"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/* Definisi struktur data session user */
interface UserSession {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

/* Definisi interface untuk konteks user yang mencakup state dan fungsi updater */
interface UserContextType {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  updateUser: (newUserData: Partial<UserSession>) => void;
}

/* Inisialisasi React Context */
const UserContext = createContext<UserContextType | undefined>(undefined);

/* Provider untuk membungkus aplikasi dan menyediakan state user secara global */
export function UserProvider({ 
  children, 
  initialUser 
}: { 
  children: ReactNode; 
  initialUser?: UserSession | null 
}) {
  const [user, setUser] = useState<UserSession | null>(initialUser || null);
  const updateUser = (newUserData: Partial<UserSession>) => {
    setUser((prev) => (prev ? { ...prev, ...newUserData } : null));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser harus digunakan di dalam UserProvider");
  }
  return context;
}