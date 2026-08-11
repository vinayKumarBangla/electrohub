'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Restrict admin access to specific authorized admin emails only
      const allowedAdmins = ['admin@electrohub.tech', 'vinay@electrohub.tech'];
      
      if (allowedAdmins.includes(userCredential.user.email || '')) {
        localStorage.setItem('isAdmin', 'true');
        router.push('/admin');
      } else {
        setError('Access Denied: You do not have administrator privileges.');
        auth.signOut();
      }
    } catch (err: any) {
      setError('Invalid login credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-6">
      <form onSubmit={handleAdminLogin} className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-white text-center">Admin Portal Login</h2>
        {error && <p className="text-xs text-rose-400 text-center">{error}</p>}
        <input 
          type="email" 
          placeholder="Admin Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer">
          Secure Login
        </button>
      </form>
    </div>
  );
}