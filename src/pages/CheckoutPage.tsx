import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useSettings } from '@/hooks/useSettings';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const phoneRegex = /^\+380\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { data: settings } = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: user?.profile?.full_name || '',
    customer_phone: '',
    customer_email: user?.email || '',
    delivery_city: '',
    delivery_method: 'nova_poshta',
    delivery_branch: '',
    payment_method: 'cod',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  if (items.length === 0) return <Navigate to="/catalog" replace />;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customer_name.trim()) e.customer_name = "Це поле обов'язкове";
    if (!form.customer_phone.trim()) e.customer_phone = "Це поле обов'язкове";
    else if (!phoneRegex.test(form.customer_phone.trim())) e.customer_phone = 'Введіть коректний номер телефону (+380XXXXXXXXX)';
    if (!form.customer_email.trim()) e.customer_email = "Це поле обов'язкове";
    else if (!emailRegex.test(form.customer_email.trim())) e.customer_email = 'Введіть коректний email';
    if (!form.delivery_city.trim()) e.delivery_city = "Це поле обов'язкове";
    if (form.delivery_method !== 'pickup' && !form.delivery_branch.trim()) e.delivery_branch = "Це поле обов'язкове";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    try {
      const result = await createOrder.mutateAsync({
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_email: form.customer_email.trim(),
        delivery_method: form.delivery_method,
        delivery_city: form.delivery_city.trim(),
        delivery_branch: form.delivery_method !== 'pickup' ? form.delivery_branch.trim() : '',
        payment_method: form.payment_method,
        items: items.map(i => ({
          product_id: i.product.id,
          name: i.product.name,
          sku: i.product.sku,
          price: Number(i.product.price),
          quantity: i.quantity,
          image_url: i.product.image_url || '',
        })),
        total: totalPrice,
        user_id: user?.id || null,
      });
      clearCart();
      navigate('/order-success', {
        state: {
          orderId: result.id,
          customerName: form.customer_name.trim(),
          customerPhone: form.customer_phone.trim(),
          items: items.map(i => ({ name: i.product.name, quantity: i.quantity, price: Number(i.product.price) })),
          total: totalPrice,
          deliveryMethod: form.delivery_method,
          deliveryCity: form.delivery_city.trim(),
        },
      });
    } catch {
      setSubmitError('Помилка при створенні замовлення. Спробуйте ще раз.');
    }
  };

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const deliveryLabels: Record<string, string> = { nova_poshta: 'Нова Пошта', ukrposhta: 'Укрпошта', pickup: 'Самовивіз' };
  const storeAddress = settings?.address || 'Адреса магазину не вказана';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Оформлення замовлення</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              {/* Section 1 — Contact */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Контактні дані</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Ім'я та прізвище *</label>
                    <input value={form.customer_name} onChange={e => set('customer_name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange ${errors.customer_name ? 'border-destructive' : ''}`} />
                    {errors.customer_name && <p className="text-xs text-destructive mt-1">{errors.customer_name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Номер телефону *</label>
                    <input type="tel" value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} placeholder="+380XXXXXXXXX"
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange ${errors.customer_phone ? 'border-destructive' : ''}`} />
                    {errors.customer_phone && <p className="text-xs text-destructive mt-1">{errors.customer_phone}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email *</label>
                    <input type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange ${errors.customer_email ? 'border-destructive' : ''}`} />
                    {errors.customer_email && <p className="text-xs text-destructive mt-1">{errors.customer_email}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2 — Delivery */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Адреса доставки</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Місто *</label>
                    <input value={form.delivery_city} onChange={e => set('delivery_city', e.target.value)} placeholder="Київ"
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange ${errors.delivery_city ? 'border-destructive' : ''}`} />
                    {errors.delivery_city && <p className="text-xs text-destructive mt-1">{errors.delivery_city}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Спосіб доставки *</label>
                    <div className="space-y-2">
                      {(['nova_poshta', 'ukrposhta', 'pickup'] as const).map(method => (
                        <label key={method} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${form.delivery_method === method ? 'border-orange bg-orange/5' : 'hover:bg-muted'}`}>
                          <input type="radio" name="delivery_method" value={method} checked={form.delivery_method === method}
                            onChange={() => set('delivery_method', method)} className="accent-orange" />
                          <span className="text-sm">{deliveryLabels[method]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {form.delivery_method !== 'pickup' ? (
                    <div>
                      <label className="text-sm font-medium mb-1 block">Номер відділення *</label>
                      <input value={form.delivery_branch} onChange={e => set('delivery_branch', e.target.value)} placeholder="Відділення №1"
                        className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange ${errors.delivery_branch ? 'border-destructive' : ''}`} />
                      {errors.delivery_branch && <p className="text-xs text-destructive mt-1">{errors.delivery_branch}</p>}
                    </div>
                  ) : (
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <span className="font-medium">Адреса магазину:</span> {storeAddress}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3 — Payment */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Спосіб оплати</h2>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${form.payment_method === 'cod' ? 'border-orange bg-orange/5' : 'hover:bg-muted'}`}>
                    <input type="radio" name="payment" value="cod" checked={form.payment_method === 'cod'} onChange={() => set('payment_method', 'cod')} className="accent-orange" />
                    <span className="text-sm">📦 Накладений платіж</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${form.payment_method === 'card_on_delivery' ? 'border-orange bg-orange/5' : 'hover:bg-muted'}`}>
                    <input type="radio" name="payment" value="card_on_delivery" checked={form.payment_method === 'card_on_delivery'} onChange={() => set('payment_method', 'card_on_delivery')} className="accent-orange" />
                    <span className="text-sm">💳 Оплата карткою при отриманні</span>
                  </label>
                </div>
              </div>

              {submitError && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{submitError}</div>}

              <button type="submit" disabled={createOrder.isPending}
                className="w-full btn-orange py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                {createOrder.isPending && <Loader2 size={16} className="animate-spin" />}
                Підтвердити замовлення
              </button>
            </form>

            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-6 h-fit lg:sticky lg:top-4">
              <h2 className="font-semibold text-lg mb-4">Ваше замовлення</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image_url || ''} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.sku} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium shrink-0">{(Number(item.product.price) * item.quantity).toLocaleString()} ₴</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Разом:</span>
                <span className="text-orange">{totalPrice.toLocaleString()} ₴</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
