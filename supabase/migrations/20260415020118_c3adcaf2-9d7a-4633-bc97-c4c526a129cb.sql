
-- Add validation constraints to products table for server-side data integrity
-- These complement the client-side validation in the admin form

-- Price must be positive
ALTER TABLE public.products ADD CONSTRAINT products_price_positive CHECK (price > 0);

-- Stock cannot be negative
ALTER TABLE public.products ADD CONSTRAINT products_stock_non_negative CHECK (stock_quantity >= 0);

-- Rating must be between 0 and 5
ALTER TABLE public.products ADD CONSTRAINT products_rating_range CHECK (rating >= 0 AND rating <= 5);

-- Product name cannot be empty
ALTER TABLE public.products ADD CONSTRAINT products_name_not_empty CHECK (char_length(trim(name)) > 0);

-- Brand cannot be empty
ALTER TABLE public.products ADD CONSTRAINT products_brand_not_empty CHECK (char_length(trim(brand)) > 0);
