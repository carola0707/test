/**
 * SearchPage — browse and filter products with sidebar and mobile sheet.
 */
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterPanel, Filters, defaultFilters, applyFilters } from "@/components/search/FilterPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts } from "@/lib/recommendations";
import { Category } from "@/types/product";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProducts } from "@/hooks/useProducts";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") as Category | null;
  const { products, brands, loading, error } = useProducts();

  const [filters, setFilters] = useState<Filters>(() => ({
    ...defaultFilters,
    categories: categoryParam ? [categoryParam] : [],
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const searched = query ? searchProducts(products, query) : products;
    return applyFilters(searched, filters);
  }, [query, filters, products]);

  const handleSearch = (q: string) => {
    setSearchParams({ q });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.genders.length +
    filters.selectedBrands.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 600 ? 1 : 0);

  return (
    <main className="container py-8">
      <div className="mb-8">
        <SearchBar initialQuery={query} onSearch={handleSearch} />
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-20 rounded-2xl bg-card p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Filters</h2>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setFilters(defaultFilters)} className="h-7 text-xs rounded-full">
                  Clear all
                </Button>
              )}
            </div>
            <FilterPanel filters={filters} onChange={setFilters} brands={brands} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading products..." : `${results.length} product${results.length !== 1 ? "s" : ""}`}
              {query && <> for &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;</>}
            </p>

            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterPanel filters={filters} onChange={setFilters} brands={brands} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {error ? (
            <div className="py-16 text-center text-muted-foreground">We couldn&apos;t load products right now.</div>
          ) : loading ? (
            <div className="py-16 text-center text-muted-foreground">Loading products...</div>
          ) : (
            <ProductGrid products={results} emptyMessage="No products match your search. Try different keywords or adjust filters." />
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
