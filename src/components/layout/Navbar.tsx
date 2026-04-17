/**
 * Navbar — main navigation with auth-aware links and cart badge.
 * Apple HIG-inspired: clean, minimal, no emojis.
 */
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, Compass, Home, ShoppingCart, User, LogOut, Shield, Menu } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/search", label: "Explore", icon: Search },
    { to: "/recommendations", label: "For You", icon: Compass },
    { to: "/favorites", label: "Favorites", icon: Heart, badge: favorites.length },
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: itemCount },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-xl border-b" role="banner">
      <nav className="container flex h-14 items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Beauty Compass home">
          <Compass className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Beauty Compass
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map(({ to, label, icon: Icon, badge }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all
                  ${active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {badge != null && badge > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Auth dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-1" aria-label="Account menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/orders">Orders</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/payment-methods">Payment Methods</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2"><Shield className="h-4 w-4" />Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="ml-2 rounded-full px-4">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-1 md:hidden">
          {/* Cart shortcut on mobile */}
          <Link to="/cart" className="relative p-2" aria-label={`Cart, ${itemCount} items`}>
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {itemCount}
              </span>
            )}
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {links.map(({ to, label, icon: Icon, badge }) => {
                  const active = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                        ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        {label}
                      </span>
                      {badge != null && badge > 0 && (
                        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <div className="my-2 h-px bg-border" />
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                      Orders
                    </Link>
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                      <Shield className="h-4 w-4" /> Admin
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-secondary text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-full mt-1">Sign In</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
