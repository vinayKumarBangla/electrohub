'use client';

import { useEffect, useState } from 'react';
import CategoryBar from '@/components/home/CategoryBar';
import ProductCard from '@/components/home/ProductCard';
import { supabase } from '@/lib/actions/products';
import Link from 'next/link';

const bannerSlides = [
  {
    brand: 'Haier',
    title: 'QLED Q7 Pro Series',
    subtitle: 'Shine in Stunning Clarity',
    badge: 'New',
    bgGradient: 'from-[#141824] via-[#1a2235] to-[#0d121c]',
    image: '/assets/products/samsungtv.png',
    features: ['Google TV', 'AI Picture Quality', 'Dolby Vision-Atmos', '2.1CH Speaker']
  },
  {
    brand: 'TechCart OS',
    title: 'Next-Gen 5G Smartphones',
    subtitle: 'Ultra Performance & Pro Cameras',
    badge: 'Hot Deal',
    bgGradient: 'from-blue-950 via-indigo-950 to-slate-900',
    image: '/assets/products/samsung1.png',
    features: ['Snapdragon 8 Gen 3', '120Hz AMOLED', '100W Fast Charge', 'OIS Camera']
  },
  {
    brand: 'Premium Sound',
    title: 'Wireless Audio & TWS',
    subtitle: 'Immersive Studio Sound On the Go',
    badge: 'Trending',
    bgGradient: 'from-purple-950 via-indigo-950 to-slate-900',
    image: '/assets/products/headphones.png',
    features: ['Active Noise Cancellation', '40H Battery', 'Hi-Res Audio', 'Spatial Sound']
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-advance banner carousel every 4 seconds
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*), brands(*)');

        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const slide = bannerSlides[currentSlide];

  return (
    <div className="bg-[#07090e] text-white min-h-screen flex flex-col justify-between">
      
      <div>
        {/* Single Navbar Handled Entirely via CategoryBar */}
        <CategoryBar />

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
          
          {/* Professional Carousel Banner */}
          <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r ${slide.bgGradient} border border-gray-800/80 p-6 md:p-10 transition-all duration-700 min-h-[320px] md:min-h-[380px] flex items-center`}>
            
            <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center gap-6">
              
              {/* Left Content */}
              <div className="md:col-span-7 space-y-3 z-10">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">{slide.brand}</span>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">{slide.title}</h1>
                  <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {slide.badge}
                  </span>
                </div>
                <p className="text-sm md:text-lg text-amber-300 font-medium">{slide.subtitle}</p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {slide.features.map((feat, idx) => (
                    <span key={idx} className="bg-black/30 backdrop-blur-md border border-white/10 text-gray-200 text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-lg">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Image Display */}
              <div className="md:col-span-5 flex items-center justify-center relative">
                <div className="absolute w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-64 md:max-h-72 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>

            </div>

            {/* Carousel Navigation Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {bannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Arrow Controls */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition text-xs cursor-pointer"
            >
              ❮
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition text-xs cursor-pointer"
            >
              ❯
            </button>

          </div>

          {/* Value Proposition Badges */}
          <div className="bg-[#0d1322] border border-gray-800/80 rounded-2xl p-4 md:p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-3xl p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">🎁</span>
              <div>
                <h3 className="text-xs font-bold text-white uppercase">Wide range of products</h3>
                <p className="text-[11px] text-gray-400">Wide range of products across all categories of electronics.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">🏷️</span>
              <div>
                <h3 className="text-xs font-bold text-white uppercase">Competitive price</h3>
                <p className="text-[11px] text-gray-400">Assuring competitive price for quality products.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl p-3 bg-green-500/10 rounded-xl border border-green-500/20">💳</span>
              <div>
                <h3 className="text-xs font-bold text-white uppercase">Easy finance options</h3>
                <p className="text-[11px] text-gray-400">Multiple finance options and easy installment schemes.</p>
              </div>
            </div>
          </div>

          {/* Best Deals Section */}
          <div className="bg-[#0d1322]/80 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-xl border border-gray-800/80">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">Best Deals on Electronics</h2>
                <p className="text-xs text-gray-400">Handpicked items at unbeatable daily prices</p>
              </div>
              <Link href="/categories/mobiles" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition">
                VIEW ALL →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                Loading store inventory...
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 text-xs">
                No products found in inventory.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer Component */}
      <footer className="bg-[#05070b] border-t border-gray-800/80 mt-16 text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="text-lg font-extrabold italic tracking-wider text-amber-400">TechCart OS</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Your ultimate destination for high-end smartphones, laptops, audio systems, and smart home appliances.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Top Categories</h3>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/categories/mobiles" className="hover:text-white transition">Smartphones</Link></li>
              <li><Link href="/categories/laptops" className="hover:text-white transition">Laptops & Tablets</Link></li>
              <li><Link href="/categories/audio" className="hover:text-white transition">Audio & Wearables</Link></li>
              <li><Link href="/categories/appliances" className="hover:text-white transition">Home Appliances</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Customer Service</h3>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/track-order" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Help & Support</Link></li>
              <li><Link href="/profile" className="hover:text-white transition">User Account</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Authentication Help</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Secure Shopping</h3>
            <p className="text-[11px] text-gray-500 mb-2">100% Secure payments backed by major banking partners.</p>
            <div className="flex gap-2 text-lg">
              <span>💳</span>
              <span>🔒</span>
              <span>⚡</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 py-4 text-center text-[10px] text-gray-600">
          © {new Date().getFullYear()} TechCart OS Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
}