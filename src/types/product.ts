export type Category = "skincare" | "makeup" | "haircare" | "fragrance" | "bodycare" | "tools";
export type Gender = "unisex" | "female" | "male";
export type SkinConcern = "acne" | "dryness" | "oiliness" | "aging" | "dark-spots" | "sensitivity" | "dullness" | "pores" | "redness" | "hydration";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  fullDescription: string;
  category: Category;
  gender: Gender;
  skinConcerns: SkinConcern[];
  ingredients: string[];
  benefits: string[];
  externalUrl: string;
}
