'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';

// Database of products to prevent mismatched items
const productsData: Record<string, { name: string; price: number; brand: string; color: string; image: string }> = {
  'oppo-reno14-pro': {
    name: 'OPPO Reno14 Pro 5G (Titanium Grey, 256 GB)',
    price: 54999,
    brand: 'OPPO',
    color: 'Grey',
    image: '📱 OPPO Reno14 Pro 5G',
  },
  'electrobook-pro-x': {
    name: 'ElectroBook Pro X',
    price: 129900,
    brand: 'ElectroHub',
    color: 'Space Black',
    image: '💻 ElectroBook Pro X',
  },
};

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || 'oppo-reno14-pro';

  const [showToast, setShowToast] = useState(false);

  // Fetch product safely, fallback to default if ID is missing or invalid
  const product = productsData[productId] || productsData['oppo-reno14-pro'];

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = { id: productId, ...product };
    
    localStorage.setItem('cart', JSON.stringify([...existingCart, cartItem]));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-8 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 text-sm font-semibold animate-bounce">
          <CheckCircle size={18} /> Added to bag successfully!
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#131822] border border-slate-800 p-8 rounded-3xl shadow-xl">
          {/* Dynamic Product Image Container */}
          <div className="bg-[#0a0e17] border border-slate-800 rounded-2xl flex items-center justify-center p-12 text-cyan-400 font-bold text-lg text-center">
            {product.image}
          </div>

          {/* Product Details */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h1 className="text-2xl lg:text-3xl font-black text-white">{product.name}</h1>
              <p className="text-2xl font-bold text-cyan-400">₹ {product.price.toLocaleString('en-IN')}</p>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Brand: <strong className="text-slate-200">{product.brand}</strong> | Color: <strong className="text-slate-200">{product.color}</strong>. High-performance selection built for quality and reliability.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>

              <button
                type="button"
                onClick={() => router.push('/cart')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all text-sm"
              >
                Go to Cart / View Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-slate-400">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}