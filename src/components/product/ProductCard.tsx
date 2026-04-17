/**
 * ProductCard — Apple HIG-inspired product tile with heart, cart, and buy actions.
 * Uses soft shadows, rounded corners, and clear visual hierarchy.
 */
import { Heart, ExternalLink, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { ProductImage } from "./ProductImage";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const liked = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({ title: "Added to cart", description: product.name });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5">
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square overflow-hidden bg-muted"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={`${product.name} by ${product.brand}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.gender !== "unisex" && (
          <Badge variant="secondary" className="absolute left-2.5 top-2.5 text-xs capitalize rounded-full px-2.5">
            {product.gender}
          </Badge>
        )}
      </Link>

      {/* Heart toggle */}
      <button
        onClick={() => toggleFavorite(product)}
        className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm shadow-soft transition-all hover:shadow-elevated active:scale-95"
        aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={liked}
      >
        <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-semibold leading-snug text-foreground hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{product.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-bold text-foreground">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-1" aria-label={`Rating: ${product.rating} out of 5`}>
            <Star className="h-3.5 w-3.5 fill-star text-star" />
            <span className="text-xs font-medium text-muted-foreground">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs flex-1 rounded-full"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
          </Button>
          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Buy ${product.name} externally`}
          >
            <Button variant="outline" size="sm" className="h-8 gap-1 px-2.5 text-xs rounded-full">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
