import React from 'react';
import { ShieldCheck, Truck, CreditCard, Wrench } from 'lucide-react';

const benefits = [
  { icon: ShieldCheck, title: 'Оригінальні запчастини', desc: 'Тільки сертифікована продукція від перевірених постачальників' },
  { icon: Truck, title: 'Швидка доставка', desc: 'Відправка в день замовлення по всій Україні' },
  { icon: CreditCard, title: 'Зручна оплата', desc: 'Оплата карткою, накладений платіж або безготівковий розрахунок' },
  { icon: Wrench, title: 'Консультація фахівця', desc: 'Допоможемо підібрати запчастини для вашого авто' },
];

export function WhyUsSection() {
  return (
    <section id="delivery" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Чому обирають нас</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="bg-card rounded-xl p-6 text-center card-hover border border-border">
              <div className="w-14 h-14 rounded-full bg-orange-light mx-auto mb-4 flex items-center justify-center">
                <b.icon size={26} className="text-orange" />
              </div>
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
