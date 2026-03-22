import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success('Ви успішно увійшли!');
      onOpenChange(false);
      resetForm();
    } else {
      toast.error('Невірний email або пароль');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(name, email, password)) {
      toast.success('Реєстрація успішна!');
      onOpenChange(false);
      resetForm();
    } else {
      toast.error('Користувач з таким email вже існує');
    }
  };

  const resetForm = () => { setEmail(''); setPassword(''); setName(''); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {tab === 'login' ? 'Вхід в акаунт' : 'Реєстрація'}
          </DialogTitle>
        </DialogHeader>

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

        {tab === 'login' ? (
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
            <button type="submit" className="w-full btn-orange py-2.5 rounded-lg text-sm">Увійти</button>
            <p className="text-xs text-muted-foreground text-center">Демо: admin@avtodetal.ua / admin123</p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Ім'я</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange bg-background" placeholder="Ваше ім'я" />
            </div>
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
            <button type="submit" className="w-full btn-orange py-2.5 rounded-lg text-sm">Зареєструватись</button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
