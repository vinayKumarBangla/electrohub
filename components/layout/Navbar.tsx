'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { ShoppingCart, User, LogIn, Package, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setUserName(
          session.user.user_metadata?.full_name || 
          session.user.user_metadata?.name || 
          session.user.email?.split('@')[0] || 
          'Account'
        );
      }
      setLoading(false);
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserName(
          session.user.user_metadata?.full_name || 
          session.user.user_metadata?.name || 
          session.user.email?.split('@')[0] || 
          'Account'
        );
      } else {
        setUser(null);
        setUserName('');
      }
      setLoading(false);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    localStorage.removeItem('electrohub_user');
    setDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-[#131822] border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => router.push('/')}
      >
        <span className="text-lg sm:text-xl font-black text-white">
          TechCart <span className="text-blue-500">OS</span>
        </span>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-2 sm:gap-3 relative" ref={dropdownRef}>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition items-center gap-1.5 cursor-pointer border border-slate-700 hidden sm:flex"
        >
          <Package size={15} className="text-blue-400" /> My Orders
        </button>

        <button
          onClick={() => router.push('/cart')}
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
        >
          <ShoppingCart size={15} className="text-blue-400" /> Cart
        </button>

        {/* Dynamic User Authentication Dropdown Menu */}
        {!loading && (
          user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <User size={15} /> 
                <span className="truncate max-w-[80px] sm:max-w-none">{userName}</span>
                <ChevronDown size={14} />
              </button>

              {/* Mobile-Friendly Dropdown Box with forced Dark Background & Light Text */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-[#131822] text-slate-100 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs space-y-1">
                  <button
                    onClick={() => { setDropdownOpen(false); router.push('/dashboard'); }}
                    className="w-full text-left px-4 py-2.5 text-slate-100 hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <User size={14} className="text-blue-400" /> My Profile
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); router.push('/dashboard'); }}
                    className="w-full text-left px-4 py-2.5 text-slate-100 hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Package size={14} className="text-blue-400" /> Orders
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <LogIn size={15} /> Login
            </button>
          )
        )}
      </div>
    </header>
  );
}