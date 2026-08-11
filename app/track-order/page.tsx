'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    // Simulated tracking lookup
    setTrackedOrder({
      id: orderId.toUpperCase(),
      status: 'Out for Delivery',
      estimatedDelivery: 'Tomorrow, by 8:00 PM',
      items: [{ name: 'Tech Hardware Product', qty: 1 }],
      steps: [
        { title: 'Order Placed', completed: true, date: 'Today, 10:30 AM' },
        { title: 'Packed & Dispatched', completed: true, date: 'Today, 3:15 PM' },
        { title: 'Out for Delivery', completed: true, date: 'Estimated Tomorrow' },
        { title: 'Delivered', completed: false, date: 'Pending' },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Order</span>
        </h1>
        <p className="text-slate-400 text-sm mb-8">Enter your Order ID to check live shipment status and delivery details.</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g., #ORD-123456)" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button 
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-lg hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer"
          >
            Track
          </button>
        </form>

        {trackedOrder && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-800 gap-2">
              <div>
                <span className="text-xs text-slate-400">Order ID:</span>
                <h3 className="text-lg font-bold text-white font-mono">{trackedOrder.id}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400">Status:</span>
                <div className="text-cyan-400 font-semibold">{trackedOrder.status}</div>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {trackedOrder.steps.map((step: any, index: number) => (
                <div key={index} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${step.completed ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${step.completed ? 'text-white' : 'text-slate-500'}`}>{step.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Expected Delivery: <strong className="text-white">{trackedOrder.estimatedDelivery}</strong></span>
              <Link href="/products" className="text-blue-400 hover:underline">Back to Store</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}