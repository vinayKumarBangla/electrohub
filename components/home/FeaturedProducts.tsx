import ProductCard from "./ProductCard";
import { createClient } from "@/lib/supabase/server";

export default async function FeaturedProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(8);

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">
          Featured Products
        </h2>

        <p className="text-red-500">
          Failed to load products.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      <div className="mb-10 flex items-center justify-between">

        <div>
          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>

          <p className="mt-2 text-gray-500">
            Top electronics picked for you
          </p>
        </div>

      </div>

      {products?.length === 0 ? (
        <p className="text-gray-500">
          No products available.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>
      )}

    </section>
  );
}