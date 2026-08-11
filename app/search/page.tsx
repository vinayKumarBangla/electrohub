'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Expanded product catalog including mobile brands like Oppo, Samsung, etc.
  const allProducts = [
    { id: 1, name: 'Oppo Reno 10 Pro 5G', category: 'Mobile', price: '$499', image: '📱' },
    { id: 2, name: 'Oppo F23 5G Smartphone', category: 'Mobile', price: '$299', image: '📱' },
    { id: 3, name: 'Smartphone Pro Max', category: 'Mobile', price: '$999', image: '📱' },
    { id: 4, name: 'Wireless Bluetooth Earbuds', category: 'Audio', price: '$79', image: '🎧' },
    { id: 5, name: 'Admin Dashboard Control Panel', category: 'Software', price: '$0', image: '💻' },
    { id: 6, name: '4K Ultra HD Smart TV', category: 'Electronics', price: '$499', image: '📺' },
  ];

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-white">
        Search Results for: <span className="text-blue-400">"{query}"</span>
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        Found {filteredProducts.length} matching result(s)
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-[#131822] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 bg-[#0a0e17] p-4 rounded-lg inline-block">
                  {product.image}
                </div>
                <span className="text-xs bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-full font-semibold">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold mt-2 text-white">{product.name}</h3>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-black text-slate-200">{product.price}</span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                  <ShoppingCart size={14} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#131822] border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 mb-4">No products found matching your search.</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-8">
      <Suspense fallback={<div className="text-center text-slate-400 mt-10">Loading search results...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}