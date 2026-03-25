import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { Navigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: user?.email || '',
    city: '',
    warehouse: '',
    payment: 'card',
  });
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!user) return <Navigate to="/" replace />;
  if (items.length === 0 && !orderId) return <Navigate to="/catalog" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.city || !form.warehouse) {
      toast.error('Заповніть всі поля');
      return;
    }

    try {
      const result = await createOrder.mutateAsync({
        user_id: user.id,
        items: items.map(i => ({ product_id: i.product.id, name: i.product.name, sku: i.product.sku, price: Number(i.product.price), quantity: i.quantity })),
        total: totalPrice,
        delivery_info: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          city: form.city,
          warehouse: form.warehouse,
          payment: form.payment,
        },
      });
      setOrderId(result.id);
      clearCart();
    } catch {
      toast.error('Помилка при створенні замовлення');
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted">
          <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center max-w-md mx-4">
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Замовлення прийнято!</h1>
            <p className="text-muted-foreground mb-1">Номер замовлення:</p>
            <p className="text-lg font-mono font-bold text-orange mb-6">{orderId.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-muted-foreground mb-6">Дякуємо за покупку! Ми зв'яжемося з вами найближчим часом.</p>
            <div className="flex gap-3">
              <Link to="/profile/orders" className="flex-1 btn-orange py-2.5 rounded-lg text-sm text-center">Мої замовлення</Link>
              <Link to="/catalog" className="flex-1 py-2.5 border rounded-lg text-sm text-center hover:bg-muted transition-colors">До каталогу</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Оформлення замовлення</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-2">Контактні дані</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Ім'я *</label>
                  <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Прізвище *</label>
                  <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Телефон *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+380..."
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                </div>
              </div>

              <h2 className="font-semibold text-lg mt-6 mb-2">Доставка</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Місто *</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required placeholder="Київ"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Відділення Нової Пошти *</label>
                  <input value={form.warehouse} onChange={e => setForm({ ...form, warehouse: e.target.value })} required placeholder="Відділення №1"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                </div>
              </div>

              <h2 className="font-semibold text-lg mt-6 mb-2">Спосіб оплати</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={() => setForm({ ...form, payment: 'card' })} className="accent-orange" />
                  <span className="text-sm">💳 Картою онлайн</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={() => setForm({ ...form, payment: 'cod' })} className="accent-orange" />
                  <span className="text-sm">📦 Накладений платіж</span>
                </label>
              </div>

              <button type="submit" disabled={createOrder.isPending}
                className="w-full btn-orange py-3 rounded-lg text-sm font-medium mt-4 flex items-center justify-center gap-2 disabled:opacity-60">
                {createOrder.isPending && <Loader2 size={16} className="animate-spin" />}
                Підтвердити замовлення
              </button>
            </form>

            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-6 h-fit">
              <h2 className="font-semibold text-lg mb-4">Ваше замовлення</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[200px]">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium shrink-0 ml-2">{(Number(item.product.price) * item.quantity).toLocaleString()} ₴</span>
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
