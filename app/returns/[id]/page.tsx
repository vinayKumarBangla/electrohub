'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';

export default function ReturnOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Example insertion into Supabase returns table:
    /*
    const { error: insertError } = await supabase.from('returns').insert([
      { order_id: orderId, reason, status: 'REQUESTED' }
    ]);

    if (insertError) {
      setError('Failed to submit return request. Please try again.');
    } else {
      setSuccess(true);
    }
    */

    // Simulating action for demo workflow:
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Request Return / Replacement</h1>
        <p className="text-sm text-gray-500 mb-6">Order ID: <span className="font-semibold text-gray-700">{orderId}</span></p>

        {success ? (
          <div className="space-y-4 text-center py-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
            <h2 className="text-lg font-bold text-gray-800">Request Submitted Successfully</h2>
            <p className="text-sm text-gray-600">Our delivery partner will reach out to pick up the item.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition shadow-md text-sm mt-4"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReturn} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Reason for Return / Replacement
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please describe why you are returning this item (e.g. damaged, wrong item, size issue)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md text-sm"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}