'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ShoppingCart, Zap, ArrowLeft, Loader2, Package } from 'lucide-react';
import { supabase } from '@/lib/actions/products';
import ProductCard from '@/components/home/ProductCard';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_variants(*), brands(*)')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);

        if (data) {
          let query = supabase
            .from('products')
            .select('*, product_variants(*), brands(*)')
            .neq('id', productId);

          if (data.category_id) {
            query = query.eq('category_id', data.category_id);
          }

          const { data: simData } = await query.limit(10);
          setSimilarProducts(simData || []);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const productImage = product ? (
    product.image || 
    product.image_url || 
    product.img || 
    (Array.isArray(product.images) ? product.images[0] : product.images) || 
    ''
  ) : '';

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, product.product_variants?.[0]);
    alert('Product added to cart successfully!');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, product.product_variants?.[0]);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white p-8 text-center space-y-4">
        <p className="text-sm text-gray-400">Product not found.</p>
        <button onClick={() => router.push('/')} className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold">
          Back to Shop
        </button>
      </div>
    );
  }

  const productPrice = Number(product.selling_price || product.price || 1499);
  const originalPrice = Number(product.original_price || product.mrp || productPrice * 1.25);

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between">
      <div className="p-6 md:p-12 space-y-8 max-w-4xl mx-auto w-full">
        
        <button
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
        >
          <ArrowLeft size={14} /> Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0d1322] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          
          <div className="bg-[#07090e] border border-gray-800 rounded-2xl p-6 flex items-center justify-center overflow-hidden h-80">
            {productImage ? (
              <img src={productImage} alt={product.title || product.name} className="max-h-full object-contain" />
            ) : (
              <Package size={64} className="text-gray-600" />
            )}
          </div>

          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">
                {product.brands?.name || product.brand || 'TechCart OS Verified'}
              </span>
              <h1 className="text-2xl font-black text-white">{product.title || product.name}</h1>
              
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl font-black text-white">₹{productPrice.toLocaleString('en-IN')}</span>
                {originalPrice > productPrice && (
                  <span className="text-xs text-gray-500 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>

              <p className="text-xs text-gray-400 leading-relaxed pt-2">
                {product.description || 'High performance tech device engineered for professional workflows, immersive gaming, and everyday productivity.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={handleAddToCart}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>

          </div>

        </div>

        {similarProducts.length > 0 && (
          <div className="bg-[#0d1322] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-base font-black text-white">Similar Products</h2>
                <p className="text-xs text-gray-400">More products from the same category</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Added Footer */}
      <footer className="bg-[#111622] text-gray-400 text-xs mt-20 border-t border-gray-800">
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