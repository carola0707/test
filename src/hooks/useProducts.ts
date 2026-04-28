import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProducts } from "@/lib/supabaseProducts";
import type { Product } from "@/types/product";

function dedupeProducts(products: Product[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = `${product.brand}-${product.name}`.toLowerCase().trim();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(dedupeProducts(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].sort(),
    [products]
  );

  return {
    products,
    brands,
    loading,
    error,
    refetch: loadProducts,
  };
}
