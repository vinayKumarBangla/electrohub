'use client';



import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { ProductWithDetails, ProductVariant } from '@/lib/actions/products';

import { useCart } from '@/context/CartContext';

import ProductCard from '@/components/home/ProductCard';



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



interface Props {

  initialProduct: ProductWithDetails | null;

  initialSimilar: ProductWithDetails[];

  productId: string;

}



export default function ProductDetailsClient({ initialProduct, initialSimilar }: Props) {

  const router = useRouter();

  const { addToCart } = useCart();



  const [product] = useState<ProductWithDetails | null>(initialProduct);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(

    initialProduct?.product_variants?.[0] || null

  );

  const [added, setAdded] = useState(false);



  if (!product) {

    return (

      <div className="bg-[#07090e] min-h-screen flex flex-col items-center justify-center text-white space-y-4">

        <p className="text-sm font-bold">Product not found in database.</p>

        <button

          onClick={() => router.push('/')}

          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-xs font-bold transition"

        >

          Back to Home

        </button>

      </div>

    );

  }



  const variantAny = (selectedVariant || {}) as Record<string, any>;

  const productAny = product as Record<string, any>;



  const rawImage = variantAny.images?.[0] || productAny.image;

  const imageUrl = rawImage && typeof rawImage === 'string' && rawImage.trim() !== ''

    ? rawImage

    : getLocalProductImage(product.title);



  const sellingPrice = Number(variantAny.selling_price || variantAny.price || productAny.price || 499);

  const mrpPrice = Number(variantAny.mrp_price || productAny.mrp_price || Math.round(sellingPrice * 1.3));

  const discountPercent = Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100);



  const handleAddToCartAction = () => {

    const user = localStorage.getItem('electrohub_user');

    if (!user) {

      router.push('/login');

      return;

    }

    addToCart(product, selectedVariant || undefined);

    setAdded(true);

    setTimeout(() => setAdded(false), 1500);

  };



  const handleBuyNowAction = () => {

    const user = localStorage.getItem('electrohub_user');

    if (!user) {

      router.push('/login');

      return;

    }

    addToCart(product, selectedVariant || undefined);

    router.push('/cart');

  };



  return (

    <div className="bg-[#07090e] text-white min-h-screen py-8 px-4">

      <div className="max-w-7xl mx-auto space-y-8">

       

        <button

          onClick={() => router.back()}

          className="text-xs bg-[#111827] border border-gray-800 hover:border-gray-700 text-gray-300 px-4 py-2 rounded-xl transition"

        >

          ← Back to store

        </button>



        {/* Main Flipkart-Style Product Layout */}

        <div className="bg-[#0d1322] border border-gray-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">

         

          {/* Left Column: Image with Hover Zoom & Action Buttons */}

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



            {/* Action Buttons under image */}

            <div className="grid grid-cols-2 gap-3 w-full mt-6">

              <button

                onClick={handleAddToCartAction}

                className={`text-xs font-black py-3 px-3 rounded-xl shadow-lg transition uppercase tracking-wider ${

                  added

                    ? 'bg-green-600 text-white'

                    : 'bg-amber-500 hover:bg-amber-600 text-gray-900 shadow-amber-500/20'

                }`}

              >

                {added ? '✓ Added' : '🛒 Add to Cart'}

              </button>

              <button

                onClick={handleBuyNowAction}

                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs py-3 px-3 rounded-xl shadow-lg shadow-blue-600/30 transition uppercase tracking-wider"

              >

                ⚡ Buy Now

              </button>

            </div>

          </div>



          {/* Right Column: Detailed Specs & Offers */}

          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">

            <div className="space-y-3">

              <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">

                {productAny.brands?.name || 'TechCart Certified Brand'}

              </span>

              <h1 className="text-2xl md:text-3xl font-black text-white leading-snug">

                {product.title}

              </h1>



              <div className="flex items-center gap-2">

                <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1 shadow">

                  4.3 ★

                </span>

                <span className="text-xs text-gray-400">704 Ratings & 82 Verified Reviews</span>

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

              </div>

            </div>



            {/* Bank Offers & EMI Box */}

            <div className="bg-[#161f33] border border-amber-500/30 rounded-2xl p-4 space-y-3">

              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">

                <span>🎁</span>

                <span>Available offers & bank discounts</span>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">

                <div className="bg-[#07090e] p-3 rounded-xl border border-gray-800">

                  <span className="font-bold text-white block mb-0.5">10% Instant Discount</span>

                  <span className="text-gray-400">10% off on HDFC Bank Credit Card EMI Txns</span>

                </div>

                <div className="bg-[#07090e] p-3 rounded-xl border border-gray-800">

                  <span className="font-bold text-white block mb-0.5">Partner Offer</span>

                  <span className="text-gray-400">Get extra ₹500 off on exchange deals</span>

                </div>

              </div>

            </div>



            {/* Variant Selectors */}

            {product.product_variants && product.product_variants.length > 1 && (

              <div className="space-y-2">

                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Option:</label>

                <div className="flex flex-wrap gap-2">

                  {product.product_variants.map((v) => {

                    const label = v.color || v.storage || 'Variant';

                    const isSelected = selectedVariant?.id === v.id;

                    return (

                      <button

                        key={v.id}

                        onClick={() => setSelectedVariant(v)}

                        className={`text-xs px-4 py-2 rounded-xl font-bold border transition ${

                          isSelected

                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'

                            : 'bg-[#030712] border-gray-800 text-gray-300 hover:border-gray-600'

                        }`}

                      >

                        {label}

                      </button>

                    );

                  })}

                </div>

              </div>

            )}



            {/* Delivery Info */}

            <div className="border-t border-gray-800 pt-4 space-y-2 text-xs">

              <div className="flex justify-between items-center text-gray-300">

                <span>Delivery by <strong className="text-white">13 Aug, Thu</strong></span>

                <span className="text-green-400 font-bold">Fast Dispatch ✓</span>

              </div>

              <div className="flex flex-wrap items-center gap-4 text-gray-400 pt-1 text-[11px]">

                <span>🛡️ 1 Year Brand Warranty</span>

                <span>💵 Cash on Delivery Available</span>

                <span>🔄 7 Days Replacement</span>

              </div>

            </div>



            {/* Product Highlights */}

            <div className="border-t border-gray-800 pt-4 space-y-2">

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Highlights</h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">

                <li className="flex items-center gap-2"><span>⚡</span> High-efficiency power performance</li>

                <li className="flex items-center gap-2"><span>🔊</span> Premium studio-grade acoustics</li>

                <li className="flex items-center gap-2"><span>🔋</span> Extended battery backup</li>

                <li className="flex items-center gap-2"><span>✨</span> Ergonomic sleek finish</li>

              </ul>

            </div>



            {/* Description */}

            <div className="border-t border-gray-800 pt-4">

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>

              <p className="text-xs text-gray-300 leading-relaxed">

                {product.description || 'Engineered with advanced technology, supreme build quality, and comprehensive warranty coverage.'}

              </p>

            </div>



          </div>



        </div>



        {/* Similar Products Section */}

        {initialSimilar.length > 0 && (

          <div className="bg-[#0d1322] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">

            <div className="flex justify-between items-center border-b border-gray-800 pb-4">

              <div>

                <h2 className="text-base font-black text-white">Similar Products</h2>

                <p className="text-xs text-gray-400">Customers also viewed these items</p>

              </div>

              <button

                onClick={() => router.push('/')}

                className="text-xs font-bold text-blue-400 hover:text-blue-300 transition"

              >

                VIEW ALL →

              </button>

            </div>



            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {initialSimilar.map((item) => (

                <ProductCard key={item.id} item={item} />

              ))}

            </div>

          </div>

        )}



      </div>

    </div>

  );

}