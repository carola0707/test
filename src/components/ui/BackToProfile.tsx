/**
 * BackToProfile — Consistent "Back to Profile" navigation link.
 * Used on sub-pages like Favorites, Orders, Payment Methods, Cart.
 */
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackToProfile() {
  return (
    <Link
      to="/profile"
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="h-4 w-4" /> Back to Profile
    </Link>
  );
}
