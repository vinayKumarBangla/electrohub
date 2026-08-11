'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Send, Bot, User, HelpCircle, Package, RefreshCcw, ShieldAlert, PhoneCall, CreditCard, Lock, FileText, Truck } from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export default function SupportPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I am your TechCart Advanced Support AI. I can solve any problem you are facing—whether it is about orders, payments, refunds, returns, login errors, or account settings. How can I help you today?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "I understand your concern. To resolve this completely, you can check your Orders Dashboard or profile settings. If you need manual assistance, our 24/7 hotline is available at 1800-420-TECH.";
      
      const lower = userMsg.toLowerCase();

      // 1. Orders & Tracking Problems
      if (lower.includes('track') || lower.includes('where is my order') || lower.includes('delivery delay')) {
        aiReply = "📦 **Order Tracking Help:**\n• New orders start in 'Processing' and automatically update to 'Out for Delivery' within a short period.\n• You can view real-time tracking, live updates, and delivery partner details anytime under your **Order Dashboard**.\n• If your delivery is delayed past the estimated date, please share your Order ID here or contact our support team.";
      } 
      // 2. Returns, Replacements & Refunds
      else if (lower.includes('return') || lower.includes('replace') || lower.includes('refund') || lower.includes('damaged') || lower.includes('wrong product')) {
        aiReply = "🔄 **Returns & Refunds Resolution:**\n• To return or replace an item, go to your **Orders Dashboard**, find your delivered order, and click the **'Return / Replace'** button.\n• Select your reason (e.g., Damaged, Wrong Item, Defective), and a reverse pickup AWB will be generated instantly.\n• Refunds are credited back to your original payment method or bank account within 3 to 5 business days after pickup verification.";
      } 
      // 3. Payment Failures & Deductions
      else if (lower.includes('payment') || lower.includes('upi') || lower.includes('card') || lower.includes('dedcted') || lower.includes('money debit')) {
        aiReply = "💳 **Payment & Transaction Troubleshooting:**\n• If money was debited from your account but the order failed, don't worry! Banks automatically reverse failed transaction amounts within 3-5 business days.\n• TechCart supports secure UPI, Credit/Debit cards, and Cash on Delivery (COD).\n• If your payment page is stuck, try clearing your browser cache or switching to UPI.";
      }
      // 4. Account, Login & Password Issues
      else if (lower.includes('login') || lower.includes('password') || lower.includes('account') || lower.includes('profile name')) {
        aiReply = "👤 **Account & Security Support:**\n• You can edit your name, phone number, and email address anytime by clicking on your username in the top right and selecting **My Profile**.\n• Saved shipping addresses can be managed directly under your Profile settings for quick checkout.\n• If you are locked out, ensure your browser's localStorage is active or clear session cookies to log back in.";
      }
      // 5. Invoice & Billing
      else if (lower.includes('invoice') || lower.includes('bill') || lower.includes('gst') || lower.includes('receipt')) {
        aiReply = "📄 **Invoices & Billing:**\n• Official tax invoices are generated automatically for every completed order.\n• You can view and download your invoice summary directly from the items list inside your **Orders Dashboard** once an order is shipped or delivered.";
      }
      // 6. Greetings / General
      else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        aiReply = "Hello! I am fully equipped to solve any issue you are experiencing with TechCart. Feel free to ask about orders, payments, technical glitches, or account help!";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickPrompt = (question: string) => {
    setInputVal(question);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col justify-between">
      <div className="p-6 md:p-12 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Store
          </button>
          <h1 className="text-xl font-black text-white">Help & <span className="text-blue-500">Support Hub</span></h1>
        </div>

        {/* Quick Assistance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => router.push('/dashboard')}
            className="bg-[#131822] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-blue-500 transition group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Package size={20} />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">Your Orders & Tracking</h3>
            <p className="text-[11px] text-slate-400">Track live shipments or check order progress instantly.</p>
          </div>

          <div 
            onClick={() => router.push('/dashboard')}
            className="bg-[#131822] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-blue-500 transition group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <RefreshCcw size={20} />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">Returns & Replacements</h3>
            <p className="text-[11px] text-slate-400">Manage item returns, damaged goods claims, and refunds.</p>
          </div>

          <div className="bg-[#131822] border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PhoneCall size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">24/7 Customer Hotline</h3>
            <p className="text-[11px] text-slate-400">Toll-Free Support: 1800-420-TECH (Always active).</p>
          </div>
        </div>

        {/* AI Chatbot Section */}
        <div className="bg-[#131822] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
          
          {/* Chat Header */}
          <div className="bg-[#111622] border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white">TechCart AI Problem Solver</h2>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">● Ready to solve any issue</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">Instant Resolution</span>
          </div>

          {/* Chat Message Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-[#0a0e17] border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-[11px] italic">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <span>AI is diagnosing and formulating solution...</span>
              </div>
            )}
          </div>

          {/* Quick Problem Solver Chips */}
          <div className="px-4 py-2.5 bg-[#0d121c] border-t border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 shrink-0 self-center font-bold">Common Fixes:</span>
            <button onClick={() => handleQuickPrompt("Where is my order / delivery delay?")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full shrink-0 transition cursor-pointer">
              📦 Track Order
            </button>
            <button onClick={() => handleQuickPrompt("How do I return or replace a damaged item?")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full shrink-0 transition cursor-pointer">
              🔄 Return & Refund
            </button>
            <button onClick={() => handleQuickPrompt("Money deducted but payment failed?")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full shrink-0 transition cursor-pointer">
              💳 Payment Failure
            </button>
            <button onClick={() => handleQuickPrompt("How to update my profile or mobile number?")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full shrink-0 transition cursor-pointer">
              👤 Account Help
            </button>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#111622] border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Describe any problem you are facing in detail..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-[#0a0e17] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={14} /> Resolve Issue
            </button>
          </form>

        </div>

      </div>

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