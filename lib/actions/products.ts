import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Type Interfaces
export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string;
  mrp_price: number;
  selling_price: number;
  stock_quantity: number;
  color?: string;
  storage?: string;
  images?: string[];
}

export interface Brand {
  id: string;
  name: string;
}

export interface ProductWithDetails {
  id: string;
  title: string;
  description?: string;
  specifications?: Record<string, any>;
  brand_id?: string;
  brands?: Brand;
  brand?: Brand;
  product_variants: ProductVariant[];
}

// 1. Fetch Featured Products for Home Page
export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), brands(*)');

    if (error) {
      console.error('Supabase query error:', error.message);
      return [];
    }

    return (data as ProductWithDetails[]) || [];
  } catch (err) {
    console.error('Failed to fetch featured products:', err);
    return [];
  }
}

// 2. Fetch Single Product by ID for Details Page
export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), brands(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch product error:', error.message);
      return null;
    }

    return (data as ProductWithDetails) || null;
  } catch (err) {
    console.error('Failed to fetch product by ID:', err);
    return null;
  }
}