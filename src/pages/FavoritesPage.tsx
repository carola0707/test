/**
 * FavoritesPage — user's liked products with recommendations based on them.
 * Includes Back to Profile navigation for easy account access.
 */
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getRecommendations } from "@/lib/recommendations";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { BackToProfile } from "@/components/ui/BackToProfile";

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  /* Generate recommendations based on favorited products */
  const recommended = getRecommendations(products, favorites, favorites.map((f) => f.id), 8);

  return (
    <main className="container py-8">
      <BackToProfile />
      <h1 className="mb-2 text-foreground">Your Favorites</h1>
      <p className="mb-8 text-muted-foreground text-sm">
        {favorites.length === 0
          ? "You haven't favorited any products yet. Start exploring!"
          : `${favorites.length} product${favorites.length !== 1 ? "s" : ""} saved`}
      </p>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <Heart className="h-12 w-12 mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Heart products to save them here and get personalized recommendations.</p>
          <Link to="/search" className="text-primary font-medium hover:underline">Browse products</Link>
        </div>
      ) : (
        <>
          <ProductGrid products={favorites} />
          {recommended.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 text-foreground">Based on Your Favorites</h2>
              <ProductGrid products={recommended} />
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default FavoritesPage;
