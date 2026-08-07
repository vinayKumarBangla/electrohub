"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  sku: string;
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

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        discount_price,
        sku,
        brands(name),
        categories(name),
        inventory(quantity),
        product_images(image_url)
      `)
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts((data ?? []) as unknown as Product[]);
    }
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    const ok = confirm("Delete this product?");

    if (!ok) return;

    await supabase
      .from("inventory")
      .delete()
      .eq("product_id", id);

    await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id);

    await supabase
      .from("products")
      .delete()
      .eq("id", id);

    loadProducts();
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        Loading products...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">

      <table className="w-full">
        <thead className="bg-slate-100">

          <tr>

            <th className="p-4 text-left">Image</th>

            <th className="p-4 text-left">Product</th>

            <th className="p-4 text-left">Brand</th>

            <th className="p-4 text-left">Category</th>

            <th className="p-4 text-left">Price</th>

            <th className="p-4 text-left">Stock</th>

            <th className="p-4 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>
                      {products.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-10 text-center text-slate-500"
              >
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">
                  {product.product_images?.[0]?.image_url ? (
                    <Image
                      src={product.product_images[0].image_url}
                      alt={product.name}
                      width={70}
                      height={70}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[70px] w-[70px] items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">
                      No Image
                    </div>
                  )}
                </td>

                <td className="p-4">
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {product.sku}
                  </p>
                </td>

                <td className="p-4">
                  {product.brands?.name}
                </td>

                <td className="p-4">
                  {product.categories?.name}
                </td>

                <td className="p-4">
                  <div className="font-semibold text-blue-600">
                    ₹
                    {product.discount_price ??
                      product.price}
                  </div>

                  {product.discount_price && (
                    <div className="text-sm text-slate-400 line-through">
                      ₹{product.price}
                    </div>
                  )}
                </td>

                <td className="p-4">
                  {product.inventory?.[0]?.quantity ?? 0}
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-4">

                    <Link
  href={`/dashboard/products/edit/${product.id}`}
  className="text-blue-600 hover:text-blue-800"
>
  <Pencil size={18} />
</Link>

                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}