'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DynamicNav() {
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check logged-in user from localStorage
    const savedUser = localStorage.getItem('electrohub_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('electrohub_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="bg-flipkart-blue text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start">
          <span className="text-xl font-extrabold italic tracking-wider text-amber-300">TechCart OS</span>
          <span className="text-[10px] text-gray-200 italic -mt-1">Explore <span className="text-yellow-300 font-semibold">Plus</span></span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center bg-white rounded-sm overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-xs text-gray-800 outline-none"
          />
          <button type="submit" className="bg-white px-4 text-flipkart-blue hover:text-amber-500">
            🔍
          </button>
        </form>

        {/* Nav Actions */}
        <div className="flex items-center space-x-6 text-xs font-bold">
          {user ? (
            <div className="relative group cursor-pointer flex items-center gap-1 bg-white text-flipkart-blue px-3 py-1.5 rounded-sm shadow">
              <span>👤 {user.email.split('@')[0]}</span>
              <div className="absolute top-full right-0 bg-white text-gray-800 shadow-md rounded-sm py-2 w-36 hidden group-hover:block border">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                <Link href="/track-order" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="bg-white text-flipkart-blue px-6 py-1.5 rounded-sm shadow hover:bg-gray-100 uppercase">
              Login
            </Link>
          )}

          <Link href="/cart" className="flex items-center gap-1 hover:text-amber-300 relative">
            <span className="text-lg">🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}