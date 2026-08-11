'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, ShieldCheck, LogOut, ArrowLeft, Mail, Phone, ShoppingBag, Edit3, Check, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  
  const [userName, setUserName] = useState('Vinay');
  const [userEmail, setUserEmail] = useState('vinay@techcart.com');
  const [userPhone, setUserPhone] = useState('9876543210');
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Load stored addresses
    const savedAddresses = JSON.parse(localStorage.getItem('user_addresses') || '[]');
    setAddresses(savedAddresses);

    // Load user session if any stored
    const storedUser = localStorage.getItem('electrohub_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.email) setUserEmail(parsed.email);
        if (parsed.phone) setUserPhone(parsed.phone);
      } catch (e) {
        // fallback
      }
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem('user_addresses', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('electrohub_user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col justify-between">
      <div className="p-6 md:p-12 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header & Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <ArrowLeft size={14} /> Back to Shop
          </button>
          <h1 className="text-xl font-black text-white">Account <span className="text-blue-500">Settings</span></h1>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 shadow-lg">
            <Check size={16} /> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Sidebar Navigation */}
          <div className="bg-[#131822] border border-slate-800 rounded-2xl p-4 space-y-2 h-fit shadow-xl">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <User size={16} /> My Profile
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                activeTab === 'addresses' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MapPin size={16} /> Saved Addresses
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <ShoppingBag size={16} /> My Orders
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck size={16} /> Security & Privacy
            </button>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 bg-[#131822] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            
            {/* Tab 1: Profile Information */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">Personal Information</h2>
                    <p className="text-xs text-slate-400">Manage your name, email, and phone number</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-4 text-xs">
                    <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-300">
                        <User size={18} className="text-blue-500" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Full Name</p>
                          <p className="font-bold text-white text-sm">{userName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-300">
                        <Mail size={18} className="text-blue-500" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Email Address</p>
                          <p className="font-bold text-white text-sm">{userEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-300">
                        <Phone size={18} className="text-blue-500" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Mobile Number</p>
                          <p className="font-bold text-white text-sm">+91 {userPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold">Full Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold">Email Address</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold">Mobile Number</label>
                      <input
                        type="text"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        required
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
                    >
                      Save Changes
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Tab 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-base font-bold text-white">Manage Saved Addresses</h2>
                  <p className="text-xs text-slate-400">Addresses used for quick checkout</p>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <MapPin size={32} className="text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No saved addresses found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl flex justify-between items-start text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-slate-400 text-[10px]">Phone: +91 {addr.phone}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-400 hover:text-red-300 p-2 transition"
                          title="Delete Address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Security & Privacy */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-base font-bold text-white">Security & Password</h2>
                  <p className="text-xs text-slate-400">Manage your account credentials and security preferences</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Two-Factor Authentication (2FA)</p>
                      <p className="text-slate-400 text-[10px]">Protect your account with SMS verification codes</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold text-[10px]">
                      Active
                    </span>
                  </div>

                  <div className="bg-[#0a0e17] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Active Login Sessions</p>
                      <p className="text-slate-400 text-[10px]">Currently logged in on this browser via localStorage</p>
                    </div>
                    <span className="text-blue-400 font-bold text-[10px]">This Device</span>
                  </div>
                </div>
              </div>
            )}

          </div>

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