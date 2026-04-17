/**
 * CartPage — shopping cart with quantity controls and checkout link.
 * Includes Back to Profile navigation for easy account access.
 */
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { BackToProfile } from "@/components/ui/BackToProfile";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  /* Empty state — friendly message with link to browse products */
  if (items.length === 0) {
    return (
      <main className="container py-8">
        <BackToProfile />
        <div className="text-center py-12">
          <ShoppingBag className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
          <h1 className="mb-2 text-foreground">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6 text-sm">Add some products to get started.</p>
          <Link to="/search"><Button className="rounded-full px-6">Browse Products</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8 max-w-3xl">
      <BackToProfile />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-foreground">Shopping Cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive rounded-full">
          Clear All
        </Button>
      </div>

      {/* Cart items list with quantity controls */}
      <div className="space-y-3">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-4 rounded-2xl bg-card p-4 shadow-soft">
            <img
              src={product.image}
              alt={`${product.name} by ${product.brand}`}
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase text-muted-foreground tracking-wide">{product.brand}</p>
              <Link to={`/product/${product.id}`} className="font-semibold text-foreground hover:text-primary line-clamp-1 text-sm">
                {product.name}
              </Link>
              <p className="text-sm font-bold mt-1">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => removeFromCart(product.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                aria-label={`Remove ${product.name} from cart`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-2 py-1">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="p-1 hover:text-primary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="p-1 hover:text-primary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="text-sm font-semibold">${(product.price * quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary with checkout button */}
      <div className="mt-8 rounded-2xl bg-card p-6 shadow-soft">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Link to="/checkout">
          <Button className="w-full rounded-full h-12 text-base" size="lg">Proceed to Checkout</Button>
        </Link>
      </div>
    </main>
  );
};

export default CartPage;
