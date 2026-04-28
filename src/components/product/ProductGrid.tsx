/**
 * ProductGrid — responsive grid layout for product cards.
 */
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Search } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

function normalizeProductText(value?: string) {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

function uniqueProducts(products: Product[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    const brand = normalizeProductText(product.brand);
    const name = normalizeProductText(product.name);
    const description = normalizeProductText(product.description);
    const price = Number(product.price).toFixed(2);
    const key = `${brand}-${name}-${description}-${price}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function ProductGrid({ products, emptyMessage = "No products found." }: ProductGridProps) {
  const displayProducts = uniqueProducts(products);

  if (displayProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
        <Search className="h-10 w-10 mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4" role="list">
      {displayProducts.map((product, i) => (
        <div key={`${product.brand}-${product.name}-${product.id}`} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
