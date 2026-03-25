import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useProfiles } from '@/hooks/useProfiles';
import { Package, ShoppingCart, Users, TrendingUp, Loader2 } from 'lucide-react';

export function AdminDashboard() {
  const { data: products = [], isLoading: pLoading } = useProducts();
  const { data: orders = [], isLoading: oLoading } = useOrders();
  const { data: profiles = [], isLoading: uLoading } = useProfiles();

  const isLoading = pLoading || oLoading || uLoading;

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => (o.created_at || '').startsWith(today));
  const revenue = orders.filter(o => o.status === 'Доставлено').reduce((s, o) => s + Number(o.total), 0);

  const stats = [
    { label: 'Товарів у каталозі', value: products.length, icon: Package, color: 'text-blue-500 bg-blue-50' },
    { label: 'Замовлень сьогодні', value: todayOrders.length, icon: ShoppingCart, color: 'text-green-500 bg-green-50' },
    { label: 'Користувачів', value: profiles.length, icon: Users, color: 'text-purple-500 bg-purple-50' },
    { label: 'Виручка (доставлені)', value: `${revenue.toLocaleString()} ₴`, icon: TrendingUp, color: 'text-orange bg-orange-light' },
  ];

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-semibold mb-4">Останні замовлення</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Замовлень ще немає</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                <span className="font-medium">#{o.id.slice(0, 8).toUpperCase()}</span>
                <span className="text-muted-foreground">{new Date(o.created_at || '').toLocaleDateString('uk-UA')}</span>
                <span className="font-semibold">{Number(o.total).toLocaleString()} ₴</span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted">{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
