'use client';

import { useState, useEffect } from 'react';
import { getProductById, ProductWithDetails, ProductVariant } from '@/lib/actions/products';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

// Local asset image resolver helper
function getLocalProductImage(title: string): string {
  const t = (title || '').toLowerCase();

  if (t.includes('oppo')) return '/assets/products/oppo.png';
  if (t.includes('vivo')) return '/assets/products/vivo1.png';
  if (t.includes('samsung') || t.includes('galaxy') || t.includes('s25')) return '/assets/products/samsung1.png';
  if (t.includes('nothing') || t.includes('phone')) return '/assets/products/mobiles.png';
  if (t.includes('motorola') || t.includes('edge')) return '/assets/products/oppo2.png';
  if (t.includes('xiaomi') || t.includes('redmi')) return '/assets/products/xiomi.png';
  if (t.includes('macbook') || t.includes('apple laptop')) return '/assets/products/laptop1.png';
  if (t.includes('laptop') || t.includes('notebook')) return '/assets/products/laptop.png';
  if (t.includes('tab') || t.includes('tablet')) return '/assets/products/Tab.png';
  if (t.includes('earbud') || t.includes('airpods')) return '/assets/products/earbuds.png';
  if (t.includes('headphone') || t.includes('sony')) return '/assets/products/headphones.png';
  if (t.includes('earphone')) return '/assets/products/Earphones.png';
  if (t.includes('speaker')) return '/assets/products/Speaker.png';
  if (t.includes('watch') || t.includes('smartwatch')) return '/assets/products/watch.png';
  if (t.includes('tv') || t.includes('television') || t.includes('smart tv')) return '/assets/products/samsungtv.png';
  if (t.includes('lg')) return '/assets/products/lg1.png';
  if (t.includes('tcl')) return '/assets/products/tcl.png';
  if (t.includes('toshiba')) return '/assets/products/toshiba.png';
  if (t.includes('refrigerator') || t.includes('fridge')) return '/assets/products/refredgrator.png';
  if (t.includes('washing') || t.includes('machine')) return '/assets/products/washmachine.png';
  if (t.includes('grinder')) return '/assets/products/grinder.png';
  if (t.includes('iron')) return '/assets/products/ironbox.png';
  if (t.includes('stove')) return '/assets/products/stove.png';

  return '/assets/products/mobiles.png';
}

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(productId);
        setProduct(data as ProductWithDetails);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-sm shadow-sm animate-pulse min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-white text-center rounded-sm shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <Link href="/" className="inline-block mt-4 bg-flipkart-blue text-white font-bold text-xs px-6 py-2.5 rounded-sm">
          BACK TO HOMEPAGE
        </Link>
      </div>
    );
  }

  const variants = product.product_variants || [];
  const selectedVariant = (variants[selectedVariantIndex] || variants[0] || {}) as Record<string, any>;
  const productAny = product as Record<string, any>;

  const sellingPrice = Number(selectedVariant.selling_price || selectedVariant.price || productAny.price || 499);
  const mrpPrice = Number(selectedVariant.mrp_price || productAny.mrp_price || Math.round(sellingPrice * 1.3));
  const discountPercent = Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100);

  const dbImage = selectedVariant.images?.[0] || productAny.image;
  const displayImage = dbImage && typeof dbImage === 'string' && dbImage.trim() !== ''
    ? dbImage
    : getLocalProductImage(product.title);

  const brandName = productAny.brands?.name || productAny.brand?.name || 'ElectroHub';
  const colorAttr = selectedVariant.color || selectedVariant.attributes?.color || '';

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
      <div className="bg-white rounded-sm shadow-sm p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Image & Actions */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full h-80 md:h-96 border rounded-sm p-4 flex items-center justify-center bg-gray-50 relative">
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={displayImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => addToCart(product, selectedVariant as ProductVariant)}
              className="bg-flipkart-amber hover:bg-amber-600 text-white font-bold py-3 rounded-sm shadow text-sm uppercase"
            >
              🛒 Add to Cart
            </button>
            <Link
              href="/checkout"
              onClick={() => addToCart(product, selectedVariant as ProductVariant)}
              className="bg-flipkart-orange hover:bg-orange-600 text-white font-bold py-3 rounded-sm shadow text-sm uppercase text-center flex items-center justify-center"
            >
              ⚡ Buy Now
            </Link>
          </div>
        </div>

        {/* Right Column: Details & Variants */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">{brandName}</span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">{product.title}</h1>
          </div>

          {colorAttr && (
            <p className="text-xs text-gray-600">Color: <span className="font-semibold text-gray-900">{colorAttr}</span></p>
          )}

          <div className="border-t border-b py-3 flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-gray-900">
              ₹{sellingPrice.toLocaleString('en-IN')}
            </span>
            {mrpPrice > sellingPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{mrpPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Variant Selector Button List */}
          {variants.length > 1 && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Select Option:</label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v: any, idx: number) => (
                  <button
                    key={v.id || idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-bold border rounded-sm transition ${
                      selectedVariantIndex === idx
                        ? 'border-flipkart-blue text-flipkart-blue bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {v.color || v.storage || v.sku || `Option ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description || 'Premium engineered electronic product built with high-grade components for superior reliability and performance.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}