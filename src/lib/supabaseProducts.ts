import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Product } from "@/types/product";

type DBProduct = Tables<"products">;

export function mapDbProduct(row: DBProduct): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    rating: Number(row.rating),
    image: row.image_url || "",
    description: row.description || "",
    fullDescription: row.full_description || "",
    category: row.category as Product["category"],
    gender: row.gender as Product["gender"],
    skinConcerns: (row.skin_concerns ?? []) as Product["skinConcerns"],
    ingredients: row.ingredients ?? [],
    benefits: row.benefits ?? [],
    externalUrl: row.external_url || "",
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapDbProduct);
}
