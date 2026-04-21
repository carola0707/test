/**
 * Index — Home page with inclusive hero carousel, categories, trending, and recommendations.
 * Apple HIG: clean hierarchy, generous whitespace, semantic HTML.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categories } from "@/data/productMeta";
import { getRecommendations } from "@/lib/recommendations";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/hooks/useProducts";
import { Droplets, Palette, Scissors, Wind, Bath, Wrench } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  skincare: <Droplets className="h-5 w-5" />,
  makeup: <Palette className="h-5 w-5" />,
  haircare: <Scissors className="h-5 w-5" />,
  fragrance: <Wind className="h-5 w-5" />,
  bodycare: <Bath className="h-5 w-5" />,
  tools: <Wrench className="h-5 w-5" />,
};

const Index = () => {
  const { favorites } = useFavorites();
  const { products, loading, error } = useProducts();

  const trending = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [products]
  );

  const recommended = useMemo(
    () => getRecommendations(products, favorites, [], 8),
    [products, favorites]
  );

  return (
    <main className="min-h-screen">
      <HeroCarousel />

      <section className="container py-10">
        <h2 className="mb-5 text-foreground">Browse Categories</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/search?category=${cat.id}`}
              className="flex flex-col items-center gap-2.5 rounded-2xl bg-card p-5 shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5 active:scale-[0.98]"
              aria-label={`Browse ${cat.label}`}
            >
              <span className="text-primary">{categoryIcons[cat.id]}</span>
              <span className="text-xs font-medium text-foreground">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-foreground">Top Rated</h2>
          <Link to="/search" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {error ? (
          <div className="py-12 text-center text-muted-foreground">We couldn&apos;t load products right now.</div>
        ) : loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading products...</div>
        ) : (
          <ProductGrid products={trending} />
        )}
      </section>

      {favorites.length > 0 && (
        <section className="container pb-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-foreground">Recommended for You</h2>
            <Link to="/recommendations" className="text-sm font-medium text-primary hover:underline">
              See more
            </Link>
          </div>
          {error ? (
            <div className="py-12 text-center text-muted-foreground">We couldn&apos;t load recommendations right now.</div>
          ) : loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading recommendations...</div>
          ) : (
            <ProductGrid products={recommended} />
          )}
        </section>
      )}
    </main>
  );
};

export default Index;
