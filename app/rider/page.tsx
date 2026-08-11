'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, Phone, ArrowLeft } from 'lucide-react';

interface Order {
  orderId: string;
  items: any[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  status: string;
  reverseTrackingId?: string;
  scheduledPickup?: string;
  pickupOtp?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function RiderPortalPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [enteredOtp, setEnteredOtp] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const handleOtpChange = (orderId: string, val: string) => {
    setEnteredOtp({ ...enteredOtp, [orderId]: val });
  };

  const handleVerifyOtp = (order: Order) => {
    const otpInput = enteredOtp[order.orderId] || '';
    const correctOtp = order.pickupOtp || '4821';
    
    // Strict validation: check if input matches this exact order's generated OTP
    if (!otpInput.trim() || otpInput.trim() !== correctOtp) {
      alert('Incorrect OTP! Please enter the correct code assigned specifically to order ID ' + order.orderId);
      return;
    }

    const updated = orders.map((ord) => {
      if (ord.orderId === order.orderId) {
        return {
          ...ord,
          status: ord.status.includes('Return') ? 'Return Picked Up & Refunded' : 'Delivered Successfully'
        };
      }
      return ord;
    });

    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    alert('OTP Verified Successfully for order ' + order.orderId + '! Status updated.');
  };

  const activeDeliveries = orders.filter((o) => !o.status.includes('Delivered Successfully') && !o.status.includes('Refunded'));

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Rider <span className="text-blue-500">Delivery Portal</span>
          </h1>
          <p className="text-xs text-slate-400">Manage assigned deliveries and verify unique customer pickup OTPs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs rounded-xl">
            Partner: Rider Unit #4
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {activeDeliveries.length === 0 ? (
          <div className="bg-[#131822] border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Truck size={32} className="mx-auto text-slate-600" />
            <h3 className="text-sm font-bold text-white">No active pickups or deliveries assigned</h3>
            <p className="text-xs text-slate-400">New return requests or orders will appear here automatically.</p>
          </div>
        ) : (
          activeDeliveries.map((order) => (
            <div key={order.orderId} className="bg-[#131822] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono text-blue-400">ID: {order.orderId}</span>
                  <h2 className="text-base font-bold text-white mt-0.5">{order.shippingAddress?.fullName || 'Customer'}</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#0a0e17] p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <p className="text-slate-400 flex items-center gap-1 font-bold"><MapPin size={12} className="text-blue-400" /> Delivery / Pickup Address:</p>
                  <p className="text-slate-200">{order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : 'Hyderabad, Telangana'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 flex items-center gap-1 font-bold"><Phone size={12} className="text-blue-400" /> Contact:</p>
                  <p className="text-slate-200">{order.shippingAddress?.phone || '+91 9876543210'}</p>
                  <p className="text-cyan-300 font-mono text-[11px] pt-1">Expected: {order.scheduledPickup || 'Today'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  <span>Assigned Order OTP: </span>
                  <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                    {order.pickupOtp || '4821'}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    value={enteredOtp[order.orderId] || ''}
                    onChange={(e) => handleOtpChange(order.orderId, e.target.value)}
                    className="bg-[#0a0e17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center font-mono w-32 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleVerifyOtp(order)}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
                  >
                    Verify & Complete
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}