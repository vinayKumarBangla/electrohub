'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, Truck, Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState<string>('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleTrackOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const searchTerm = orderId.trim().toLowerCase();
      
      // Fetch orders saved in browser local storage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Find the matching order by ID
      const foundOrder = savedOrders.find(
        (o: any) => o.orderId?.toLowerCase() === searchTerm || o.id?.toLowerCase() === searchTerm
      );

      if (!foundOrder) {
        setError('Order not found. Please check your Order ID.');
        setOrder(null);
      } else {
        setOrder(foundOrder);
      }
    } catch (err) {
      setError('An error occurred while fetching the order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-[#131822] border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-white">Track Your Order</h1>
          <p className="text-xs text-slate-400">
            Enter your order ID below to see live status updates.
          </p>
        </div>

        <form onSubmit={handleTrackOrder} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-19367"
              className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg cursor-pointer"
          >
            {loading ? 'Searching...' : 'Track Live Status'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-6 border-t border-slate-800 pt-6 space-y-4">
            <div className="flex justify-between items-center bg-blue-600/10 p-4 rounded-xl border border-blue-500/20">
              <div>
                <p className="text-[10px] text-blue-400 font-bold uppercase">Current Status</p>
                <p className="text-base font-black text-white mt-0.5">{order.status || 'Processing'}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                Live Feed Active
              </span>
            </div>

            <div className="text-xs space-y-2 text-slate-300 bg-[#0a0e17] p-4 rounded-xl border border-slate-800">
              <p><span className="font-bold text-slate-400">Order ID:</span> <span className="font-mono text-blue-400">{order.orderId}</span></p>
              <p><span className="font-bold text-slate-400">Total Amount:</span> ₹ {order.totalAmount?.toLocaleString('en-IN')}</p>
              {order.scheduledPickup && (
                <p className="text-cyan-300"><span className="font-bold text-slate-400">Scheduled Pickup:</span> {order.scheduledPickup}</p>
              )}
              <p><span className="font-bold text-slate-400">Created At:</span> {order.date || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}