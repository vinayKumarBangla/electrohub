import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Fixed absolute path import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElectroHub - Authentication",
  description: "Sign in or sign up to your ElectroHub account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
}