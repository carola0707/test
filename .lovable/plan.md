

# Beauty Catalogue / Catálogo Digital de Belleza

## Overview
A modern, elegant beauty product recommendation app with search, filtering, favorites, and smart recommendations based on product relationships.

## Design System
- **Palette**: Soft rose (#F8E8EE), warm cream (#FFF5F5), muted gold accents (#C9A96E), charcoal text (#2D2D2D)
- **Typography**: Clean sans-serif (Inter), elegant headings
- **Style**: Feminine, premium, polished with soft shadows, rounded cards, smooth hover transitions

## Pages & Features

### 1. Home Page
- Hero section with beautiful gradient background and centered search bar
- Category quick-links (Skincare, Makeup, Haircare, Fragrance, Body Care, Tools)
- Trending/top-rated products carousel
- "Recommended for You" section (based on favorites)

### 2. Search Results Page
- Smart search that matches queries like "acne prone skin" to relevant product tags/concerns
- Filter sidebar: Gender, Category, Price range, Rating, Brand
- Product grid with cards showing: image, name, brand, price, rating, category, gender tag, heart button, external link button

### 3. Product Detail Page
- Large product image, full description, price, rating
- Key benefits/ingredients list
- External buy link button
- Related/similar products section

### 4. Favorites Page
- Grid of hearted products
- "Based on your favorites" recommendations section

### 5. Recommendations Page
- Products recommended based on liked items using graph-style relationship matching (category, skin concern, brand, price range)

## Data & Recommendation Engine

### Sample Data
- ~40 realistic beauty products across all categories with real-ish names, brands, prices, ratings, images (placeholder), descriptions, ingredients, skin concerns, and external links

### Recommendation Logic (Client-side prototype)
- Graph-like data structure connecting products by: category, skin concerns, ingredients, brand, price range
- When user favorites a product, find related products by shared attributes (weighted scoring)
- Search intent parsing: map common queries to skin concerns/categories
- Structured so it can later plug into Neo4j or similar

### Data Schema (future-ready)
- Products, Categories, SkinConcerns, Ingredients, Brands tables
- UserFavorites with relationship-based recommendation queries
- Ready for Supabase or graph DB migration

## Technical Architecture
- Clean component structure: `/components/product/`, `/components/search/`, `/components/layout/`
- Centralized data layer in `/data/` with typed interfaces
- Recommendation engine in `/lib/recommendations.ts`
- Context for favorites state management
- Fully responsive with mobile-first approach

