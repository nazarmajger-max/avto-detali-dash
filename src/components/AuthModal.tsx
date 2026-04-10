import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const { login, register } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Введіть email');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      setForgotSent(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await login(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error === 'Invalid login credentials' ? 'Невірний email або пароль' : error);
    } else {
      toast.success('Ви успішно увійшли!');
      onOpenChange(false);
      resetForm();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Заповніть ім'я та прізвище");
      return;
    }
    if (password.length < 8) {
      toast.error('Пароль має містити мінімум 8 символів');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Паролі не співпадають');
      return;
    }
    setSubmitting(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const { error } = await register(fullName, email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error.includes('already registered') ? 'Користувач з таким email вже існує' : error);
    } else {
      toast.success('Реєстрація успішна! Перевірте email для підтвердження.');
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setForgotSent(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {tab === 'login' ? 'Вхід в акаунт' : tab === 'register' ? 'Реєстрація' : 'Відновлення пароля'}
          </DialogTitle>
        </DialogHeader>

        {tab !== 'forgot' && (
          <div className="flex border-b mb-4">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === 'login' ? 'border-b-2 border-orange text-orange' : 'text-muted-foreground'}`}
            >
              Увійти
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === 'register' ? 'border-b-2 border-orange text-orange' : 'text-muted-foreground'}`}
            >
              Зареєструватись
            </button>
          </div>
        )}

        {tab === 'forgot' ? (
          forgotSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="text-green-600 text-xl">✉️</span>
              </div>
              <h3 className="font-semibold">Перевірте вашу пошту</h3>
              <p className="text-sm text-muted-foreground">
                Ми надіслали лист з інструкціями для скидання пароля на <strong>{email}</strong>
              </p>
              <button onClick={() => { setTab('login'); setForgotSent(false); }}
                className="text-sm text-orange hover:underline">
                Повернутись до входу
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground">Введіть email, який ви використовували при реєстрації. Ми надішлемо вам посилання для скидання пароля.</p>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="email@example.com" />
              </div>
              <button type="submit" disabled={submitting} className="w-full btn-orange py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Надіслати посилання
              </button>
              <button type="button" onClick={() => setTab('login')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                Повернутись до входу
              </button>
            </form>
          )
        ) : tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="email@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={submitting} className="w-full btn-orange py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Увійти
            </button>
            <button type="button" onClick={() => setTab('forgot')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              Забули пароль?
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Ім'я</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="Олександр" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Прізвище</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="Петренко" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="email@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="Мінімум 8 символів" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Підтвердження пароля</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={submitting} className="w-full btn-orange py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Зареєструватись
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
