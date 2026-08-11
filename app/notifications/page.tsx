'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Bell, CheckCircle2, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Read orders and return requests from local storage to auto-generate simulated emails/notifications
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const generatedNotifs: NotificationItem[] = [];

    savedOrders.forEach((order: any) => {
      generatedNotifs.push({
        id: `ord-${order.orderId}`,
        title: `Order Placed Successfully (${order.orderId})`,
        message: `Your order for ₹${order.totalAmount?.toLocaleString('en-IN')} has been placed using ${order.paymentMethod}.`,
        date: order.date || 'Recent',
        type: 'order'
      });

      if (order.status.includes('Return') || order.status.includes('Replacement') || order.pickupOtp) {
        generatedNotifs.push({
          id: `ret-${order.orderId}`,
          title: `Pickup Scheduled & Verification OTP`,
          message: `Your return/replacement request for ${order.orderId} is confirmed. Pickup is scheduled for ${order.scheduledPickup || 'Soon'}. Your secure verification OTP is: ${order.pickupOtp || '4821'}.`,
          date: 'Just now',
          type: 'return'
        });
      }

      if (order.status.includes('Delivered') || order.status.includes('Refunded')) {
        generatedNotifs.push({
          id: `del-${order.orderId}`,
          title: `Status Update: ${order.status}`,
          message: `Your order ${order.orderId} status has been updated to: ${order.status}.`,
          date: 'Completed',
          type: 'status'
        });
      }
    });

    setNotifications(generatedNotifs.reverse());
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Email & Notification <span className="text-blue-500">Inbox</span>
          </h1>
          <p className="text-xs text-slate-400">View simulated transactional emails, OTP notifications, and order updates.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-[#131822] border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Mail size={32} className="mx-auto text-slate-600" />
            <h3 className="text-sm font-bold text-white">No notifications or emails found</h3>
            <p className="text-xs text-slate-400">Place orders or request returns to see your simulated emails here.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="bg-[#131822] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Bell size={14} className="text-blue-400" /> {notif.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{notif.date}</span>
              </div>
              <p className="text-xs text-slate-300 bg-[#0a0e17] p-3 rounded-xl border border-slate-800 leading-relaxed font-mono">
                {notif.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}