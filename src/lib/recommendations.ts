import { Product, SkinConcern, Category } from "@/types/product";

const searchIntentMap: Record<string, { concerns: SkinConcern[]; categories: Category[] }> = {
  "acne": { concerns: ["acne"], categories: ["skincare"] },
  "acne prone": { concerns: ["acne", "oiliness"], categories: ["skincare"] },
  "acne prone skin": { concerns: ["acne", "oiliness", "pores"], categories: ["skincare"] },
  "dry skin": { concerns: ["dryness", "hydration"], categories: ["skincare", "bodycare"] },
  "oily skin": { concerns: ["oiliness", "pores"], categories: ["skincare", "makeup"] },
  "sensitive skin": { concerns: ["sensitivity", "redness"], categories: ["skincare"] },
  "anti aging": { concerns: ["aging", "dullness"], categories: ["skincare", "tools"] },
  "anti-aging": { concerns: ["aging", "dullness"], categories: ["skincare", "tools"] },
  "dark spots": { concerns: ["dark-spots", "dullness"], categories: ["skincare"] },
  "hyperpigmentation": { concerns: ["dark-spots", "dullness"], categories: ["skincare"] },
  "wrinkles": { concerns: ["aging"], categories: ["skincare"] },
  "moisturizer": { concerns: ["dryness", "hydration"], categories: ["skincare", "bodycare"] },
  "hydration": { concerns: ["hydration", "dryness"], categories: ["skincare", "bodycare"] },
  "redness": { concerns: ["redness", "sensitivity"], categories: ["skincare"] },
  "pores": { concerns: ["pores", "oiliness"], categories: ["skincare", "tools"] },
  "foundation": { concerns: ["oiliness", "dullness"], categories: ["makeup"] },
  "lipstick": { concerns: [], categories: ["makeup"] },
  "mascara": { concerns: [], categories: ["makeup"] },
  "hair": { concerns: [], categories: ["haircare", "tools"] },
  "fragrance": { concerns: [], categories: ["fragrance"] },
  "perfume": { concerns: [], categories: ["fragrance"] },
  "body": { concerns: ["dryness", "hydration"], categories: ["bodycare"] },
};

export function parseSearchIntent(query: string): { concerns: SkinConcern[]; categories: Category[] } {
  const lower = query.toLowerCase().trim();
  
  // Try exact match first
  if (searchIntentMap[lower]) return searchIntentMap[lower];
  
  // Try partial matches
  const concerns: Set<SkinConcern> = new Set();
  const cats: Set<Category> = new Set();
  
  for (const [key, value] of Object.entries(searchIntentMap)) {
    if (lower.includes(key) || key.includes(lower)) {
      value.concerns.forEach((c) => concerns.add(c));
      value.categories.forEach((c) => cats.add(c));
    }
  }
  
  return { concerns: [...concerns], categories: [...cats] };
}

export function searchProducts(products: Product[], query: string): Product[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return products;

  const intent = parseSearchIntent(lower);
  
  const scored = products.map((product) => {
    let score = 0;
    
    // Direct text matches
    if (product.name.toLowerCase().includes(lower)) score += 10;
    if (product.brand.toLowerCase().includes(lower)) score += 8;
    if (product.description.toLowerCase().includes(lower)) score += 5;
    if (product.category.toLowerCase().includes(lower)) score += 6;
    
    // Intent-based matching
    for (const concern of intent.concerns) {
      if (product.skinConcerns.includes(concern)) score += 4;
    }
    for (const cat of intent.categories) {
      if (product.category === cat) score += 3;
    }
    
    // Ingredient/benefit matches
    for (const ing of product.ingredients) {
      if (ing.toLowerCase().includes(lower) || lower.includes(ing.toLowerCase())) score += 3;
    }
    
    // Boost highly rated products
    if (score > 0) score += product.rating;
    
    return { product, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);
}

export function getRecommendations(
  products: Product[],
  likedProducts: Product[],
  excludeIds: string[] = [],
  limit = 12
): Product[] {
  if (likedProducts.length === 0) {
    // Return top-rated products
    return products
      .filter((p) => !excludeIds.includes(p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  const scored = products
    .filter((p) => !excludeIds.includes(p.id) && !likedProducts.find((l) => l.id === p.id))
    .map((product) => {
      let score = 0;

      for (const liked of likedProducts) {
        // Same category
        if (product.category === liked.category) score += 3;
        // Same brand
        if (product.brand === liked.brand) score += 2;
        // Shared skin concerns
        const sharedConcerns = product.skinConcerns.filter((c) => liked.skinConcerns.includes(c));
        score += sharedConcerns.length * 4;
        // Shared ingredients
        const sharedIngredients = product.ingredients.filter((i) =>
          liked.ingredients.some((li) => li.toLowerCase() === i.toLowerCase())
        );
        score += sharedIngredients.length * 2;
        // Similar price range (within 30%)
        const priceDiff = Math.abs(product.price - liked.price) / liked.price;
        if (priceDiff < 0.3) score += 1;
      }

      score += product.rating * 0.5;

      return { product, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);
}

export function getSimilarProducts(products: Product[], product: Product, limit = 6): Product[] {
  return getRecommendations(products, [product], [product.id], limit);
}
