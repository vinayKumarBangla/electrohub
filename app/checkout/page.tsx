'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Check, ShieldCheck, CreditCard, LocateFixed, Wallet, Smartphone, Building2, Calendar, AlertCircle, Loader2, Star, MessageSquare } from 'lucide-react';

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

export default function CheckoutPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const errorRef = useRef<HTMLDivElement>(null);

  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [walletProvider, setWalletProvider] = useState('Paytm');
  const [emiProvider, setEmiProvider] = useState('HDFC_EMI');
  const [emiTenure, setEmiTenure] = useState('3_months');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('user_addresses') || '[]');
    if (savedAddresses.length === 0) {
      const defaultAddr: Address[] = [{
        id: '1',
        fullName: 'Vinay',
        phone: '9876543210',
        street: '1-109/1, Damaranch, Birkur',
        city: 'Kamareddy',
        state: 'Telangana',
        pincode: '503321',
        isDefault: true
      }];
      setAddresses(defaultAddr);
      localStorage.setItem('user_addresses', JSON.stringify(defaultAddr));
      setSelectedAddress(defaultAddr[0]);
    } else {
      setAddresses(savedAddresses);
      const defaultOne = savedAddresses.find((a: Address) => a.isDefault) || savedAddresses[0];
      setSelectedAddress(defaultOne);
    }
  }, []);

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleFetchLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await response.json();

          if (data && data.address) {
            setStreet(data.address.road || data.address.suburb || data.address.neighbourhood || 'Current Location Area');
            setCity(data.address.city || data.address.town || data.address.county || '');
            setState(data.address.state || '');
            setPincode(data.address.postcode || '');
          } else {
            alert('Could not resolve precise address details from coordinates.');
          }
        } catch (error) {
          alert('Failed to connect to location lookup service.');
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        alert('Unable to retrieve your live location. Please check permissions.');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: Date.now().toString(),
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      isDefault: addresses.length === 0
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem('user_addresses', JSON.stringify(updated));
    setSelectedAddress(newAddr);
    setShowAddModal(false);

    setFullName(''); setPhone(''); setStreet(''); setCity(''); setState(''); setPincode('');
  };

  const handlePlaceOrder = () => {
    setErrorMessage('');

    if (!selectedAddress) {
      triggerError('Please select a shipping address before completing your order.');
      return;
    }

    if (paymentMethod === 'UPI') {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiId.trim() || !upiRegex.test(upiId)) {
        triggerError('Please enter a valid UPI ID (e.g., username@oksbi).');
        return;
      }
    } else if (paymentMethod === 'CARD') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 16 || !/^\d+$/.test(cleanCard)) {
        triggerError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        triggerError('Please enter a valid expiry date in MM/YY format.');
        return;
      }
      if (!cardCvv.trim() || cardCvv.length < 3 || !/^\d+$/.test(cardCvv)) {
        triggerError('Please enter a valid 3 or 4-digit CVV.');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Fix: Read from 'electrohub_cart' instead of 'cart' to match CartContext storage key
      const rawCart = JSON.parse(localStorage.getItem('electrohub_cart') || localStorage.getItem('cart') || '[]');
      
      let cartItems = [];
      if (rawCart.length > 0) {
        cartItems = rawCart.map((item: any) => ({
          id: item.productId || item.id || '1',
          name: item.title || item.name || 'Unnamed Product',
          price: Number(item.sellingPrice || item.price || 1499),
          image: item.image || item.image_url || '',
          brand: item.brandName || item.brand || 'TechCart',
          color: item.variantLabel || item.color || 'Standard',
          quantity: item.quantity || 1
        }));
      } else {
        cartItems = [{
          id: '1',
          name: 'Tech Product',
          price: 1499,
          image: '',
          brand: 'TechCart',
          color: 'Standard',
          quantity: 1
        }];
      }

      const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      const generatedId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

      const newOrder = {
        orderId: generatedId,
        items: cartItems,
        totalAmount,
        paymentMethod,
        date: new Date().toLocaleDateString(),
        status: 'Processing',
        shippingAddress: selectedAddress
      };

      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
      localStorage.removeItem('electrohub_cart');
      localStorage.removeItem('cart');

      setIsSubmitting(false);
      setConfirmedOrderId(generatedId);
      setOrderConfirmed(true);
    }, 1000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  const paymentOptions = [
    { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone },
    { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'NETBANKING', label: 'Net Banking', icon: Building2 },
    { id: 'WALLET', label: 'Mobile Wallets', icon: Wallet },
    { id: 'EMI', label: 'Easy EMI Option', icon: Calendar },
    { id: 'COD', label: 'Cash on Delivery (COD)', icon: ShieldCheck },
  ];

  const emiCards = [
    { id: 'HDFC_EMI', name: 'HDFC Credit Card EMI', desc: 'No Cost EMI available up to 6 months' },
    { id: 'ICICI_EMI', name: 'ICICI Bank EMI', desc: 'Low interest rates starting at 12% p.a.' },
    { id: 'SBI_EMI', name: 'SBI Credit Card EMI', desc: 'Flexible tenure options up to 12 months' },
    { id: 'ZEST_EMI', name: 'ZestMoney / Cardless EMI', desc: 'Instant approval with zero paperwork' },
  ];

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#131822] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto text-blue-400">
            <Check size={32} />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-black text-white">Order Confirmed! 🎉</h2>
            <p className="text-xs text-slate-300">Hello <span className="font-bold text-white">{selectedAddress?.fullName}</span>, your order has been placed successfully!</p>
            <p className="text-[11px] font-mono text-blue-400 pt-1">Order ID: {confirmedOrderId}</p>
          </div>

          <div className="bg-[#0a0e17] border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Payment Method:</span>
              <span className="font-bold text-white uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Delivery Address:</span>
              <span className="font-bold text-white text-right truncate max-w-[180px]">{selectedAddress?.street}, {selectedAddress?.city}</span>
            </div>
          </div>

          <div className="bg-[#0a0e17] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <MessageSquare size={14} className="text-blue-500" /> Share your checkout experience
            </div>

            {!feedbackSubmitted ? (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <div className="flex justify-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={`${
                          (hoverRating || rating) >= star
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-600'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  placeholder="How was your checkout experience? (Optional)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-[#131822] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />

                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs transition-all"
                >
                  Submit Feedback
                </button>
              </form>
            ) : (
              <div className="text-center py-2 space-y-1">
                <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Check size={14} /> Thank you for your valuable feedback!
                </p>
                <p className="text-[10px] text-slate-400">We appreciate your input to make ElectroHub better.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-xl flex items-center justify-center gap-2"
          >
            Proceed to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">ElectroHub <span className="text-blue-500">Checkout</span></h1>
          <button onClick={() => router.push('/')} className="text-xs text-slate-400 hover:text-white">Back to Shop</button>
        </div>

        <div ref={errorRef}>
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-xs shadow-lg">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="bg-[#131822] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" /> Select Shipping Address
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Plus size={14} /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map((addr) => {
              const isSelected = selectedAddress?.id === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => { setSelectedAddress(addr); setErrorMessage(''); }}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all space-y-2 ${isSelected ? 'bg-blue-600/10 border-blue-500 shadow-lg ring-1 ring-blue-500' : 'bg-[#0a0e17] border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{addr.fullName}</span>
                    {isSelected && <span className="bg-blue-500 text-white p-0.5 rounded-full"><Check size={10} /></span>}
                  </div>
                  <p className="text-slate-300">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-slate-400 text-[10px]">Phone: {addr.phone}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#131822] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard size={16} className="text-blue-500" /> Select Payment Method
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentOptions.map((opt) => {
              const IconComponent = opt.icon;
              const isSelected = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { setPaymentMethod(opt.id); setErrorMessage(''); }}
                  className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-3 text-left ${isSelected ? 'bg-blue-600/20 border-blue-500 text-blue-400 ring-1 ring-blue-500' : 'bg-[#0a0e17] border-slate-800 text-slate-300 hover:border-slate-700'}`}
                >
                  <IconComponent size={18} className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
                  <span className="flex-1">{opt.label}</span>
                  {isSelected && <Check size={14} className="text-blue-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            {paymentMethod === 'UPI' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300">Enter UPI ID (e.g., username@oksbi)</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => { setUpiId(e.target.value); setErrorMessage(''); }}
                  className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300">Card Details</label>
                <input
                  type="text"
                  placeholder="Card Number (4444 4444 4444 4444)"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => { setCardNumber(e.target.value); setErrorMessage(''); }}
                  className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => { setCardExpiry(e.target.value); setErrorMessage(''); }}
                    className="bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => { setCardCvv(e.target.value); setErrorMessage(''); }}
                    className="bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="HDFC">HDFC Bank</option>
                  <option value="SBI">State Bank of India (SBI)</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="AXIS">Axis Bank</option>
                  <option value="KOTAK">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {paymentMethod === 'WALLET' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300">Select Wallet Provider</label>
                <select
                  value={walletProvider}
                  onChange={(e) => setWalletProvider(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Paytm">Paytm Wallet</option>
                  <option value="PhonePe">PhonePe Wallet</option>
                  <option value="Mobikwik">MobiKwik</option>
                  <option value="Freecharge">Freecharge</option>
                </select>
              </div>
            )}

            {paymentMethod === 'EMI' && (
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-300 block">Select EMI Option / Bank Card</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {emiCards.map((card) => {
                    const isCardSelected = emiProvider === card.id;
                    return (
                      <div
                        key={card.id}
                        onClick={() => setEmiProvider(card.id)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1 ${isCardSelected ? 'bg-blue-600/20 border-blue-500 text-blue-400 ring-1 ring-blue-500 shadow-md' : 'bg-[#0a0e17] border-slate-800 text-slate-300 hover:border-slate-700'}`}
                      >
                        <div className="flex justify-between items-center font-bold text-white">
                          <span>{card.name}</span>
                          {isCardSelected && <Check size={14} className="text-blue-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400">{card.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-bold text-slate-300">Choose Tenure Plan</label>
                  <select
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="3_months">3 Months No Cost EMI</option>
                    <option value="6_months">6 Months Standard EMI</option>
                    <option value="12_months">12 Months Low Cost EMI</option>
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <p className="text-[11px] text-slate-400 italic">Pay securely with cash or UPI scanner upon delivery at your doorstep.</p>
            )}
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing Order...
            </>
          ) : (
            <>
              <ShieldCheck size={16} /> Complete Order
            </>
          )}
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131822] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Add Delivery Address</h3>
              <button
                type="button"
                onClick={handleFetchLiveLocation}
                disabled={loadingLocation}
                className="bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <LocateFixed size={13} /> {loadingLocation ? 'Detecting GPS...' : 'Use Live Location'}
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Street Address / Area" value={street} onChange={e => setStreet(e.target.value)} required className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required className="bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500" />
                <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} required className="bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>
              <input type="text" placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} required className="w-full bg-[#0a0e17] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500" />
              
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all">Save Address and Select</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}