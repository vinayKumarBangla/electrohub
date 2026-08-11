'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim().toLowerCase();
    
    if (!trimmedQuery) return;

    // Direct routing for Admin or Dashboard panels
    if (trimmedQuery.includes('admin') || trimmedQuery.includes('dashboard') || trimmedQuery.includes('control panel')) {
      router.push('/dashboard'); // Change to '/admin' if you have a separate admin route
    } else {
      // Universal redirect for products and other queries
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-2xl">
      <div className="bg-[#131822] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-6">
        
        <Link href="/" className="flex items-center gap-2 bg-blue-600 px-3.5 py-1.5 rounded-lg shadow-md hover:bg-blue-500 transition-colors">
          <span className="font-black text-xl tracking-tighter text-white">ElectroHub</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-grow max-w-2xl relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or admin dashboard..." 
            className="w-full bg-[#0a0e17] text-slate-100 placeholder-slate-400 border border-slate-700 px-4 py-2.5 rounded-md pr-10 text-sm focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center gap-5 text-slate-200">
          <a 
            href="https://www.google.com/maps/search/electronics+store+near+me" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-400 transition-colors" 
          >
            <MapPin size={22} />
          </a>

          <Link href="/cart" className="relative hover:text-blue-400 transition-colors">
            <ShoppingCart size={22} />
          </Link>
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
            <User size={22} />
          </Link>
          
          <div className="h-5 w-[1px] bg-slate-700 mx-1"></div>

          <Link href="/login" className="text-xs font-semibold hover:text-blue-400 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow">
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}