'use client';

import { OrderStatus, ORDER_STATUS_FLOW, STATUS_METADATA, isStepCompleted } from '../app/utils/orderWorkflow';
import { Check, Clock, XCircle } from 'lucide-react';

interface OrderTrackerProps {
  currentStatus: OrderStatus;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

export default function OrderTracker({ currentStatus, onStatusChange }: OrderTrackerProps) {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
        <XCircle size={24} />
        <div>
          <p className="font-bold">Order Cancelled</p>
          <p className="text-xs text-slate-400">This order has been cancelled and is no longer active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {ORDER_STATUS_FLOW.map((stepKey, index) => {
          const completed = isStepCompleted(stepKey, currentStatus);
          const isCurrent = stepKey === currentStatus;
          const meta = STATUS_METADATA[stepKey];

          return (
            <div key={stepKey} className="flex items-start gap-4 relative">
              {index < ORDER_STATUS_FLOW.length - 1 && (
                <div className={`absolute left-4 top-8 w-0.5 h-10 ${
                  isStepCompleted(ORDER_STATUS_FLOW[index + 1], currentStatus) 
                    ? 'bg-blue-500' 
                    : 'bg-slate-800'
                }`} />
              )}

              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 transition-all ${
                completed 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-[#0a0e17] border-slate-800 text-slate-600'
              }`}>
                {completed ? <Check size={16} /> : <Clock size={14} />}
              </div>

              <div className="pt-1">
                <p className={`text-sm font-bold ${isCurrent ? 'text-blue-400' : completed ? 'text-white' : 'text-slate-500'}`}>
                  {meta.label}
                </p>
                <p className="text-xs text-slate-400">{meta.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}