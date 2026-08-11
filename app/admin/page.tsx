'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, DollarSign, ShoppingBag, Users, ArrowLeft, CheckCircle, Package } from 'lucide-react';

interface Order {
  orderId: string;
  items: any[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  status: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    city: string;
  };
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  // Calculate live analytics metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const activeReturnsCount = orders.filter((o) => o.status.includes('Requested')).length;
  const completedDeliveriesCount = orders.filter((o) => o.status.includes('Delivered') || o.status.includes('Refunded')).length;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Admin <span className="text-blue-500">Control Panel</span>
          </h1>
          <p className="text-xs text-slate-400">Store-wide revenue metrics, live order monitoring, and management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <span className="px-3 py-1 bg-rose-600/20 border border-rose-500/30 text-rose-400 font-bold text-xs rounded-xl flex items-center gap-1">
            <ShieldAlert size={12} /> Restricted Admin Access
          </span>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131822] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign size={18} className="text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">₹ {totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-green-400 font-semibold">+12.5% from last week</p>
        </div>

        <div className="bg-[#131822] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag size={18} className="text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalOrdersCount}</p>
          <p className="text-[10px] text-slate-400">Recorded across local sync</p>
        </div>

        <div className="bg-[#131822] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Returns</span>
            <Package size={18} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{activeReturnsCount}</p>
          <p className="text-[10px] text-amber-400 font-semibold">Pending rider pickups</p>
        </div>

        <div className="bg-[#131822] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle size={18} className="text-green-400" />
          </div>
          <p className="text-2xl font-black text-white">{completedDeliveriesCount}</p>
          <p className="text-[10px] text-slate-400">Successfully delivered/refunded</p>
        </div>
      </div>

      {/* Orders Management Table Section */}
      <div className="bg-[#131822] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent System Orders & Status Log</h2>
        
        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No orders have been placed in the system yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Payment</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 font-mono text-blue-400 font-bold">{order.orderId}</td>
                    <td className="py-3 text-slate-200">{order.shippingAddress?.fullName || 'Customer'}</td>
                    <td className="py-3 font-bold text-white">₹ {order.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3 uppercase text-slate-400">{order.paymentMethod}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}