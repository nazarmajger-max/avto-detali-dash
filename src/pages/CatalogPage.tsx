import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { ShoppingCart, Search, SlidersHorizontal, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ProductModal } from '@/components/ProductModal';

const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const { products, brands, categories } = useStore();
  const { addToCart } = useCart();

  const initialBrand = searchParams.get('brand') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';

  const [search, setSearch] = useState(initialSearch);
  const [filterBrand, setFilterBrand] = useState(initialBrand);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchBrand = !filterBrand || p.brands.includes(filterBrand);
      const matchCat = !filterCategory || p.category === filterCategory;
      const matchAvail = !filterAvailable || p.available;
      return matchSearch && matchBrand && matchCat && matchAvail;
    });
  }, [products, search, filterBrand, filterCategory, filterAvailable]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Каталог запчастин
            {filterBrand && <span className="text-orange ml-2">— {filterBrand}</span>}
            {filterCategory && <span className="text-orange ml-2">— {filterCategory}</span>}
          </h1>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Пошук</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Назва або артикул..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
              </div>
            </div>
            <div className="min-w-[160px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Марка авто</label>
              <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange">
                <option value="">Всі марки</option>
                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Категорія</label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange">
                <option value="">Всі категорії</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer pb-0.5">
              <input type="checkbox" checked={filterAvailable} onChange={e => setFilterAvailable(e.target.checked)} className="accent-orange" />
              В наявності
            </label>
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground mb-4">Знайдено: {filtered.length} товарів</p>

          {filtered.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <SlidersHorizontal size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Товарів не знайдено</p>
              <p className="text-sm text-muted-foreground">Спробуйте змінити параметри фільтрації</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(product => (
                <div key={product.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
                  <div className="relative aspect-square bg-muted overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    {product.badge && (
                      <Badge className={`absolute top-3 left-3 ${product.badge === 'sale' ? 'bg-destructive' : 'bg-orange'} text-accent-foreground border-0 text-xs`}>
                        {product.badge === 'sale' ? 'Акція' : 'Новинка'}
                      </Badge>
                    )}
                    {!product.available && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="text-sm font-medium text-muted-foreground">Немає в наявності</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/10 transition-colors">
                      <Eye size={32} className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.sku}</p>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-orange transition-colors" onClick={() => setSelectedProduct(product)}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{product.category} · {product.brands.join(', ')}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange">{product.price.toLocaleString()} ₴</span>
                      <button
                        disabled={!product.available}
                        onClick={() => { addToCart(product); toast.success('Додано в кошик'); }}
                        className="btn-orange px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={14} />
                        В кошик
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default CatalogPage;
