import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const { data: settings } = useSettings();

  return (
    <footer className="nav-gradient text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-orange flex items-center justify-center">
                <span className="font-bold text-sm">АД</span>
              </div>
              <span className="font-bold text-lg">{settings?.store_name || 'АвтоДеталі'}</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">{settings?.footer_description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Інформація</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              {['Каталог', 'Доставка', 'Оплата', 'Повернення', 'Контакти'].map(l => (
                <li key={l}><a href="#" className="hover:text-orange transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Категорії</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              {['Двигун', 'Гальмівна система', 'Підвіска', 'Фільтри', 'Електрика'].map(l => (
                <li key={l}><a href="#" className="hover:text-orange transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакти</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-center gap-2"><Phone size={15} className="text-orange" />{settings?.phone}</li>
              <li className="flex items-center gap-2"><Mail size={15} className="text-orange" />{settings?.email}</li>
              <li className="flex items-start gap-2"><MapPin size={15} className="text-orange mt-0.5" />{settings?.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} {settings?.store_name || 'АвтоДеталі'}. Всі права захищені.
        </div>
      </div>
    </footer>
  );
}
