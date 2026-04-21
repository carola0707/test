import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProducts } from "@/lib/supabaseProducts";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
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
