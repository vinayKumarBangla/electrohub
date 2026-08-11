'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// Import your client-side supabase configuration here:
// import { supabase } from '@/lib/supabase';

export default function RiderTaskDetail() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id;

  const [order, setOrder] = useState<any>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch specific order/task details
  useEffect(() => {
    async function loadOrder() {
      // Example query: fetch order details where id = taskId
      // const { data } = await supabase.from('orders').select('*').eq('id', taskId).single();
      // setOrder(data);
    }
    loadOrder();
  }, [taskId]);

  const handleVerifyAndPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Verify OTP match
    // if (enteredOtp !== order.pickup_otp) {
    //   setError('Invalid OTP code. Please check with the customer.');
    //   setLoading(false);
    //   return;
    // }

    // 2. Update order status to 'PICKED_UP' and write to order_status_history
    // const { error: updateError } = await supabase.from('orders').update({ status: 'PICKED_UP' }).eq('id', taskId);
    
    // if (!updateError) {
    //   router.push('/delivery');
    // } else {
    //   setError('Failed to update status.');
    // }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-12">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Pickup Verification</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6 text-sm text-gray-600">
          <p><span className="font-semibold text-gray-700">Order ID:</span> {taskId}</p>
          <p><span className="font-semibold text-gray-700">Customer Address:</span> 123 Main Street, Apt 4B</p>
          <p><span className="font-semibold text-gray-700">Phone:</span> +1 234 567 890</p>
        </div>

        <form onSubmit={handleVerifyAndPickup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Enter 4-Digit Customer Pickup OTP
            </label>
            <input
              type="text"
              maxLength={4}
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="e.g. 4829"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
          >
            {loading ? 'Verifying...' : 'Verify OTP & Mark Picked Up'}
          </button>
        </form>
      </div>
    </div>
  );
}