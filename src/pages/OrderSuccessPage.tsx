import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const deliveryLabels: Record<string, string> = {
  nova_poshta: 'Нова Пошта',
  ukrposhta: 'Укрпошта',
  pickup: 'Самовивіз',
};

const OrderSuccessPage = () => {
  const location = useLocation();
  const state = location.state as {
    orderId: string;
    customerName: string;
    customerPhone: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    deliveryMethod: string;
    deliveryCity: string;
  } | null;

  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted px-4">
        <div className="bg-card rounded-xl border border-border p-8 md:p-12 max-w-lg w-full">
          <div className="text-center mb-6">
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-1">Дякуємо за замовлення, {state.customerName}!</h1>
            <p className="text-muted-foreground">Номер замовлення:</p>
            <p className="text-lg font-mono font-bold text-orange">#{state.orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="space-y-3 text-sm border-t pt-4">
            <div>
              <span className="font-medium">Товари:</span>
              <ul className="mt-1 space-y-1">
                {state.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-muted-foreground">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} ₴</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t">
              <span>Разом:</span>
              <span className="text-orange">{state.total.toLocaleString()} ₴</span>
            </div>
            <p><span className="font-medium">Доставка:</span> {deliveryLabels[state.deliveryMethod] || state.deliveryMethod}, {state.deliveryCity}</p>
          </div>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Наш менеджер зв'яжеться з вами найближчим часом на номер <span className="font-medium text-foreground">{state.customerPhone}</span>
          </p>

          <Link to="/catalog" className="block w-full btn-orange py-3 rounded-lg text-sm font-medium text-center mt-6">
            Повернутись до каталогу
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
