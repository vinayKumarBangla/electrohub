'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your password reset logic here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#131822] border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
        <p className="text-slate-400 text-sm mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="bg-blue-600/20 border border-blue-500 text-blue-300 p-4 rounded-lg text-sm mb-4">
            If an account exists for {email}, you will receive password reset instructions.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0a0e17] text-slate-100 placeholder-slate-500 border border-slate-700 px-4 py-2.5 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-xs text-blue-400 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}