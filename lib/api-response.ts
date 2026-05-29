import { NextResponse } from "next/server";

/* Utility function untuk menyeragamkan format respon error dan melakukan logging sisi server */
export function errorResponse(message: string, status: number = 500) {
  console.error(`[Server Error] ${status}: ${message}`);
  
  /* Mengembalikan JSON response dengan pesan error dan kode status HTTP */
  return NextResponse.json(
    { message: message }, 
    { status }
  );
}