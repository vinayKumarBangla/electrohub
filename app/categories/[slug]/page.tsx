import ProductCard from '@/components/home/ProductCard';
import { supabase } from '@/lib/actions/products';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

const CATEGORY_RULES: Record<string, string[]> = {
  mobiles: ['mobile', 'mobiles', 'phone', 'phones', 'smartphone', 'smartphones', 'iphone', 'galaxy', 'vivo', 'oppo', 'nothing', 'xperia', 'motorola', 'realme', 'oneplus', 'xiaomi', 'redmi'],
  laptops: ['laptop', 'laptops', 'macbook', 'notebook', 'computer', 'tab', 'tablet'],
  audio: ['audio', 'headphone', 'headphones', 'earbud', 'earbuds', 'earphones', 'speaker', 'speakers', 'soundbar', 'sony', 'tws'],
  smartwatches: ['smartwatch', 'smartwatches', 'watch', 'watches'],
  televisions: ['tv', 'tvs', 'television', 'televisions', 'lg', 'tcl', 'toshiba', 'smart tv'],
  appliances: ['appliance', 'appliances', 'refrigerator', 'fridge', 'washing', 'grinder', 'iron', 'stove'],
};

// Words to forbid from leaking into Mobiles
const MOBILE_EXCLUSIONS = ['headphone', 'headphones', 'earbud', 'earbuds', 'earphone', 'speaker', 'laptop', 'macbook', 'tv', 'television', 'watch', 'refrigerator', 'washing'];

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const currentSlug = slug.toLowerCase().trim();
  const keywords = CATEGORY_RULES[currentSlug] || [currentSlug];

  let rawProducts: any[] = [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*), product_variants(*), brands(*)');

    if (!error && data) {
      rawProducts = data;
    }
  } catch (err) {
    console.error('Error fetching category products:', err);
  }

  // Strict Filtering by category slug
  const filteredProducts = rawProducts.filter((product) => {
    const catRel = product.categories || product.category;
    const catName = (typeof catRel === 'object' ? catRel?.name || catRel?.slug || '' : String(catRel || '')).toLowerCase().trim();
    const title = String(product.title || product.name || '').toLowerCase();

    if (currentSlug === 'mobiles') {
      const hasExcluded = MOBILE_EXCLUSIONS.some((ex) => title.includes(ex) || catName.includes(ex));
      if (hasExcluded) return false;
      return keywords.some((kw) => title.includes(kw) || catName.includes(kw));
    }

    const matchesCategory = keywords.some((kw) => catName.includes(kw) || title.includes(kw));
    return matchesCategory;
  });

  return (
    <div className="bg-[#0b0f19] text-white min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold capitalize text-white">{slug} Catalogue</h1>
            <p className="text-xs text-gray-400 mt-1">
              Showing <strong className="text-blue-400 font-bold">{filteredProducts.length}</strong> items strictly in{' '}
              <span className="capitalize font-semibold text-white">{slug}</span>
            </p>
          </div>
          <Link
            href="/"
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded-md transition"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-[#111827] border border-gray-800 rounded-lg p-12 text-center my-8">
            <p className="text-gray-400 text-sm font-medium">
              No products found strictly in the <span className="text-white font-bold capitalize">"{slug}"</span> category.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-md transition"
            >
              Explore All Items
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}