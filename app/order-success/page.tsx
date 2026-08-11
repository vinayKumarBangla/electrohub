'use client';

import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center backdrop-blur-md shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
          ✓
        </div>
        
        <h1 className="text-2xl font-extrabold text-white mb-2">Order Placed Successfully!</h1>
        <p className="text-slate-400 text-sm mb-6">
          Thank you for your purchase. Your order has been placed and is being processed securely via your chosen payment option.
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 mb-6 space-y-2 text-left">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="text-white font-mono">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status:</span>
            <span className="text-emerald-400 font-semibold">Confirmed / Processing</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            href="/products" 
            className="w-full block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl text-center shadow-lg hover:from-blue-500 hover:to-cyan-400 transition-all text-sm"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/" 
            className="w-full block bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-xl text-center transition-all text-sm"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}