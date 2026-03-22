import React from 'react';
import { Navigate, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { LayoutDashboard, Package, Car, ShoppingCart, Users, Settings, ChevronRight, LogOut } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminBrandsCategories } from '@/components/admin/AdminBrandsCategories';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminSettings } from '@/components/admin/AdminSettings';

const sidebarLinks = [
  { label: 'Дашборд', icon: LayoutDashboard, path: '/admin' },
  { label: 'Товари', icon: Package, path: '/admin/products' },
  { label: 'Марки та категорії', icon: Car, path: '/admin/brands' },
  { label: 'Замовлення', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Користувачі', icon: Users, path: '/admin/users' },
  { label: 'Налаштування', icon: Settings, path: '/admin/settings' },
];

const AdminPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    toast.error('Доступ заборонено. Тільки для адміністраторів.');
    return <Navigate to="/" replace />;
  }

  const currentLabel = sidebarLinks.find(l => l.path === location.pathname)?.label || 'Дашборд';

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className="w-64 nav-gradient flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">АД</span>
            </div>
            <span className="text-primary-foreground font-bold">Адмін-панель</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-sidebar-accent text-accent-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <link.icon size={18} className={active ? 'text-orange' : ''} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
          >
            <LogOut size={18} /> Вийти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b px-6 py-4 flex items-center gap-2 text-sm">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Адмін</Link>
          <ChevronRight size={14} className="text-muted-foreground" />
          <span className="font-medium">{currentLabel}</span>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="brands" element={<AdminBrandsCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
