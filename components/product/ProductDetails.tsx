"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;

  brands: {
    name: string;
  } | null;

  categories: {
    name: string;
  } | null;

  inventory: {
    quantity: number;
  }[] | null;

  product_images: {
    image_url: string;
  }[] | null;
};

export default function ProductDetails({
  slug,
}: Props) {
  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        brands(name),
        categories(name),
        inventory(quantity),
        product_images(image_url)
      `)
      .eq("slug", slug)
      .single();

    if (!error && data) {
      setProduct(data as unknown as Product);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xl">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl bg-white p-6 shadow">

        <div className="relative h-[500px] w-full">

          {product.product_images?.[0]?.image_url ? (
            <Image
              src={product.product_images[0].image_url}
              alt={product.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No Image
            </div>
          )}

        </div>

      </div>

      <div className="rounded-2xl bg-white p-8 shadow">

        <div className="mb-3 text-sm text-slate-500">
          {product.brands?.name}
        </div>

        <h1 className="text-4xl font-bold">
          {product.name}
        </h1>

        <div className="mt-2 text-slate-500">
          {product.categories?.name}
        </div>

        <div className="mt-8 flex items-center gap-4">

          <span className="text-4xl font-bold text-blue-600">
            ₹{product.discount_price ?? product.price}
          </span>

          {product.discount_price && (
            <span className="text-2xl text-slate-400 line-through">
              ₹{product.price}
            </span>
          )}

        </div>

        <div className="mt-6">

          <span
            className={
              product.inventory?.[0]?.quantity
                ? "rounded-full bg-green-100 px-4 py-2 text-green-700"
                : "rounded-full bg-red-100 px-4 py-2 text-red-700"
            }
          >
            {product.inventory?.[0]?.quantity
              ? "In Stock"
              : "Out of Stock"}
          </span>

        </div>

        <div className="mt-8">

          <h2 className="mb-3 text-xl font-semibold">
            Description
          </h2>

          <p className="leading-7 text-slate-600">
            {product.description || "No description available."}
          </p>

        </div>
                <div className="mt-10 flex gap-4">

          <button
            className="flex-1 rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            Add to Cart
          </button>

          <button
            className="flex-1 rounded-xl border border-blue-600 py-4 text-lg font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}

