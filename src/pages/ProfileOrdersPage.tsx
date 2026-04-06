import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useMyOrders } from '@/hooks/useOrders';
import { Navigate } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<string, { label: string; color: string }> = {
  'new': { label: 'Новий', color: 'bg-blue-100 text-blue-700' },
  'Новий': { label: 'Новий', color: 'bg-blue-100 text-blue-700' },
  'processing': { label: 'В обробці', color: 'bg-yellow-100 text-yellow-700' },
  'В обробці': { label: 'В обробці', color: 'bg-yellow-100 text-yellow-700' },
  'shipped': { label: 'Відправлено', color: 'bg-purple-100 text-purple-700' },
  'Відправлено': { label: 'Відправлено', color: 'bg-purple-100 text-purple-700' },
  'delivered': { label: 'Доставлено', color: 'bg-green-100 text-green-700' },
  'Доставлено': { label: 'Доставлено', color: 'bg-green-100 text-green-700' },
  'cancelled': { label: 'Скасовано', color: 'bg-red-100 text-red-700' },
  'Скасовано': { label: 'Скасовано', color: 'bg-red-100 text-red-700' },
};

const deliveryLabels: Record<string, string> = {
  nova_poshta: 'Нова Пошта',
  ukrposhta: 'Укрпошта',
  pickup: 'Самовивіз',
};

const ProfileOrdersPage = () => {
  const { user, loading } = useAuth();
  const { data: orders = [], isLoading } = useMyOrders(user?.id);

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Мої замовлення</h1>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>
          ) : orders.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Замовлень ще немає</p>
              <p className="text-sm text-muted-foreground">Ваші замовлення з'являться тут після оформлення</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => {
                const items = (order.items as any[]) || [];
                const si = statusConfig[order.status] || { label: order.status, color: 'bg-muted' };
                return (
                  <div key={order.id} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="font-medium">Замовлення #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at || '').toLocaleDateString('uk-UA')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`border-0 ${si.color}`}>{si.label}</Badge>
                        <span className="font-bold text-orange">{Number(order.total).toLocaleString()} ₴</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{(item.price * item.quantity).toLocaleString()} ₴</span>
                        </div>
                      ))}
                    </div>
                    {order.delivery_city && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        Доставка: {deliveryLabels[order.delivery_method] || order.delivery_method}, {order.delivery_city}
                        {order.delivery_branch ? `, ${order.delivery_branch}` : ''}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileOrdersPage;
