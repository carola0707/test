/**
 * RecommendationsPage — personalized product picks based on favorites and ratings.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getRecommendations } from "@/lib/recommendations";
import { useProducts } from "@/hooks/useProducts";

const RecommendationsPage = () => {
  const { favorites } = useFavorites();
  const { products, loading, error } = useProducts();
  const recommended = useMemo(
    () => getRecommendations(products, favorites, [], 16),
    [products, favorites]
  );

  return (
    <main className="container py-8">
      <h1 className="mb-2 text-foreground">Recommended for You</h1>
      <p className="mb-8 text-muted-foreground text-sm">
        {favorites.length > 0
          ? "Personalized picks based on your favorites and product relationships."
          : "Our top-rated products. Heart some items to get personalized recommendations."}
      </p>

      {error ? (
        <div className="py-16 text-center text-muted-foreground">We couldn&apos;t load recommendations right now.</div>
      ) : loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading recommendations...</div>
      ) : (
        <ProductGrid products={recommended} />
      )}

      {favorites.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-3">Want better recommendations?</p>
          <Link to="/search" className="text-primary font-medium hover:underline">
            Browse and favorite products
          </Link>
        </div>
      )}
    </main>
  );
};

export default RecommendationsPage;
