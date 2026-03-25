import type { Tables } from '@/integrations/supabase/types';

export type Brand = Tables<'brands'>;
export type Category = Tables<'categories'>;
export type Product = Tables<'products'>;
export type Profile = Tables<'profiles'>;
export type Order = Tables<'orders'>;
export type Settings = Tables<'settings'>;
export type UserRole = Tables<'user_roles'>;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
  role: 'admin' | 'customer';
}
