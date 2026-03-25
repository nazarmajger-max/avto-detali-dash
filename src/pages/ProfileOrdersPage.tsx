import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useMyOrders } from '@/hooks/useOrders';
import { Navigate } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  'Новий': 'bg-blue-100 text-blue-700',
  'В обробці': 'bg-yellow-100 text-yellow-700',
  'Відправлено': 'bg-purple-100 text-purple-700',
  'Доставлено': 'bg-green-100 text-green-700',
  'Скасовано': 'bg-red-100 text-red-700',
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
              {orders.map(order => {
                const items = (order.items as any[]) || [];
                const delivery = (order.delivery_info as any) || {};
                return (
                  <div key={order.id} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="font-medium">Замовлення #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at || '').toLocaleDateString('uk-UA')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`border-0 ${statusColors[order.status] || ''}`}>{order.status}</Badge>
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
                    {delivery.city && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        Доставка: {delivery.city}, {delivery.warehouse}
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
