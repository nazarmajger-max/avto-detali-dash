
-- Add new columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_method text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_city text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_branch text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text;

-- Make user_id nullable (for guest orders)
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Set defaults for new columns on existing rows
UPDATE public.orders SET 
  customer_name = COALESCE((delivery_info->>'firstName')::text || ' ' || (delivery_info->>'lastName')::text, 'Unknown'),
  customer_phone = COALESCE((delivery_info->>'phone')::text, ''),
  customer_email = COALESCE((delivery_info->>'email')::text, ''),
  delivery_method = 'nova_poshta',
  delivery_city = COALESCE((delivery_info->>'city')::text, ''),
  delivery_branch = COALESCE((delivery_info->>'warehouse')::text, ''),
  payment_method = COALESCE((delivery_info->>'payment')::text, 'cod')
WHERE customer_name IS NULL;

-- Now set NOT NULL constraints
ALTER TABLE public.orders ALTER COLUMN customer_name SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN customer_name SET DEFAULT '';
ALTER TABLE public.orders ALTER COLUMN customer_phone SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN customer_phone SET DEFAULT '';
ALTER TABLE public.orders ALTER COLUMN customer_email SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN customer_email SET DEFAULT '';
ALTER TABLE public.orders ALTER COLUMN delivery_method SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN delivery_method SET DEFAULT 'nova_poshta';
ALTER TABLE public.orders ALTER COLUMN payment_method SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN payment_method SET DEFAULT 'cod';

-- Update RLS: allow anon inserts for guest checkout
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Update read policy: guests can't read (only logged-in own orders + admin)
-- Keep existing read policy as-is (already correct)
