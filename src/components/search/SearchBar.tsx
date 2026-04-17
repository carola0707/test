/**
 * SearchBar — Apple-style rounded search input.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  large?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({ initialQuery = "", large = false, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" role="search" aria-label="Search products">
      <div className={`relative ${large ? "text-base" : ""}`}>
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${large ? "h-5 w-5" : "h-4 w-4"}`}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, concerns, brands..."
          aria-label="Search products"
          className={`w-full rounded-full bg-card pl-12 pr-4 shadow-soft border border-border/50 
            text-foreground placeholder:text-muted-foreground
            transition-shadow focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-primary/30
            ${large ? "h-14 text-base" : "h-10 text-sm"}`}
        />
      </div>
    </form>
  );
}
