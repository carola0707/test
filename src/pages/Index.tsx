/**
 * Index — Home page with inclusive hero carousel, categories, trending, and recommendations.
 * Apple HIG: clean hierarchy, generous whitespace, semantic HTML.
 */
import { Link } from "react-router-dom";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products, categories } from "@/data/products";
import { getRecommendations } from "@/lib/recommendations";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Droplets, Palette, Scissors, Wind, Bath, Wrench } from "lucide-react";

/** Map category ids to Lucide icons instead of emojis */
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

  /* Sort products by rating to get top-rated items for the homepage */
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  /* Generate personalized recommendations based on user's favorites */
  const recommended = getRecommendations(products, favorites, [], 8);

  return (
    <main className="min-h-screen">
      {/* Hero carousel — diverse, inclusive beauty imagery with search */}
      <HeroCarousel />

      {/* Categories — quick navigation to product types */}
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

      {/* Top Rated — highest-rated products displayed dynamically */}
      <section className="container pb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-foreground">Top Rated</h2>
          <Link to="/search" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid products={trending} />
      </section>

      {/* Recommended — only shows when user has favorited products */}
      {favorites.length > 0 && (
        <section className="container pb-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-foreground">Recommended for You</h2>
            <Link to="/recommendations" className="text-sm font-medium text-primary hover:underline">
              See more
            </Link>
          </div>
          <ProductGrid products={recommended} />
        </section>
      )}
    </main>
  );
};

export default Index;
