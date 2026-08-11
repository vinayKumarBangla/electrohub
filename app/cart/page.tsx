'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalMrp,
    totalSellingPrice,
    totalDiscount,
  } = useCart();

  useEffect(() => {
    const user = localStorage.getItem('electrohub_user');
    if (!user) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="bg-[#07090e] min-h-screen flex items-center justify-center">
        <p className="text-sm font-semibold text-gray-500 animate-pulse">Authenticating session...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#07090e] min-h-screen py-12 px-4 flex flex-col items-center justify-center">
        <div className="bg-[#111622] border border-gray-800 p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-gray-400 mt-1 mb-6">Explore our top deals and add items to your cart!</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-8 py-3 rounded-lg shadow uppercase transition">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#07090e] min-h-screen py-6 px-2 md:px-4 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#111622] border border-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center text-white">
            <h1 className="text-base font-bold">My Cart ({totalItems})</h1>
            <span className="text-xs text-gray-400">Deliver to: <strong className="text-white">Hyderabad - 500001</strong></span>
          </div>

          <div className="bg-[#111622] border border-gray-800 rounded-xl shadow-sm divide-y divide-gray-800">
            {cart.map((item) => {
              const attributes = item.variantAttributes || {};
              const attrValues = Object.values(attributes).filter(Boolean);
              const variantLabel = attrValues.length > 0 ? attrValues.join(' / ') : item.variantLabel || 'Standard';
              const maxStock = item.maxStock || 10;
              const isMaxReached = item.quantity >= maxStock;
              const itemImage = item.image || '/assets/products/mobiles.png';

              return (
                <div key={item.cartItemId} className="p-4 flex flex-col sm:flex-row items-start gap-4 text-white">
                  <div className="w-24 h-24 flex-shrink-0 bg-[#07090e] border border-gray-800 rounded-lg p-2 flex items-center justify-center">
                    <img src={itemImage} alt={item.title} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h2 className="text-sm font-bold text-white line-clamp-2">{item.title}</h2>
                    <p className="text-xs text-gray-400 font-medium">Brand: {item.brandName}</p>
                    {variantLabel && (
                      <p className="text-xs text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/20 inline-block px-2 py-0.5 rounded">
                        Variant: {variantLabel}
                      </p>
                    )}

                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-base font-extrabold text-white">
                        ₹{item.sellingPrice.toLocaleString('en-IN')}
                      </span>
                      {item.mrpPrice > item.sellingPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{item.mrpPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-3">
                      <div className="flex items-center border border-gray-700 rounded bg-[#07090e]">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          disabled={isMaxReached}
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className={`px-3 py-1 font-bold text-xs ${
                            isMaxReached
                              ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                              : 'bg-gray-800 hover:bg-gray-700 text-white'
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {isMaxReached && (
                        <span className="text-[11px] text-amber-500 font-medium">
                          (Max stock available: {maxStock})
                        </span>
                      )}

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-xs font-bold text-red-500 hover:underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#111622] border border-gray-800 rounded-xl shadow-sm p-4 sticky top-20 space-y-4 text-white">
            <h2 className="text-sm font-bold text-gray-400 border-b border-gray-800 pb-2 uppercase tracking-wider">
              PRICE DETAILS
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Price ({totalItems} items)</span>
                <span>₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-green-400 font-medium">
                <span>Discount</span>
                <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Delivery Charges</span>
                <span className="text-green-400 font-bold">FREE</span>
              </div>

              <div className="border-t border-gray-800 border-dashed pt-3 flex justify-between text-sm font-extrabold text-white">
                <span>Total Amount</span>
                <span>₹{totalSellingPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded text-xs text-green-400 font-semibold">
              You will save ₹{totalDiscount.toLocaleString('en-IN')} on this order
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded shadow transition text-xs uppercase tracking-wider"
            >
              PLACE ORDER
            </Link>
          </div>
        </div>

      </div>

      {/* Added Footer */}
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