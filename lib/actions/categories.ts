import { createClient } from "../supabase/server";

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}