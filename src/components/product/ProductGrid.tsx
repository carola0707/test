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

export function ProductGrid({ products, emptyMessage = "No products found." }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
        <Search className="h-10 w-10 mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4" role="list">
      {products.map((product, i) => (
        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
