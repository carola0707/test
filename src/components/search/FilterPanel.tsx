/**
 * FilterPanel — sidebar filters for search page.
 * Apple HIG: clear labels, accessible checkboxes, smooth sliders.
 */
import { Category, Gender } from "@/types/product";
import { brands } from "@/data/products";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export interface Filters {
  categories: Category[];
  genders: Gender[];
  priceRange: [number, number];
  minRating: number;
  selectedBrands: string[];
}

export const defaultFilters: Filters = {
  categories: [],
  genders: [],
  priceRange: [0, 600],
  minRating: 0,
  selectedBrands: [],
};

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const categoryOptions: { id: Category; label: string }[] = [
  { id: "skincare", label: "Skincare" },
  { id: "makeup", label: "Makeup" },
  { id: "haircare", label: "Haircare" },
  { id: "fragrance", label: "Fragrance" },
  { id: "bodycare", label: "Body Care" },
  { id: "tools", label: "Tools" },
];

const genderOptions: { id: Gender; label: string }[] = [
  { id: "unisex", label: "Unisex" },
  { id: "female", label: "Women" },
  { id: "male", label: "Men" },
];

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const toggleCategory = (cat: Category) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: cats });
  };

  const toggleGender = (g: Gender) => {
    const genders = filters.genders.includes(g)
      ? filters.genders.filter((x) => x !== g)
      : [...filters.genders, g];
    onChange({ ...filters, genders });
  };

  const toggleBrand = (brand: string) => {
    const selectedBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand];
    onChange({ ...filters, selectedBrands });
  };

  return (
    <div className="space-y-6" role="group" aria-label="Product filters">
      {/* Category */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-2">Category</legend>
        <div className="space-y-2">
          {categoryOptions.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer py-0.5">
              <Checkbox
                checked={filters.categories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
                aria-label={cat.label}
              />
              <span className="text-sm text-foreground">{cat.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="h-px bg-border" />

      {/* Gender */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-2">Gender</legend>
        <div className="space-y-2">
          {genderOptions.map((g) => (
            <label key={g.id} className="flex items-center gap-2.5 cursor-pointer py-0.5">
              <Checkbox
                checked={filters.genders.includes(g.id)}
                onCheckedChange={() => toggleGender(g.id)}
                aria-label={g.label}
              />
              <span className="text-sm text-foreground">{g.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="h-px bg-border" />

      {/* Price */}
      <div>
        <Label className="text-sm font-semibold text-foreground">
          Price: ${filters.priceRange[0]} — ${filters.priceRange[1]}
        </Label>
        <Slider
          className="mt-3"
          min={0}
          max={600}
          step={5}
          value={filters.priceRange}
          onValueChange={(v) => onChange({ ...filters, priceRange: v as [number, number] })}
          aria-label="Price range"
        />
      </div>

      <div className="h-px bg-border" />

      {/* Rating */}
      <div>
        <Label className="text-sm font-semibold text-foreground">
          Min Rating: {filters.minRating.toFixed(1)}+
        </Label>
        <Slider
          className="mt-3"
          min={0}
          max={5}
          step={0.1}
          value={[filters.minRating]}
          onValueChange={(v) => onChange({ ...filters, minRating: v[0] })}
          aria-label="Minimum rating"
        />
      </div>

      <div className="h-px bg-border" />

      {/* Brand */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-2">Brand</legend>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer py-0.5">
              <Checkbox
                checked={filters.selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                aria-label={brand}
              />
              <span className="text-sm text-foreground">{brand}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function applyFilters(products: import("@/types/product").Product[], filters: Filters) {
  return products.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
    if (filters.genders.length > 0 && !filters.genders.includes(p.gender)) return false;
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(p.brand)) return false;
    return true;
  });
}
