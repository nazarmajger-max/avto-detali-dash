import React, { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState({
    store_name: '', phone: '', email: '', address: '', footer_description: '',
  });
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwError, setPwError] = useState('');

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

  const handleChangePassword = async () => {
    setPwError('');
    if (!newPassword || newPassword.length < 8) {
      setPwError('Пароль має містити мінімум 8 символів');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Паролі не співпадають');
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError(error.message);
    } else {
      toast.success('Пароль успішно змінено');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setChangingPassword(false);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;

  const inputCls = "w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange";

  return (
    <div className="space-y-8">
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
                className={inputCls} />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium mb-1 block">Опис для footer</label>
            <textarea value={form.footer_description} onChange={e => setForm({ ...form, footer_description: e.target.value })} rows={3}
              className={`${inputCls} resize-none`} />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="btn-orange px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            Зберегти зміни
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Змінити пароль</h2>
        <div className="bg-card rounded-xl border border-border p-6 max-w-2xl space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Новий пароль</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={newPassword}
                onChange={e => setNewPassword(e.target.value)} className={inputCls} placeholder="Мінімум 8 символів" />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Підтвердіть новий пароль</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} className={inputCls} placeholder="Повторіть пароль" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {pwError && <p className="text-sm text-destructive">{pwError}</p>}
          <button onClick={handleChangePassword} disabled={changingPassword}
            className="btn-orange px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60">
            {changingPassword && <Loader2 size={14} className="animate-spin" />}
            Змінити пароль
          </button>
        </div>
      </div>
    </div>
  );
}