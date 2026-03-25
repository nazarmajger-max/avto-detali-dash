import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfiles, useUpdateUserRole } from '@/hooks/useProfiles';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { data: profiles = [], isLoading } = useProfiles();
  const updateRole = useUpdateUserRole();

  const toggleRole = async (userId: string, currentRole: string) => {
    if (userId === currentUser?.id) { toast.error('Не можна змінити власну роль'); return; }
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await updateRole.mutateAsync({ userId, role: newRole as 'admin' | 'customer' });
      toast.success('Роль змінено');
    } catch { toast.error('Помилка зміни ролі'); }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Користувачі</h1>

      {profiles.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-lg font-medium mb-2">Користувачів ще немає</p>
          <p className="text-sm text-muted-foreground">Зареєстровані користувачі з'являться тут</p>
        </div>
      ) : (
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
                {profiles.map((u: any) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{u.full_name || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={`border-0 ${u.role === 'admin' ? 'bg-orange-light text-orange' : 'bg-blue-50 text-blue-600'}`}>
                        {u.role === 'admin' ? 'Адмін' : 'Покупець'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(u.created_at || '').toLocaleDateString('uk-UA')}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        disabled={u.id === currentUser?.id}
                        className="px-2 py-1 border rounded text-xs hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {u.role === 'admin' ? '→ Покупець' : '→ Адмін'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
