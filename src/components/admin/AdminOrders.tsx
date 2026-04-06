import React, { useState, useMemo } from 'react';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Phone, Mail, UserCheck, Search } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; emoji: string }> = {
  'new': { label: 'Новий', color: 'bg-blue-100 text-blue-700', emoji: '🆕' },
  'Новий': { label: 'Новий', color: 'bg-blue-100 text-blue-700', emoji: '🆕' },
  'processing': { label: 'В обробці', color: 'bg-yellow-100 text-yellow-700', emoji: '🔄' },
  'В обробці': { label: 'В обробці', color: 'bg-yellow-100 text-yellow-700', emoji: '🔄' },
  'shipped': { label: 'Відправлено', color: 'bg-purple-100 text-purple-700', emoji: '📦' },
  'Відправлено': { label: 'Відправлено', color: 'bg-purple-100 text-purple-700', emoji: '📦' },
  'delivered': { label: 'Доставлено', color: 'bg-green-100 text-green-700', emoji: '✅' },
  'Доставлено': { label: 'Доставлено', color: 'bg-green-100 text-green-700', emoji: '✅' },
  'cancelled': { label: 'Скасовано', color: 'bg-red-100 text-red-700', emoji: '❌' },
  'Скасовано': { label: 'Скасовано', color: 'bg-red-100 text-red-700', emoji: '❌' },
};

const statusOptions = [
  { value: 'new', label: '🆕 Новий' },
  { value: 'processing', label: '🔄 В обробці' },
  { value: 'shipped', label: '📦 Відправлено' },
  { value: 'delivered', label: '✅ Доставлено' },
  { value: 'cancelled', label: '❌ Скасовано' },
];

const deliveryLabels: Record<string, string> = {
  nova_poshta: 'Нова Пошта',
  ukrposhta: 'Укрпошта',
  pickup: 'Самовивіз',
};

const paymentLabels: Record<string, string> = {
  cod: 'Накладений платіж',
  card_on_delivery: 'Оплата карткою при отриманні',
  card: 'Картою онлайн',
};

const statusTabs = [
  { value: 'all', label: 'Всі' },
  ...statusOptions,
];

export function AdminOrders() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [selected, setSelected] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    return orders.filter((o: any) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        const cfg = statusConfig[statusFilter];
        if (!cfg || statusConfig[o.status]?.label !== cfg.label) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const name = (o.customer_name || '').toLowerCase();
        const phone = (o.customer_phone || '').toLowerCase();
        const email = (o.customer_email || '').toLowerCase();
        if (!name.includes(q) && !phone.includes(q) && !email.includes(q)) return false;
      }
      if (dateFrom) {
        const d = new Date(o.created_at || '');
        if (d < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        const d = new Date(o.created_at || '');
        const end = new Date(dateTo);
        end.setHours(23, 59, 59);
        if (d > end) return false;
      }
      return true;
    });
  }, [orders, statusFilter, search, dateFrom, dateTo]);

  const changeStatus = async (orderId: string, status: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success('Статус оновлено');
      if (selected?.id === orderId) setSelected((prev: any) => prev ? { ...prev, status } : null);
    } catch { toast.error('Помилка оновлення'); }
  };

  const getStatusInfo = (status: string) => statusConfig[status] || { label: status, color: 'bg-muted', emoji: '' };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Замовлення</h1>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map(tab => (
            <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === tab.value ? 'bg-orange text-white' : 'bg-muted hover:bg-muted/80'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук за ім'ям, телефоном, email..."
              className="pl-9" />
          </div>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-background" placeholder="Від" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-background" placeholder="До" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-lg font-medium mb-2">Замовлень не знайдено</p>
          <p className="text-sm text-muted-foreground">Спробуйте змінити фільтри</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left px-4 py-3 font-medium">№</th>
                  <th className="text-left px-4 py-3 font-medium">Дата</th>
                  <th className="text-left px-4 py-3 font-medium">Покупець</th>
                  <th className="text-left px-4 py-3 font-medium">Телефон</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Доставка</th>
                  <th className="text-left px-4 py-3 font-medium">Сума</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o: any) => {
                  const si = getStatusInfo(o.status);
                  return (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                      <td className="px-4 py-3 font-mono font-medium">#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(o.created_at || '').toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-3 font-medium">{o.customer_name}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <a href={`tel:${o.customer_phone}`} className="text-blue-600 hover:underline">{o.customer_phone}</a>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <a href={`mailto:${o.customer_email}`} className="text-blue-600 hover:underline">{o.customer_email}</a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{o.delivery_city}, {deliveryLabels[o.delivery_method] || o.delivery_method}</td>
                      <td className="px-4 py-3 font-semibold">{Number(o.total).toLocaleString()} ₴</td>
                      <td className="px-4 py-3">
                        <Badge className={`border-0 ${si.color}`}>{si.emoji} {si.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Замовлення #{selected?.id.slice(0, 8).toUpperCase()}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-6 text-sm">
              {/* Contact */}
              <div>
                <h3 className="font-semibold text-base mb-3">Контактні дані покупця</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Ім'я:</span> {selected.customer_name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <a href={`tel:${selected.customer_phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
                      <Phone size={16} /> Зателефонувати ({selected.customer_phone})
                    </a>
                    <a href={`mailto:${selected.customer_email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                      <Mail size={16} /> Написати на email ({selected.customer_email})
                    </a>
                  </div>
                  {selected.user_id && (
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <UserCheck size={14} /> <span>Зареєстрований користувач</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery & Payment */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-base mb-3">Деталі доставки та оплати</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="font-medium">Спосіб доставки:</span> {deliveryLabels[selected.delivery_method] || selected.delivery_method}</p>
                  <p><span className="font-medium">Місто:</span> {selected.delivery_city}</p>
                  {selected.delivery_branch && <p><span className="font-medium">Відділення:</span> {selected.delivery_branch}</p>}
                  <p><span className="font-medium">Оплата:</span> {paymentLabels[selected.payment_method] || selected.payment_method}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-base mb-3">Склад замовлення</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Товар</th>
                      <th className="text-center py-2 font-medium">К-сть</th>
                      <th className="text-right py-2 font-medium">Ціна</th>
                      <th className="text-right py-2 font-medium">Сума</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((selected.items as any[]) || []).map((item: any, i: number) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            {item.image_url && <img src={item.image_url} alt="" className="w-8 h-8 rounded object-cover" />}
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.sku && <p className="text-xs text-muted-foreground">{item.sku}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">{Number(item.price).toLocaleString()} ₴</td>
                        <td className="py-2 text-right font-medium">{(item.price * item.quantity).toLocaleString()} ₴</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between font-bold text-base pt-3 border-t mt-2">
                  <span>Разом:</span>
                  <span className="text-orange">{Number(selected.total).toLocaleString()} ₴</span>
                </div>
              </div>

              {/* Status */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-base mb-3">Статус замовлення</h3>
                <select value={selected.status} onChange={e => changeStatus(selected.id, e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange w-full sm:w-auto">
                  {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <p className="text-xs text-muted-foreground">Створено: {new Date(selected.created_at || '').toLocaleString('uk-UA')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
