import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'Новий': 'bg-blue-100 text-blue-700',
  'В обробці': 'bg-yellow-100 text-yellow-700',
  'Відправлено': 'bg-purple-100 text-purple-700',
  'Доставлено': 'bg-green-100 text-green-700',
  'Скасовано': 'bg-red-100 text-red-700',
};

const statuses: Order['status'][] = ['Новий', 'В обробці', 'Відправлено', 'Доставлено', 'Скасовано'];

export function AdminOrders() {
  const { orders, setOrders } = useStore();
  const [selected, setSelected] = useState<Order | null>(null);

  const changeStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success('Статус оновлено');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Замовлення</h1>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted">
                <th className="text-left px-4 py-3 font-medium">№ замовлення</th>
                <th className="text-left px-4 py-3 font-medium">Покупець</th>
                <th className="text-left px-4 py-3 font-medium">Дата</th>
                <th className="text-left px-4 py-3 font-medium">Сума</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="text-left px-4 py-3 font-medium">Дії</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3 font-semibold">{o.total.toLocaleString()} ₴</td>
                  <td className="px-4 py-3">
                    <Badge className={`border-0 ${statusColors[o.status] || ''}`}>{o.status}</Badge>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <select value={o.status} onChange={e => changeStatus(o.id, e.target.value as Order['status'])}
                      className="px-2 py-1 border rounded text-xs bg-background focus:outline-none focus:ring-2 focus:ring-orange">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Замовлення {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Покупець:</span> {selected.customerName}</p>
              <p><span className="font-medium">Дата:</span> {selected.date}</p>
              <p><span className="font-medium">Адреса:</span> {selected.address}</p>
              <div>
                <span className="font-medium">Товари:</span>
                <ul className="mt-1 space-y-1">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-muted-foreground">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>{(item.product.price * item.quantity).toLocaleString()} ₴</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-semibold text-base pt-2 border-t">Разом: {selected.total.toLocaleString()} ₴</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
