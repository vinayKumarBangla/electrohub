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

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
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
    <header className="bg-[#131822] border-b border-slate-800 sticky top-0 z-50 px-3 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
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
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition items-center gap-1.5 cursor-pointer border border-slate-700 hidden sm:flex"
        >
          <Package size={15} className="text-blue-400" /> My Orders
        </button>

        <button
          onClick={() => router.push('/cart')}
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
        >
          <ShoppingCart size={15} className="text-blue-400" /> <span className="hidden xs:inline">Cart</span>
        </button>

        {/* Dynamic User Authentication Dropdown Menu */}
        {!loading && (
          user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer select-none"
              >
                <User size={15} className="shrink-0" /> 
                <span className="truncate max-w-[70px] sm:max-w-none">{userName}</span>
                <ChevronDown size={14} className="shrink-0" />
              </button>

              {/* Mobile-Friendly Dropdown Box */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1b2230] text-slate-100 border border-slate-700 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8)] py-2 z-[9999] text-xs space-y-1">
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); router.push('/dashboard'); }}
                    className="w-full text-left px-4 py-3 text-slate-100 hover:bg-slate-800 transition flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <User size={15} className="text-blue-400" /> My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); router.push('/dashboard'); }}
                    className="w-full text-left px-4 py-3 text-slate-100 hover:bg-slate-800 transition flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <Package size={15} className="text-blue-400" /> Orders
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <LogOut size={15} /> Logout
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