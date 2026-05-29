"use client";

import { useLayoutEffect } from "react";
import { useUser } from "@/context/UserContext";

/* Komponen utility untuk menyinkronkan data user dari server ke dalam state aplikasi (UserContext) */
export function UserSync({ userData }: { userData: any }) {
  const { setUser } = useUser();

  useLayoutEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  return null; 
}