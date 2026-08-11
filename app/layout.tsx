import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DynamicNav from '@/components/DynamicNav';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechCart OS - Electronics Store',
  description: 'Shop top mobiles, laptops, audio and appliances',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0b0f19] text-gray-900 min-h-screen flex flex-col`}>
        <CartProvider>
          <DynamicNav />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}