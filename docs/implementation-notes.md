# Implementation Notes — Beauty Compass

## Project Overview

Beauty Compass is a dynamic web application / digital beauty catalog built with React, TypeScript, and Tailwind CSS. It features product browsing, search, filtering, user accounts, favorites, cart, and an admin product management system.

---

## Database Design

### Tables (Relational Schema)

The project uses **8 related tables** with proper primary keys and foreign key relationships:

1. **profiles** — User profile data (linked to auth.users)
   - `id` (PK), `user_id` (FK → auth.users), `first_name`, `last_name`, `email`, `phone`, `skin_type`, `hair_type`, `beauty_concerns`, `gender_preference`

2. **products** — Product catalog
   - `id` (PK), `name`, `brand`, `price`, `rating`, `category`, `gender`, `image_url`, `description`, `full_description`, `skin_concerns`, `ingredients`, `benefits`, `external_url`, `stock_quantity`, `is_featured`
   - DB constraints: price > 0, stock >= 0, rating 0–5, name/brand not empty

3. **favorites** — User's favorited products
   - `id` (PK), `user_id` (FK → auth.users), `product_id` (FK → products)

4. **carts** — Shopping carts per user
   - `id` (PK), `user_id` (FK → auth.users)

5. **cart_items** — Items in a cart
   - `id` (PK), `cart_id` (FK → carts), `product_id` (FK → products), `quantity`

6. **orders** — Purchase orders
   - `id` (PK), `user_id` (FK → auth.users), `payment_method_id` (FK → payment_methods), `total_amount`, `status`, `shipping_address`

7. **order_items** — Items in an order
   - `id` (PK), `order_id` (FK → orders), `product_id` (FK → products), `quantity`, `price_at_time`

8. **payment_methods** — Saved payment methods
   - `id` (PK), `user_id` (FK → auth.users), `card_brand`, `last4`, `cardholder_name`, `expiration_date`

### Key Relationships
- `profiles.user_id` → `auth.users.id`
- `favorites.product_id` → `products.id`
- `cart_items.cart_id` → `carts.id`
- `cart_items.product_id` → `products.id`
- `order_items.order_id` → `orders.id`
- `order_items.product_id` → `products.id`
- `orders.payment_method_id` → `payment_methods.id`

---

## Validation Strategy

### Client-Side Validation
- All forms validate required fields before submission
- Email format validated with regex
- Password minimum length enforced (6 characters)
- Product price must be > 0, rating 0–5, stock >= 0
- Payment card: last 4 digits must be exactly 4 numbers, expiry format MM/YY

### Server-Side / Database Validation
- Supabase Auth enforces email format and password policies
- Database CHECK constraints on products table (price, rating, stock, name, brand)
- Row Level Security (RLS) policies prevent unauthorized data access
- Foreign key constraints ensure referential integrity

---

## CRUD Operations

### Reduced CRUD Implementation
The Admin / Product Management page (`/admin`) provides full CRUD:
- **Create**: Add new products with validated form
- **Read**: View all products in a searchable table
- **Update**: Edit existing product details
- **Delete**: Remove products from the catalog

Additional CRUD:
- **Favorites**: Add/remove (insert/delete) favorite products
- **Cart**: Add/update quantity/remove cart items
- **Payment Methods**: Add/delete saved payment cards
- **Orders**: Create orders at checkout, view order history

---

## Front-End Decisions

- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with semantic design tokens (HSL color system)
- **UI Components**: shadcn/ui component library with custom variants
- **State Management**: React Context for auth, favorites, cart
- **Routing**: React Router v6 with protected routes
- **Design**: Apple HIG-inspired — clean, minimal, accessible
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, focus states, color contrast

---

## How AI Was Used Responsibly

AI tools were used as a development accelerator, not a replacement for understanding:

1. **Code generation**: AI helped scaffold components and pages faster
2. **Image generation**: Hero carousel images were AI-generated for inclusive representation
3. **Database design**: AI suggested schema structure, but relationships and constraints were reviewed and validated by the team
4. **Debugging**: AI helped identify and fix issues in real-time
5. **Documentation**: AI helped draft documentation templates

All AI-generated code was reviewed, tested, and modified as needed by team members. The team maintains full understanding of every component in the project.
