/**
 * RecommendationsPage — personalized product picks based on favorites and ratings.
 */
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getRecommendations } from "@/lib/recommendations";
import { products } from "@/data/products";
import { Link } from "react-router-dom";

const RecommendationsPage = () => {
  const { favorites } = useFavorites();
  const recommended = getRecommendations(products, favorites, [], 16);

  return (
    <main className="container py-8">
      <h1 className="mb-2 text-foreground">Recommended for You</h1>
      <p className="mb-8 text-muted-foreground text-sm">
        {favorites.length > 0
          ? "Personalized picks based on your favorites and product relationships."
          : "Our top-rated products. Heart some items to get personalized recommendations."}
      </p>

      <ProductGrid products={recommended} />

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
