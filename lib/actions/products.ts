import { createClient } from "../supabase/server";

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brands(name),
      categories(name),
      product_images(image_url),
      inventory(quantity)
    `)
    .eq("is_active", true);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}