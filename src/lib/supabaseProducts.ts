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

function normalizeProductValue(value?: string | number | null) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function dedupeProducts(products: Product[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = [
      product.brand,
      product.name,
      product.description,
      product.price,
    ]
      .map(normalizeProductValue)
      .join("-");

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return dedupeProducts((data ?? []).map(mapDbProduct));
}
