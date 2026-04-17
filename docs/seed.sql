-- ============================================================
-- Beauty Compass — Seed Data Script
-- Populates the products table with sample beauty products
-- ============================================================

-- SKINCARE PRODUCTS
INSERT INTO public.products (name, brand, price, rating, category, gender, description, full_description, image_url, skin_concerns, ingredients, benefits, external_url, stock_quantity) VALUES
('2% BHA Liquid Exfoliant', 'Paula''s Choice', 34.00, 4.7, 'skincare', 'unisex', 'Gentle leave-on exfoliant unclogs pores and smooths wrinkles.', 'This cult-favorite BHA exfoliant gently unclogs pores, smooths wrinkles, and evens skin tone.', 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&h=400&fit=crop', ARRAY['acne','pores','dullness'], ARRAY['Salicylic Acid','Green Tea Extract'], ARRAY['Unclogs pores','Smooths texture'], 'https://www.paulaschoice.com', 85),
('Hyaluronic Acid Serum', 'The Ordinary', 8.90, 4.5, 'skincare', 'unisex', 'Lightweight serum for intense hydration.', 'A water-based serum with multi-weight hyaluronic acid for multi-depth hydration.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', ARRAY['dryness','hydration','aging'], ARRAY['Hyaluronic Acid','Vitamin B5'], ARRAY['Deep hydration','Plumps skin'], 'https://theordinary.com', 150),
('Vitamin C Brightening Serum', 'Drunk Elephant', 78.00, 4.6, 'skincare', 'unisex', 'Potent vitamin C serum for brighter, firmer skin.', 'Packed with 15% L-ascorbic acid for a potent antioxidant blend that firms and brightens.', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', ARRAY['dark-spots','dullness','aging'], ARRAY['L-Ascorbic Acid','Ferulic Acid','Vitamin E'], ARRAY['Brightens complexion','Fades dark spots'], 'https://www.drunkelephant.com', 60);

-- MAKEUP PRODUCTS
INSERT INTO public.products (name, brand, price, rating, category, gender, description, full_description, image_url, skin_concerns, ingredients, benefits, external_url, stock_quantity) VALUES
('Luminous Silk Foundation', 'Giorgio Armani', 65.00, 4.8, 'makeup', 'female', 'Award-winning foundation for a radiant finish.', 'Iconic foundation with Micro-fil technology for silky, weightless texture.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', ARRAY['dullness'], ARRAY['Micro-fil Technology','Glycerin'], ARRAY['Natural glow','Lightweight'], 'https://www.giorgioarmanibeauty.com', 45),
('Better Than Sex Mascara', 'Too Faced', 29.00, 4.4, 'makeup', 'female', 'Volumizing mascara for dramatic, full lashes.', 'Bestselling mascara with intense black pigment for dramatic volume.', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop', ARRAY[]::text[], ARRAY['Film-Forming Polymer','Peptide Complex'], ARRAY['Extreme volume','No clumping'], 'https://www.toofaced.com', 90);

-- HAIRCARE PRODUCTS
INSERT INTO public.products (name, brand, price, rating, category, gender, description, full_description, image_url, skin_concerns, ingredients, benefits, external_url, stock_quantity) VALUES
('Olaplex Hair Perfector No.3', 'Olaplex', 30.00, 4.7, 'haircare', 'unisex', 'Bond-building treatment for damaged hair.', 'This at-home treatment repairs and strengthens damaged, broken, and compromised hair.', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop', ARRAY[]::text[], ARRAY['Bis-Aminopropyl Diglycol Dimaleate'], ARRAY['Repairs damage','Strengthens bonds'], 'https://olaplex.com', 70);

-- FRAGRANCE PRODUCTS
INSERT INTO public.products (name, brand, price, rating, category, gender, description, full_description, image_url, skin_concerns, ingredients, benefits, external_url, stock_quantity) VALUES
('Santal 33 Eau de Parfum', 'Le Labo', 310.00, 4.8, 'fragrance', 'unisex', 'Iconic woody unisex fragrance with sandalwood.', 'A cult-favorite fragrance centered around Australian sandalwood with cardamom and violet.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', ARRAY[]::text[], ARRAY['Sandalwood','Cardamom','Violet Accord'], ARRAY['Long-lasting','Unisex appeal'], 'https://www.lelabofragrances.com', 25);

-- BODY CARE PRODUCTS
INSERT INTO public.products (name, brand, price, rating, category, gender, description, full_description, image_url, skin_concerns, ingredients, benefits, external_url, stock_quantity) VALUES
('Brazilian Bum Bum Cream', 'Sol de Janeiro', 48.00, 4.6, 'bodycare', 'unisex', 'Fast-absorbing body cream with cupuacu butter.', 'This luxurious body cream tightens and smooths skin with a warm, addictive scent.', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', ARRAY['dryness','hydration'], ARRAY['Cupuacu Butter','Coconut Oil','Acai'], ARRAY['Tightens skin','Deep moisture'], 'https://soldejaneiro.com', 55);

-- TOOLS PRODUCTS
INSERT INTO public.products (name, brand, price, rating, category, gender, description, full_description, image_url, skin_concerns, ingredients, benefits, external_url, stock_quantity) VALUES
('Jade Facial Roller', 'Mount Lai', 34.00, 4.4, 'tools', 'unisex', 'Dual-sided jade roller for facial massage.', 'This genuine jade roller promotes lymphatic drainage, reduces puffiness, and helps products absorb better.', 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=400&h=400&fit=crop', ARRAY['pores','hydration'], ARRAY[]::text[], ARRAY['Reduces puffiness','Promotes drainage'], 'https://www.mountlai.com', 80);

-- NOTE: The full product catalog contains 80+ products across all categories.
-- This seed file shows a representative sample. See src/data/products.ts for the complete dataset.
