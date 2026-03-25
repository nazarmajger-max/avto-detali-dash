import React, { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '@/types';

const statusColors: Record<string, string> = {
  'Новий': 'bg-blue-100 text-blue-700',
  'В обробці': 'bg-yellow-100 text-yellow-700',
  'Відправлено': 'bg-purple-100 text-purple-700',
  'Доставлено': 'bg-green-100 text-green-700',
  'Скасовано': 'bg-red-100 text-red-700',
};

const statuses = ['Новий', 'В обробці', 'Відправлено', 'Доставлено', 'Скасовано'];

export function AdminOrders() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [selected, setSelected] = useState<Order | null>(null);

  const changeStatus = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success('Статус оновлено');
    } catch { toast.error('Помилка оновлення'); }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Замовлення</h1>

      {orders.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-lg font-medium mb-2">Замовлень ще немає</p>
          <p className="text-sm text-muted-foreground">Замовлення з'являться тут після оформлення покупцями</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left px-4 py-3 font-medium">№ замовлення</th>
                  <th className="text-left px-4 py-3 font-medium">Дата</th>
                  <th className="text-left px-4 py-3 font-medium">Сума</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                    <td className="px-4 py-3 font-medium">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at || '').toLocaleDateString('uk-UA')}</td>
                    <td className="px-4 py-3 font-semibold">{Number(o.total).toLocaleString()} ₴</td>
                    <td className="px-4 py-3">
                      <Badge className={`border-0 ${statusColors[o.status] || ''}`}>{o.status}</Badge>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select value={o.status} onChange={e => changeStatus(o.id, e.target.value)}
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
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Замовлення #{selected?.id.slice(0, 8).toUpperCase()}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Дата:</span> {new Date(selected.created_at || '').toLocaleString('uk-UA')}</p>
              {(() => {
                const delivery = (selected.delivery_info as any) || {};
                return delivery.firstName ? (
                  <>
                    <p><span className="font-medium">Покупець:</span> {delivery.firstName} {delivery.lastName}</p>
                    <p><span className="font-medium">Телефон:</span> {delivery.phone}</p>
                    <p><span className="font-medium">Адреса:</span> {delivery.city}, {delivery.warehouse}</p>
                    <p><span className="font-medium">Оплата:</span> {delivery.payment === 'card' ? 'Картою онлайн' : 'Накладений платіж'}</p>
                  </>
                ) : null;
              })()}
              <div>
                <span className="font-medium">Товари:</span>
                <ul className="mt-1 space-y-1">
                  {((selected.items as any[]) || []).map((item: any, i: number) => (
                    <li key={i} className="flex justify-between text-muted-foreground">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} ₴</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-semibold text-base pt-2 border-t">Разом: {Number(selected.total).toLocaleString()} ₴</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
