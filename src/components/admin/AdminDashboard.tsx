import React from 'react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const { products, orders } = useStore();
  const { users } = useAuth();

  const stats = [
    { label: 'Товарів у каталозі', value: products.length, icon: Package, color: 'text-blue-500 bg-blue-50' },
    { label: 'Замовлень сьогодні', value: orders.filter(o => o.status === 'Новий').length, icon: ShoppingCart, color: 'text-green-500 bg-green-50' },
    { label: 'Нових користувачів', value: users.length, icon: Users, color: 'text-purple-500 bg-purple-50' },
    { label: 'Виручка за місяць', value: `${orders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₴`, icon: TrendingUp, color: 'text-orange bg-orange-light' },
  ];

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

      {/* Simple chart placeholder */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-semibold mb-4">Замовлення за тиждень</h3>
        <div className="flex items-end gap-3 h-40">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((day, i) => {
            const height = [60, 45, 80, 35, 90, 50, 30][i];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-orange/20 rounded-t-md relative" style={{ height: `${height}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-orange rounded-t-md" style={{ height: '70%' }} />
                </div>
                <span className="text-xs text-muted-foreground">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
