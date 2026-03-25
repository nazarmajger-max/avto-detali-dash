import React, { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState({
    store_name: '', phone: '', email: '', address: '', footer_description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        store_name: settings.store_name || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        footer_description: settings.footer_description || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings.mutateAsync({ id: settings.id, ...form });
      toast.success('Налаштування збережено');
    } catch { toast.error('Помилка збереження'); }
    setSaving(false);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Налаштування</h1>
      <div className="bg-card rounded-xl border border-border p-6 max-w-2xl space-y-4">
        {[
          { label: 'Назва магазину', key: 'store_name' as const },
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
          <textarea value={form.footer_description} onChange={e => setForm({ ...form, footer_description: e.target.value })} rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange resize-none" />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="btn-orange px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}
