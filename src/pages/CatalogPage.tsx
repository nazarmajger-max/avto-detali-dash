import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search, SlidersHorizontal, Eye, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const initialBrand = searchParams.get('brand') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const toggleFilter = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchBrand = selectedBrands.length === 0 || (p.brand_ids || []).some(bid => {
        const brand = brands.find(b => b.id === bid);
        return brand && selectedBrands.includes(brand.name);
      });
      const matchCat = selectedCategories.length === 0 || (() => {
        const cat = categories.find(c => c.id === p.category_id);
        return cat && selectedCategories.includes(cat.name);
      })();
      const matchAvail = !filterAvailable || p.in_stock;
      const matchPrice = Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1];
      return matchSearch && matchBrand && matchCat && matchAvail && matchPrice;
    });
  }, [products, search, selectedBrands, selectedCategories, filterAvailable, priceRange, brands, categories]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Каталог запчастин</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside className="bg-card rounded-xl border border-border p-5 h-fit space-y-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Пошук</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Назва або артикул..."
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Марка авто</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {brands.map(b => (
                    <label key={b.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedBrands.includes(b.name)} onChange={() => setSelectedBrands(toggleFilter(selectedBrands, b.name))} className="accent-orange" />
                      {b.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Категорія</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {categories.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedCategories.includes(c.name)} onChange={() => setSelectedCategories(toggleFilter(selectedCategories, c.name))} className="accent-orange" />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Ціна (₴)</p>
                <div className="flex gap-2">
                  <input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} placeholder="Від"
                    className="w-full px-2 py-1.5 border rounded text-xs bg-background" />
                  <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} placeholder="До"
                    className="w-full px-2 py-1.5 border rounded text-xs bg-background" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={filterAvailable} onChange={e => setFilterAvailable(e.target.checked)} className="accent-orange" />
                Тільки в наявності
              </label>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <p className="text-sm text-muted-foreground mb-4">Знайдено: {filtered.length} товарів</p>

              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>
              ) : filtered.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <SlidersHorizontal size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Товарів не знайдено</p>
                  <p className="text-sm text-muted-foreground">Спробуйте змінити параметри фільтрації</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map(product => (
                    <div key={product.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
                      <div className="relative aspect-square bg-muted overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                        <img src={product.image_url || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        {product.is_sale && <Badge className="absolute top-3 left-3 bg-destructive text-accent-foreground border-0 text-xs">Акція</Badge>}
                        {product.is_new && !product.is_sale && <Badge className="absolute top-3 left-3 bg-orange text-accent-foreground border-0 text-xs">Новинка</Badge>}
                        {!product.in_stock && (
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
                        <h3 className="font-medium text-sm mb-3 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-orange transition-colors" onClick={() => navigate(`/product/${product.id}`)}>
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-orange">{Number(product.price).toLocaleString()} ₴</span>
                          <button
                            disabled={!product.in_stock}
                            onClick={() => { addToCart(product); toast.success('Додано в кошик'); }}
                            className="btn-orange px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={14} /> В кошик
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CatalogPage;
