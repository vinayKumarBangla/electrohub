'use client';

import Link from 'next/link';

const categories = [
  { name: 'Mobiles', slug: 'mobiles', icon: '📱' },
  { name: 'Laptops', slug: 'laptops', icon: '💻' },
  { name: 'Audio', slug: 'audio', icon: '🎧' },
  { name: 'Smartwatches', slug: 'smartwatches', icon: '⌚' },
  { name: 'Televisions', slug: 'televisions', icon: '📺' },
  { name: 'Appliances', slug: 'appliances', icon: '🧺' },
];

export default function CategoryBar() {
  return (
    <div className="bg-white border-b shadow-sm py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-6 no-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="flex flex-col items-center min-w-[70px] group cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform mb-1">{cat.icon}</span>
            <span className="text-xs font-bold text-gray-700 group-hover:text-flipkart-blue transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}