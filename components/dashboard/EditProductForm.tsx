"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  productId: string;
};

type Brand = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

export default function EditProductForm({
  productId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] =
    useState("");

  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: brandsData } = await supabase
      .from("brands")
      .select("*")
      .order("name");

    if (brandsData) {
      setBrands(brandsData);
    }

    const { data: categoriesData } =
      await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (categoriesData) {
      setCategories(categoriesData);
    }

    const { data: product, error } =
      await supabase
        .from("products")
        .select(
          `
          *,
          inventory(quantity)
        `
        )
        .eq("id", productId)
        .single();

    if (error || !product) {
      alert("Product not found");
      return;
    }

    setName(product.name);
    setDescription(product.description || "");

    setBrandId(product.brand_id);
    setCategoryId(product.category_id);

    setPrice(product.price.toString());

    setDiscountPrice(
      product.discount_price
        ? product.discount_price.toString()
        : ""
    );

    setSku(product.sku);

    setStock(
      product.inventory?.[0]?.quantity?.toString() ||
        "0"
    );
  }

  async function handleUpdate() {
    if (
      !name ||
      !brandId ||
      !categoryId ||
      !price ||
      !sku
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-");
          const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        brand_id: brandId,
        category_id: categoryId,
        price: Number(price),
        discount_price: discountPrice
          ? Number(discountPrice)
          : null,
        sku,
        slug,
      })
      .eq("id", productId);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase
      .from("inventory")
      .update({
        quantity: Number(stock),
      })
      .eq("product_id", productId);

    alert("Product Updated Successfully!");

    setLoading(false);

    router.push("/dashboard/products");
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Product Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            SKU
          </label>

          <input
            type="text"
            value={sku}
            onChange={(e) =>
              setSku(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Brand
          </label>

          <select
            value={brandId}
            onChange={(e) =>
              setBrandId(e.target.value)
            }
            className="w-full rounded-xl border p-3"
          >
            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            className="w-full rounded-xl border p-3"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
                <div>
          <label className="mb-2 block font-medium">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Discount Price
          </label>

          <input
            type="number"
            value={discountPrice}
            onChange={(e) =>
              setDiscountPrice(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Stock
          </label>

          <input
            type="number"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            {loading
              ? "Updating..."
              : "Update Product"}
          </button>
        </div>

      </div>
    </div>
  );
}