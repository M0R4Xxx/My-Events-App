import nodemailer from "nodemailer";

/* Konfigurasi transporter nodemailer menggunakan layanan Gmail dan kredensial dari environment variables */
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});