
-- Enable RLS on categories (public reference data)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Enable RLS on clients (legacy table)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients are viewable by authenticated users" ON public.clients FOR SELECT TO authenticated USING (true);
