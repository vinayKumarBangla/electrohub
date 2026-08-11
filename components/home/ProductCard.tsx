'use client';

import { ProductWithDetails } from '@/lib/actions/products';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function getLocalProductImage(title: string): string {
  const t = (title || '').toLowerCase();

  if (t.includes('oppo')) return '/assets/products/oppo.png';
  if (t.includes('vivo')) return '/assets/products/vivo1.png';
  if (t.includes('samsung') || t.includes('galaxy') || t.includes('s25')) return '/assets/products/samsung1.png';
  if (t.includes('nothing') || t.includes('phone')) return '/assets/products/mobiles.png';
  if (t.includes('motorola') || t.includes('edge')) return '/assets/products/oppo2.png';
  if (t.includes('xiaomi') || t.includes('redmi')) return '/assets/products/xiomi.png';
  if (t.includes('macbook')) return '/assets/products/laptop1.png';
  if (t.includes('laptop')) return '/assets/products/laptop.png';
  if (t.includes('tab')) return '/assets/products/Tab.png';
  if (t.includes('earbud') || t.includes('airpods')) return '/assets/products/earbuds.png';
  if (t.includes('headphone') || t.includes('sony')) return '/assets/products/headphones.png';
  if (t.includes('earphone')) return '/assets/products/Earphones.png';
  if (t.includes('speaker')) return '/assets/products/Speaker.png';
  if (t.includes('watch') || t.includes('smartwatch')) return '/assets/products/watch.png';
  if (t.includes('tv') || t.includes('television')) return '/assets/products/samsungtv.png';
  if (t.includes('lg')) return '/assets/products/lg1.png';
  if (t.includes('tcl')) return '/assets/products/tcl.png';
  if (t.includes('toshiba')) return '/assets/products/toshiba.png';
  if (t.includes('refrigerator') || t.includes('fridge')) return '/assets/products/refredgrator.png';
  if (t.includes('washing')) return '/assets/products/washmachine.png';
  if (t.includes('grinder')) return '/assets/products/grinder.png';
  if (t.includes('iron')) return '/assets/products/ironbox.png';
  if (t.includes('stove')) return '/assets/products/stove.png';

  return '/assets/products/mobiles.png';
}

export default function ProductCard({ item }: { item: ProductWithDetails }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const variant = (item.product_variants?.[0] || {}) as Record<string, any>;
  const itemAny = item as Record<string, any>;

  const dbImage = 
    itemAny.image_url || 
    itemAny.image || 
    variant.image_url || 
    variant.image || 
    variant.images?.[0] || 
    itemAny.images?.[0];

  const imageUrl = dbImage && typeof dbImage === 'string' && dbImage.trim() !== ''
    ? dbImage
    : getLocalProductImage(item.title);

  const sellingPrice = Number(variant.selling_price || variant.price || itemAny.price || 499);
  const mrpPrice = Number(variant.mrp_price || itemAny.mrp_price || Math.round(sellingPrice * 1.3));
  const discountPercent = Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100);
  const colorAttr = variant.color || variant.attributes?.color || '';

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = localStorage.getItem('electrohub_user');
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/products/${item.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const user = localStorage.getItem('electrohub_user');
    if (!user) {
      router.push('/login');
      return;
    }
    addToCart(item, item.product_variants?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-500/50 relative overflow-hidden">
      
      <div onClick={handleCardClick} className="block cursor-pointer">
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md z-10 shadow">
            {discountPercent}% OFF
          </span>
        )}

        <div className="w-full h-44 flex items-center justify-center p-2 bg-[#07090e] rounded-lg mb-4 overflow-hidden border border-gray-800/50">
          <img
            src={imageUrl}
            alt={item.title}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="text-xs font-bold text-gray-200 line-clamp-2 min-h-[32px] group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>
        
        {colorAttr && (
          <p className="text-[11px] text-gray-400 mt-1">Color: <span className="font-semibold text-gray-300">{colorAttr}</span></p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-sm font-extrabold text-white">
            ₹{sellingPrice.toLocaleString('en-IN')}
          </div>
          {mrpPrice > sellingPrice && (
            <div className="text-[11px] text-gray-500 line-through">
              ₹{mrpPrice.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`mt-4 w-full text-xs font-bold py-2.5 px-3 rounded-lg shadow transition-all ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20'
        }`}
      >
        {added ? '✓ ADDED TO CART' : '🛒 ADD TO CART'}
      </button>
    </div>
  );
}