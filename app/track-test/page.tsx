'use client';

import { useState } from 'react';
import OrderTracker from '@/components/OrderTracker';
import { OrderStatus, ORDER_STATUS_FLOW, getNextStatus } from '@/app/utils/orderWorkflow';

export default function TrackPage() {
  const [status, setStatus] = useState<OrderStatus>('PENDING');

  const handleAdvance = () => {
    const next = getNextStatus(status);
    if (next) setStatus(next);
  };

  const handleReset = () => {
    setStatus('PENDING');
  };

  const handleCancel = () => {
    setStatus('CANCELLED');
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-[#131822] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white">Order Status Simulation</h2>
        
        {/* Render the Dynamic Tracker */}
        <div className="bg-[#0a0e17] p-4 rounded-2xl border border-slate-800">
          <OrderTracker currentStatus={status} />
        </div>

        {/* Control Buttons to Test State Transitions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={handleAdvance}
            disabled={status === 'DELIVERED' || status === 'CANCELLED'}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
          >
            Advance Status
          </button>
          
          <button
            onClick={handleCancel}
            disabled={status === 'CANCELLED' || status === 'DELIVERED'}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleReset}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}