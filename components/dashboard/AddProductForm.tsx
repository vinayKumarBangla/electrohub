'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

const CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Audio',
  'Smartwatches',
  'Gaming',
  'Accessories',
  'Components',
];

export default function AddProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    price: '',
    description: '',
    image_url: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!formData.title || !formData.price) {
      setErrorMsg('Please fill in required fields (Title and Price).');
      setLoading(false);
      return;
    }

    // Generate a clean URL slug from the title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const productPayload = {
      title: formData.title,
      name: formData.title, // Backup field for legacy schema support
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      image_url: formData.image_url,
      images: formData.image_url ? [formData.image_url] : [],
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
    };

    const { error } = await supabase.from('products').insert([productPayload]);

    if (error) {
      console.error('Error inserting product:', error);
      setErrorMsg(error.message || 'Failed to create product.');
      setLoading(false);
      return;
    }

    router.push('/dashboard/products');
    router.refresh();
  };

  const previewImage =
    formData.image_url ||
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Vendor Management
            </span>
            <h1 className="text-3xl font-bold text-white mt-1">List New Product</h1>
            <p className="text-xs text-slate-400 mt-1">
              Add a new product to the ElectroHub catalog.
            </p>
          </div>
          <Link
            href="/dashboard/products"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors inline-block text-center"
          >
            &larr; Back to Inventory
          </Link>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Price ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="299.99"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Highlight key specs, features, and condition..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing Item...' : 'Publish Product to Store'}
            </button>
          </form>

          {/* Live Card Preview */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 block">
              Live Card Preview
            </span>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4 space-y-4">
              <div className="aspect-square bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800/80">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {formData.category}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 text-sm line-clamp-1">
                  {formData.title || 'Product Title Preview'}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 mt-1">
                  {formData.description || 'Description snippet will display here...'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                    Price
                  </span>
                  <span className="text-base font-bold text-white">
                    ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  Preview
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}