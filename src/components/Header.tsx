import React, { useState } from 'react';
import { Search, ShoppingCart, Phone, User, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { CartDrawer } from '@/components/CartDrawer';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Бренди', href: '/#brands' },
  { label: 'Акції', href: '/catalog?badge=sale' },
  { label: 'Доставка', href: '/#delivery' },
  { label: 'Контакти', href: '/#contacts' },
];

export function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md">
        <div className="nav-gradient">
          <div className="container mx-auto px-4 py-3 flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">АД</span>
              </div>
              <span className="text-primary-foreground font-bold text-xl hidden sm:block">АвтоДеталі</span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Пошук запчастин за артикулом або назвою..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange text-sm"
                />
              </div>
            </form>

            <div className="flex items-center gap-3 shrink-0">
              <a href="tel:+380441234567" className="hidden md:flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                <Phone size={16} />
                <span>+380 (44) 123-45-67</span>
              </a>

              <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors px-2 py-1.5">
                <ShoppingCart size={20} />
                <span className="hidden sm:inline text-sm">Кошик</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange text-[11px] font-bold flex items-center justify-center text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors px-2 py-1.5"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline text-sm max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-xl border py-1 z-50">
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors">
                          <User size={15} /> Профіль
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors">
                          <Package size={15} /> Мої замовлення
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => { navigate('/admin'); setDropdownOpen(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-orange transition-colors"
                          >
                            <Settings size={15} /> Адмін-панель
                          </button>
                        )}
                        <hr className="my-1 border-border" />
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive transition-colors"
                        >
                          <LogOut size={15} /> Вийти
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="btn-orange px-4 py-2 rounded-lg text-sm"
                >
                  Увійти
                </button>
              )}
            </div>
          </div>

          <nav className="border-t border-white/10">
            <div className="container mx-auto px-4 flex gap-1 overflow-x-auto">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-2.5 text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/5 rounded-t-md transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
