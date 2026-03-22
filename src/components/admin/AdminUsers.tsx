import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdminUsers() {
  const { users, updateUsers, user: currentUser } = useAuth();

  const toggleRole = (u: User) => {
    if (u.id === currentUser?.id) { toast.error('Не можна змінити власну роль'); return; }
    updateUsers(users.map(x => x.id === u.id ? { ...x, role: x.role === 'admin' ? 'customer' : 'admin' } as User : x));
    toast.success('Роль змінено');
  };

  const toggleActive = (u: User) => {
    if (u.id === currentUser?.id) { toast.error('Не можна деактивувати себе'); return; }
    updateUsers(users.map(x => x.id === u.id ? { ...x, active: !x.active } : x));
    toast.success(u.active ? 'Користувача деактивовано' : 'Користувача активовано');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Користувачі</h1>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted">
                <th className="text-left px-4 py-3 font-medium">Ім'я</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Роль</th>
                <th className="text-left px-4 py-3 font-medium">Дата реєстрації</th>
                <th className="text-left px-4 py-3 font-medium">Дії</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={`border-0 ${u.role === 'admin' ? 'bg-orange-light text-orange' : 'bg-blue-50 text-blue-600'}`}>
                      {u.role === 'admin' ? 'Адмін' : 'Покупець'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.registeredAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleRole(u)} className="px-2 py-1 border rounded text-xs hover:bg-muted transition-colors">
                        {u.role === 'admin' ? '→ Покупець' : '→ Адмін'}
                      </button>
                      <button onClick={() => toggleActive(u)}
                        className={`px-2 py-1 border rounded text-xs transition-colors ${u.active ? 'hover:bg-destructive/10 text-destructive' : 'hover:bg-green-50 text-green-600'}`}>
                        {u.active ? 'Деактивувати' : 'Активувати'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
