

'use client';
import { supabase } from '@/lib/actions/products';
import ProductCard from '@/components/home/ProductCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Rest of your component code...

function ProductActions({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const variant = product.product_variants?.[0] || null;

  const handleAddToCart = () => {
    const user = localStorage.getItem('electrohub_user');
    if (!user) {
      router.push('/login');
      return;
    }
    addToCart(product, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    const user = localStorage.getItem('electrohub_user');
    if (!user) {
      router.push('/login');
      return;
    }
    addToCart(product, variant);
    router.push('/cart');
  };

  const sellingPrice = Number(variant?.selling_price || product.price || 1499);

  return (
    <div className="grid grid-cols-2 gap-3 w-full mt-6">
      <button
        onClick={handleAddToCart}
        className={`text-xs font-black py-3.5 px-3 rounded-xl shadow-lg transition uppercase tracking-wider ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-amber-500 hover:bg-amber-600 text-gray-900 shadow-amber-500/20'
        }`}
      >
        {added ? '✓ Added' : '🛒 Add to Cart'}
      </button>
      <button
        onClick={handleBuyNow}
        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs py-3.5 px-3 rounded-xl shadow-lg shadow-orange-600/30 transition uppercase tracking-wider flex flex-col items-center justify-center leading-tight"
      >
        <span>⚡ Buy Now</span>
        <span className="text-[10px] font-normal opacity-90">at ₹{sellingPrice.toLocaleString('en-IN')}</span>
      </button>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*), product_variants(*), brands(*)')
    .eq('id', id)
    .single();

  const { data: similarProducts } = await supabase
    .from('products')
    .select('*, categories(*), product_variants(*), brands(*)')
    .neq('id', id)
    .limit(10);

  if (!product) {
    return (
      <div className="bg-[#07090e] min-h-screen flex flex-col items-center justify-center text-white space-y-4">
        <p className="text-sm font-bold">Product not found.</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-xs font-bold transition">
          Back to Home
        </a>
      </div>
    );
  }

  const pAny = product as Record<string, any>;
  const variant = pAny.product_variants?.[0] || {};
  const sellingPrice = Number(variant.selling_price || pAny.price || 1499);
  const mrpPrice = Number(variant.mrp_price || Math.round(sellingPrice * 1.4));
  const discountPercent = Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100);
  const imageUrl = variant.images?.[0] || pAny.image || '/assets/products/earbuds.png';

  return (
    <div className="bg-[#07090e] text-white min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Product Section */}
        <div className="bg-[#0d1322] border border-gray-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
          
          {/* Left: Sticky Image & Action Buttons */}
          <div className="lg:col-span-5 bg-[#07090e] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-between relative overflow-hidden group">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg z-10 shadow">
                {discountPercent}% OFF
              </span>
            )}
            <div className="h-96 w-full flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
              />
            </div>

            <ProductActions product={product} />
          </div>

          {/* Right: Detailed Info & Flipkart Features */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                {pAny.brands?.name || 'TechCart Certified Brand'}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-snug">
                {product.title}
              </h1>

              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1 shadow">
                  4.3 ★
                </span>
                <span className="text-xs text-gray-400">4,90,608 Ratings & 32,150 Reviews</span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-black text-white">
                  ₹{sellingPrice.toLocaleString('en-IN')}
                </span>
                {mrpPrice > sellingPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{mrpPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-bold text-green-400">Special Price</span>
              </div>
            </div>

            {/* Bank Offers & Discounts Box */}
            <div className="bg-[#161f33] border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span>🎁</span>
                  <span>Available offers for maximum savings</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
                <div className="bg-[#07090e] p-3 rounded-xl border border-gray-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block mb-0.5">Bank Offer</span>
                    <span className="text-gray-400">10% off on HDFC Bank Credit Card</span>
                  </div>
                  <span className="text-blue-400 font-bold text-xs cursor-pointer">Apply</span>
                </div>
                <div className="bg-[#07090e] p-3 rounded-xl border border-gray-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block mb-0.5">Partner Offer</span>
                    <span className="text-gray-400">Get extra ₹500 off on exchange deals</span>
                  </div>
                  <span className="text-blue-400 font-bold text-xs cursor-pointer">Apply</span>
                </div>
              </div>
            </div>

            {/* EMI & Pay Later */}
            <div className="bg-[#161f33] border border-gray-800 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-gray-300 block">Apply for Card, EMI and Pay Later</span>
              <div className="bg-[#07090e] p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💳</span>
                  <div>
                    <p className="font-bold text-white">Activate Flipkart EMI / TechCart EMI</p>
                    <p className="text-[10px] text-gray-400">No Cost EMI™ available | Unlock ₹1 lakh limit</p>
                  </div>
                </div>
                <span className="text-blue-400 font-bold hover:underline cursor-pointer">Check Limit</span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-[#07090e] border border-gray-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-bold text-white">Delivery Details</span>
                <span className="text-blue-400 cursor-pointer">Select delivery location</span>
              </div>
              <p className="text-gray-400">Delivery by <strong className="text-white">13 Aug, Thu</strong> | <span className="text-green-400 font-bold">Free Delivery</span></p>
            </div>

            {/* Shop with Peace of Mind */}
            <div className="bg-[#0d1322] border border-gray-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-gray-300 block">Shop with peace of mind</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-[#07090e] p-2.5 rounded-xl border border-gray-800 text-gray-300">
                  <span className="block text-base mb-1">🛡️</span>
                  <span>1 Year Domestic Warranty</span>
                </div>
                <div className="bg-[#07090e] p-2.5 rounded-xl border border-gray-800 text-gray-300">
                  <span className="block text-base mb-1">💵</span>
                  <span>Cash on Delivery</span>
                </div>
                <div className="bg-[#07090e] p-2.5 rounded-xl border border-gray-800 text-gray-300">
                  <span className="block text-base mb-1">✔️</span>
                  <span>TechCart Assured</span>
                </div>
              </div>
            </div>

            {/* Product Highlights */}
            <div className="border-t border-gray-800 pt-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                <li className="flex items-center gap-2"><span>🔋</span> Up to 48 hr of Battery Life</li>
                <li className="flex items-center gap-2"><span>⚡</span> Fast Charging Support</li>
                <li className="flex items-center gap-2"><span>🎵</span> With Deep Bass Acoustics</li>
                <li className="flex items-center gap-2"><span>📶</span> Bluetooth 5.4 Connectivity</li>
              </ul>
            </div>

            {/* Description */}
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {product.description || 'Engineered with advanced dual-mic AI noise cancellation, supreme build quality, and comprehensive warranty coverage.'}
              </p>
            </div>

          </div>

        </div>

        {/* Ratings & Reviews Preview Section */}
        <div className="bg-[#0d1322] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-base font-black text-white">Ratings & Reviews</h2>
              <p className="text-xs text-gray-400">Verified buyers feedback</p>
            </div>
            <span className="text-xs font-bold text-blue-400 cursor-pointer">All 32,150 Reviews →</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#07090e] p-4 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">4.5 ★</span>
                <span className="font-bold text-white">Superb Quality!</span>
              </div>
              <p className="text-gray-400">Sound quality is exceptional with deep bass and crystal clear calling.</p>
              <span className="text-[10px] text-gray-500 block">Rahul Sharma • Certified Buyer</span>
            </div>
            <div className="bg-[#07090e] p-4 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">4.0 ★</span>
                <span className="font-bold text-white">Great Battery Backup</span>
              </div>
              <p className="text-gray-400">Lasts for days on a single charge. Fast charging works like magic.</p>
              <span className="text-[10px] text-gray-500 block">Priya Verma • Certified Buyer</span>
            </div>
            <div className="bg-[#07090e] p-4 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">5.0 ★</span>
                <span className="font-bold text-white">Value for Money</span>
              </div>
              <p className="text-gray-400">Best wireless earbuds in this price range. Highly recommended!</p>
              <span className="text-[10px] text-gray-500 block">Amit Patel • Certified Buyer</span>
            </div>
          </div>
        </div>

        {/* Similar Products Carousel / Grid */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="bg-[#0d1322] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-base font-black text-white">Similar Products</h2>
                <p className="text-xs text-gray-400">Customers also viewed these items</p>
              </div>
              <a href="/" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition">
                VIEW ALL →
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}