import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrderInsert {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_method: string;
  delivery_city: string;
  delivery_branch?: string;
  payment_method: string;
  items: any;
  total: number;
  user_id?: string | null;
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useMyOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'my', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: OrderInsert) => {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          delivery_method: order.delivery_method,
          delivery_city: order.delivery_city,
          delivery_branch: order.delivery_branch || '',
          payment_method: order.payment_method,
          items: order.items,
          total: order.total,
          user_id: order.user_id || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}
