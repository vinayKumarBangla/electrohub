"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Brand = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

export default function AddProductForm() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

 async function loadData() {
  const { data: brandData, error: brandError } = await supabase
    .from("brands")
    .select("*");

  console.log("Brands:", brandData);
  console.log("Brand Error:", brandError);

  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("*");

  console.log("Categories:", categoryData);
  console.log("Category Error:", categoryError);

  if (brandData) {
    setBrands(brandData);
  }

  if (categoryData) {
    setCategories(categoryData);
  }
}

  async function handleSave() {
    if (
      !name ||
      !brandId ||
      !categoryId ||
      !price ||
      !sku ||
      !stock
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-");
          const { data: product, error } = await supabase
      .from("products")
      .insert({
        seller_id: user.id,
        category_id: categoryId,
        brand_id: brandId,
        name,
        slug,
        description,
        price: Number(price),
        discount_price: discountPrice
          ? Number(discountPrice)
          : null,
        sku,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("inventory").insert({
      product_id: product.id,
      quantity: Number(stock),
    });

   if (image) {
  const fileName = `${Date.now()}-${image.name}`;

  const {
    data: uploadData,
    error: uploadError,
  } = await supabase.storage
    .from("product-images")
    .upload(fileName, image);

  console.log("Upload Data:", uploadData);
  console.log("Upload Error:", uploadError);

  if (!uploadError) {
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    console.log("Public URL:", data.publicUrl);

    const { error: imageError } = await supabase
      .from("product_images")
      .insert({
        product_id: product.id,
        image_url: data.publicUrl,
      });

    console.log("Image Insert Error:", imageError);
  }
}
    alert("Product Added Successfully!");

    setName("");
    setDescription("");
    setBrandId("");
    setCategoryId("");
    setPrice("");
    setDiscountPrice("");
    setSku("");
    setStock("");
    setImage(null);

    setLoading(false);
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
            onChange={(e) => setName(e.target.value)}
            placeholder="iPhone 16 Pro"
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
            onChange={(e) => setSku(e.target.value)}
            placeholder="IPH16PRO"
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
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description..."
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>
                <div>
          <label className="mb-2 block font-medium">
            Brand
          </label>

          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
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
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
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
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1000"
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
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="900"
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
            onChange={(e) => setStock(e.target.value)}
            placeholder="50"
            className="w-full rounded-xl border p-3 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
            className="w-full rounded-xl border p-3"
          />
        </div>
                <div className="md:col-span-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>

      </div>
    </div>
  );
}