import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useProduct } from '@/hooks/useProducts';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ChevronRight, CheckCircle, XCircle, Loader2, Minus, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useState } from 'react';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-orange" size={32} /></main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Товар не знайдено</p></main>
        <Footer />
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category_id);
  const productBrands = brands.filter(b => (product.brand_ids || []).includes(b.id));

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`Додано ${qty} шт. в кошик`);
    setQty(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Головна</Link>
            <ChevronRight size={14} />
            <Link to="/catalog" className="hover:text-foreground transition-colors">Каталог</Link>
            {category && (
              <>
                <ChevronRight size={14} />
                <Link to={`/catalog?category=${encodeURIComponent(category.name)}`} className="hover:text-foreground transition-colors">{category.name}</Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
                <img src={product.image_url || ''} alt={product.name} className="w-full h-full object-cover" />
                {product.is_sale && <Badge className="absolute top-4 left-4 bg-destructive text-accent-foreground border-0 text-sm px-3 py-1">Акція</Badge>}
                {product.is_new && !product.is_sale && <Badge className="absolute top-4 left-4 bg-orange text-accent-foreground border-0 text-sm px-3 py-1">Новинка</Badge>}
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-muted-foreground mb-1">Артикул: {product.sku}</p>
                {category && <p className="text-sm text-muted-foreground mb-1">Категорія: {category.name}</p>}
                {productBrands.length > 0 && <p className="text-sm text-muted-foreground mb-4">Сумісні марки: {productBrands.map(b => b.name).join(', ')}</p>}

                <div className="flex items-center gap-2 mb-4">
                  {product.in_stock ? (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle size={16} /> В наявності ({product.stock} шт.)</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-destructive font-medium"><XCircle size={16} /> Немає в наявності</span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground mb-6">{product.description}</p>

                <div className="mt-auto pt-6 border-t space-y-4">
                  <p className="text-3xl font-bold text-orange">{Number(product.price).toLocaleString()} ₴</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 border rounded-lg">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg">
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      disabled={!product.in_stock}
                      onClick={handleAdd}
                      className="flex-1 btn-orange py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={18} /> Додати в кошик
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
