'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Package, Clock, ChevronDown, ChevronUp, RefreshCw, X, Truck, Bike, Mail } from 'lucide-react';

interface OrderItem {
  id: string;
  name?: string;
  title?: string;
  price: number;
  image: string;
  brand?: string;
  color?: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
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

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'delivered'>('active');

  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'Return' | 'Replace'>('Return');
  const [returnReason, setReturnReason] = useState('Defective / Damaged Item');
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [currentUserStorageKey, setCurrentUserStorageKey] = useState<string>('orders_guest');

  useEffect(() => {
    async function loadUserOrders() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { user } } = await supabase.auth.getUser();
      const storageKey = user ? `orders_${user.id}` : 'orders_guest';
      setCurrentUserStorageKey(storageKey);

      // 1. Try fetching orders from Supabase database filtered by user_id
      if (user) {
        const { data: dbOrders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id);

        if (!error && dbOrders && dbOrders.length > 0) {
          const formattedDbOrders = dbOrders.map((o: any) => ({
            orderId: o.order_id,
            items: o.items || [],
            totalAmount: Number(o.total_amount),
            paymentMethod: o.payment_method,
            date: new Date(o.created_at).toLocaleDateString(),
            status: o.status,
            reverseTrackingId: o.reverse_tracking_id,
            scheduledPickup: o.scheduled_pickup,
            pickupOtp: o.pickup_otp,
            shippingAddress: o.shipping_address
          }));
          setOrders(formattedDbOrders);
          return;
        }
      }

      // 2. Fallback to user-specific localStorage key
      const savedOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setOrders(savedOrders);

      // Simulate status progression timer for local/fallback orders
      const timer = setTimeout(() => {
        const currentOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedOrders = currentOrders.map((ord: Order) => {
          if (ord.status === 'Processing' || ord.status === 'Shipped') {
            return { ...ord, status: 'Delivered' };
          }
          return ord;
        });

        setOrders(updatedOrders);
        localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
      }, 10000);

      return () => clearTimeout(timer);
    }

    loadUserOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleReturnReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder) return;

    setLoadingBackend(true);

    try {
      const response = await fetch('/api/orders/return-replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeModalOrder.orderId,
          actionType,
          reason: returnReason,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedOrders = orders.map((ord) => {
          if (ord.orderId === activeModalOrder.orderId) {
            return { 
              ...ord, 
              status: result.data.newStatus,
              reverseTrackingId: result.data.reverseTrackingId,
              scheduledPickup: result.data.scheduledPickup,
              pickupOtp: result.data.pickupOtp
            };
          }
          return ord;
        });

        setOrders(updatedOrders);
        localStorage.setItem(currentUserStorageKey, JSON.stringify(updatedOrders));
        alert(`Success! ${result.message}\nPickup OTP: ${result.data.pickupOtp}\nPickup scheduled for: ${result.data.scheduledPickup}`);
      } else {
        alert('Failed to process request: ' + result.message);
      }
    } catch (err) {
      alert('Network error connecting to backend API.');
    } finally {
      setLoadingBackend(false);
      setActiveModalOrder(null);
    }
  };

  const renderTrackerSteps = (status: string) => {
    let steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    let activeStepIndex = status.toLowerCase().includes('delivered') ? 3 : 1;

    if (status.includes('Return Requested')) {
      steps = ['Order Placed', 'Delivered', 'Return Requested', 'Pickup Scheduled', 'Refund Processed'];
      activeStepIndex = 2;
    } else if (status.includes('Replacement Requested')) {
      steps = ['Order Placed', 'Delivered', 'Replacement Requested', 'Item Picked Up', 'New Item Dispatched'];
      activeStepIndex = 2;
    }

    return (
      <div className="py-4 space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Tracking Status</h4>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0"></div>
          {steps.map((step, index) => {
            const isCompleted = index <= activeStepIndex;
            return (
              <div key={index} className="flex flex-col items-center relative z-10 space-y-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${isCompleted ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' : 'bg-[#0a0e17] border-slate-700 text-slate-500'}`}>
                  {index + 1}
                </div>
                <span className={`text-[10px] text-center max-w-[70px] ${isCompleted ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const isDelivered = order.status.toLowerCase().includes('delivered');
    if (activeTab === 'delivered') return isDelivered;
    return !isDelivered;
  });

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col justify-between">
      <div className="p-8 relative max-w-4xl mx-auto w-full space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Order <span className="text-blue-500">Dashboard</span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => router.push('/notifications')}
              className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Mail size={16} /> Notifications
            </button>
            <button 
              onClick={() => router.push('/rider')}
              className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bike size={16} /> Rider Portal
            </button>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Place New Order
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-[#131822] text-slate-400 hover:text-white'
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'delivered'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-[#131822] text-slate-400 hover:text-white'
            }`}
          >
            Past / Delivered Orders
          </button>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-[#131822] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Package size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No {activeTab} orders found</h3>
                <p className="text-xs text-slate-400">You don't have any orders in this view.</p>
              </div>
              {activeTab === 'active' && (
                <button 
                  onClick={() => router.push('/')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Browse Products
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;
              const firstItem = order.items?.[0] || { name: 'Product Item', title: 'Product Item', price: order.totalAmount };
              const firstName = firstItem.name || firstItem.title || 'Product Item';

              return (
                <div key={order.orderId} className="bg-[#131822] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-blue-400">Order ID: {order.orderId}</span>
                      <h2 className="text-base font-bold text-white">
                        {order.items?.length > 1 ? `${firstName} + ${order.items.length - 1} more item(s)` : firstName}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Clock size={12} /> {order.status}
                      </span>
                      <span className="text-base font-black text-white">
                        ₹ {order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Shipping Address:</span>
                      <p className="text-slate-200 font-medium">{order.shippingAddress?.fullName || 'Customer'}</p>
                      <p className="text-slate-400">
                        {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : '1-109/1, Hyderabad'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Transaction Detail:</span>
                      <p className="text-slate-200 font-medium uppercase">{order.paymentMethod}</p>
                      <p className="text-slate-400">Ordered on: {order.date}</p>
                      {order.reverseTrackingId && (
                        <div className="mt-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-300 font-mono text-[11px] space-y-0.5">
                          <p className="flex items-center gap-1"><Truck size={12} /> Return AWB: {order.reverseTrackingId}</p>
                          <p className="text-slate-400 text-[10px]">Scheduled Pickup: {order.scheduledPickup}</p>
                          {order.pickupOtp && (
                            <p className="text-amber-300 font-bold">Pickup OTP: {order.pickupOtp}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-800/80 mt-4 pt-4">
                    <button 
                      onClick={() => toggleExpand(order.orderId)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {isExpanded ? 'Hide Tracking & Details' : 'Track Order Status & Items'} 
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => router.push('/')}
                        className="text-xs text-blue-400 hover:underline font-semibold cursor-pointer"
                      >
                        Back to Store
                      </button>

                      {!order.status.includes('Requested') && (
                        <button
                          onClick={() => setActiveModalOrder(order)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                        >
                          <RefreshCw size={14} className="text-blue-400" /> Return / Replace
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
                      {renderTrackerSteps(order.status)}

                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-2">Items in this order:</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => {
                          const itemName = item.name || item.title || 'Product Item';
                          return (
                            <div key={idx} className="flex items-center justify-between bg-[#0a0e17] p-3 rounded-xl border border-slate-800 text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                  {item.image ? (
                                    <img src={item.image} alt={itemName} className="w-full h-full object-contain p-1" />
                                  ) : (
                                    <Package size={18} className="text-slate-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-white">{itemName}</p>
                                  <p className="text-[10px] text-slate-400">Color: {item.color || 'Standard'} | Brand: {item.brand || 'Generic'}</p>
                                </div>
                              </div>
                              <span className="font-bold text-slate-200">₹ {item.price?.toLocaleString('en-IN')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {activeModalOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131822] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setActiveModalOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Return or Replace Item</h3>
              <p className="text-xs text-slate-400">Order ID: <span className="font-mono text-blue-400">{activeModalOrder.orderId}</span></p>
            </div>

            <form onSubmit={handleReturnReplaceSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Select Request Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActionType('Return')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${actionType === 'Return' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#0a0e17] border-slate-800 text-slate-400'}`}
                  >
                    Return & Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('Replace')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${actionType === 'Replace' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#0a0e17] border-slate-800 text-slate-400'}`}
                  >
                    Replace Item
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Reason for {actionType}</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Defective / Damaged Item">Defective / Damaged Item</option>
                  <option value="Received Wrong Product">Received Wrong Product</option>
                  <option value="Product Quality Not as Expected">Product Quality Not as Expected</option>
                  <option value="Missing Parts or Accessories">Missing Parts or Accessories</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loadingBackend}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loadingBackend ? 'Submitting to Backend...' : `Submit ${actionType} Request`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#111622] text-gray-400 text-xs mt-20 border-t border-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="space-y-3">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">TechCart Stories</a></li>
              <li><a href="#" className="hover:underline">Press</a></li>
              <li><a href="#" className="hover:underline">Corporate Information</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">Group Companies</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Myntra</a></li>
              <li><a href="#" className="hover:underline">Cleartrip</a></li>
              <li><a href="#" className="hover:underline">Shopsy</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Payments</a></li>
              <li><a href="#" className="hover:underline">Shipping</a></li>
              <li><a href="#" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">Consumer Policy</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:underline">Terms Of Use</a></li>
              <li><a href="#" className="hover:underline">Security</a></li>
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Sitemap</a></li>
              <li><a href="#" className="hover:underline">Grievance Redressal</a></li>
            </ul>
          </div>
          <div className="space-y-3 col-span-2">
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">Registered Office Address:</h3>
            <p className="leading-relaxed text-gray-300">
              TechCart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white"><span>📦</span> Become a Seller</span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white"><span>⭐</span> Advertise</span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white"><span>🎁</span> Gift Cards</span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-white"><span>❓</span> Help Center</span>
          </div>
          <div>
            <span>© 2007-2026 TechCart.com</span>
          </div>
          <div className="flex items-center gap-1 bg-[#090d16] p-1.5 rounded border border-gray-800">
            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" className="h-5 object-contain" />
          </div>
        </div>
      </footer>
    </div>
  );
}