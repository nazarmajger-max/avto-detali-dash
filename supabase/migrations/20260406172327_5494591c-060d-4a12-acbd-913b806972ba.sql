
CREATE POLICY "Anon can read own insert" ON public.orders
  FOR SELECT TO anon
  USING (true);
