"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;

  brands: {
    name: string;
  } | null;

  categories: {
    name: string;
  } | null;

  product_images: {
    image_url: string;
  }[] | null;
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        price,
        discount_price,
        brands(name),
        categories(name),
        product_images(image_url)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
  setProducts(data as unknown as Product[]);
}
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xl">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-xl">
        No products available.
      </div>
    );
  }

  return (
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

    {products.map((product) => (
      <div
        key={product.id}
        className="overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
      >

        <div className="relative h-60 w-full bg-slate-100">

          {product.product_images?.[0]?.image_url ? (
            <Image
              src={product.product_images[0].image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No Image
            </div>
          )}

        </div>

        <div className="space-y-3 p-5">

          <div className="text-sm text-slate-500">
            {product.brands?.name}
          </div>

          <h2 className="line-clamp-2 text-xl font-semibold">
            {product.name}
          </h2>

          <div className="text-sm text-slate-500">
            {product.categories?.name}
          </div>

          <div className="flex items-center gap-3">

            <span className="text-2xl font-bold text-blue-600">
              ₹{product.discount_price ?? product.price}
            </span>

            {product.discount_price && (
              <span className="text-slate-400 line-through">
                ₹{product.price}
              </span>
            )}

          </div>

          <div className="flex gap-3">

            <Link href={`/dashboard/products/${product.slug}`}
              className="flex-1 rounded-xl border border-blue-600 py-3 text-center font-semibold text-blue-600 hover:bg-blue-50"
            >
              View Details
            </Link>

            <button className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
              Add to Cart
            </button>

          </div>

        </div>

      </div>
    ))}

  </div>
);
}