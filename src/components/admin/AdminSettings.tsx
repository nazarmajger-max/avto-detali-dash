import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

export function AdminSettings() {
  const { settings, setSettings } = useStore();
  const [form, setForm] = useState(settings);

  const handleSave = () => {
    setSettings(form);
    toast.success('Налаштування збережено');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Налаштування</h1>
      <div className="bg-card rounded-xl border border-border p-6 max-w-2xl space-y-4">
        {[
          { label: 'Назва магазину', key: 'storeName' as const },
          { label: 'Номер телефону', key: 'phone' as const },
          { label: 'Email', key: 'email' as const },
          { label: 'Адреса', key: 'address' as const },
        ].map(f => (
          <div key={f.key}>
            <label className="text-sm font-medium mb-1 block">{f.label}</label>
            <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium mb-1 block">Опис для footer</label>
          <textarea value={form.footerDescription} onChange={e => setForm({ ...form, footerDescription: e.target.value })} rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange resize-none" />
        </div>
        <button onClick={handleSave} className="btn-orange px-6 py-2.5 rounded-lg text-sm">Зберегти зміни</button>
      </div>
    </div>
  );
}
