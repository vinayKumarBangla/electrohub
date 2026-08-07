import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TechCart OS | Premium On-Demand Electronics Platform",
  description: "Experience professional-grade electronics shopping with live tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-dark-50 text-dark-900">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <footer className="border-t border-dark-100 bg-white mt-12 py-8 text-center text-xs text-dark-500">
          TechCart OS © {new Date().getFullYear()} - Professional E-Commerce Platform.
        </footer>
      </body>
    </html>
  );
}