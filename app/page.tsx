import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const revalidate = 0

export default async function HomePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('products').select('*').order('created_at', { ascending: false })
  ])

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Hero */}
      <section className="bg-white rounded-2xl p-8 md:p-12 shadow-premium border border-dark-100 flex flex-col items-start gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded">
          On-Demand Electronics
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-dark-900">
          Next-Gen Tech, Delivered Fast.
        </h1>
        <p className="text-dark-500 max-w-xl text-sm md:text-base">
          Browse verified gadgets, configure specs, and track local delivery in real time.
        </p>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-dark-900">Categories</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories?.map((cat) => (
            <span key={cat.id} className="px-4 py-2 bg-white border border-dark-100 text-dark-700 text-xs font-semibold rounded-full shadow-subtle whitespace-nowrap">
              {cat.name}
            </span>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-dark-900">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((item) => (
            <div key={item.id} className="bg-white border border-dark-100 rounded-xl overflow-hidden hover:shadow-premium transition-all flex flex-col justify-between p-4 space-y-4">
              <div className="space-y-3">
                <div className="h-40 bg-dark-50 rounded-lg overflow-hidden">
                  <img src={item.images[0] || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-dark-900 text-sm line-clamp-1">{item.title}</h3>
                <p className="text-dark-500 text-xs line-clamp-2">{item.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-dark-100 pt-3">
                <span className="font-bold text-dark-900 text-base">₹{Number(item.price).toLocaleString('en-IN')}</span>
                <Link href={`/products/${item.id}`} className="bg-brand-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-brand-600">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}