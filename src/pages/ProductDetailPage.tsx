/**
 * ProductDetailPage — full product view with image, details, actions, and related products.
 */
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { getSimilarProducts } from "@/lib/recommendations";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, Star, ArrowLeft, ShoppingCart } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { useToast } from "@/hooks/use-toast";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="container flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Product not found.</p>
        <Link to="/" className="mt-4 text-primary hover:underline">Back to home</Link>
      </div>
    );
  }

  const liked = isFavorite(product.id);
  const similar = getSimilarProducts(products, product, 4);

  const handleAddToCart = () => {
    addToCart(product);
    toast({ title: "Added to cart", description: product.name });
  };

  return (
    <main className="container py-8">
      <Link
        to="/search"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Product image */}
        <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
          <ProductImage
            src={product.image}
            alt={`${product.name} by ${product.brand}`}
            className="h-full w-full object-cover aspect-square"
            loading="eager"
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1 text-foreground">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-1 rounded-full bg-card px-3 py-1 shadow-soft" aria-label={`Rating: ${product.rating}`}>
              <Star className="h-4 w-4 fill-star text-star" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize rounded-full">{product.category}</Badge>
            {product.gender !== "unisex" && (
              <Badge variant="secondary" className="capitalize rounded-full">{product.gender}</Badge>
            )}
            {product.skinConcerns.map((c) => (
              <Badge key={c} className="capitalize bg-primary/10 text-primary border-0 rounded-full">
                {c.replace("-", " ")}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.fullDescription}</p>

          {product.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Benefits</h3>
              <ul className="space-y-1.5">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Key Ingredients</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((i) => (
                  <Badge key={i} variant="outline" className="text-xs rounded-full">{i}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleAddToCart} className="flex-1 gap-2 rounded-full h-11">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 rounded-full h-11">
                <ExternalLink className="h-4 w-4" /> Buy Now
              </Button>
            </a>
            <Button
              variant={liked ? "default" : "outline"}
              size="icon"
              className="rounded-full h-11 w-11"
              onClick={() => toggleFavorite(product)}
              aria-label={liked ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={liked}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-foreground">You Might Also Like</h2>
          <ProductGrid products={similar} />
        </section>
      )}
    </main>
  );
};

export default ProductDetailPage;
