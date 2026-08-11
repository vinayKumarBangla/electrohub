'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-flipkart-blue text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex flex-col items-start leading-none">
            <span className="text-xl font-black italic tracking-wide text-white">
              Electro<span className="text-flipkart-yellow">Hub</span>
            </span>
            <span className="text-[10px] italic text-gray-200 flex items-center gap-0.5 mt-0.5">
              Explore <span className="text-flipkart-yellow font-bold">Plus</span>
              <span className="text-flipkart-yellow font-bold text-xs">✦</span>
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for electronics, mobiles, laptops and more..."
            className="w-full py-2 px-4 pr-10 text-sm text-gray-800 bg-white rounded-sm focus:outline-none shadow-inner"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-flipkart-blue font-bold">
            🔍
          </button>
        </form>

        {/* Right: Actions (Seller, Login, Cart) */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          <Link
            href="/dashboard"
            className="hidden md:inline-block bg-white text-flipkart-blue px-4 py-1.5 rounded-sm font-bold hover:bg-gray-100 transition shadow-sm"
          >
            Become a Seller
          </Link>

          <Link href="/cart" className="flex items-center gap-2 hover:text-gray-200 relative">
            <div className="relative">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-flipkart-amber text-slate-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-white">
                  {totalItems}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>

      </div>
    </header>
  );
}