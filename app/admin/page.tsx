'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dynamically captures ?redirect=/checkout from URL. Defaults to /dashboard if absent.
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Set authentication token/flag
    localStorage.setItem('isAuthenticated', 'true');

    // Instantly route them back to where they left off (the checkout/payment screen)
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-[#131822] border border-slate-800 p-8 rounded-2xl max-w-md w-full space-y-5 shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to complete your purchase</p>
        </div>
        
        <div>
          <label className="text-xs font-semibold text-slate-300">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg p-3 text-sm text-white mt-1 focus:outline-none focus:border-blue-500"
            required 
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg p-3 text-sm text-white mt-1 focus:outline-none focus:border-blue-500"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-lg"
        >
          Sign In & Proceed to Payment
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          New user?{' '}
          <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-slate-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}