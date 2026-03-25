import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function FeaturedProducts() {
  const { data: products = [] } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const featured = products.filter(p => p.is_sale || p.is_new).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section id="sale" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Акційні товари</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <div key={product.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
              <div className="relative aspect-square bg-muted overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image_url || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                {product.is_sale && (
                  <Badge className="absolute top-3 left-3 bg-destructive text-accent-foreground border-0 text-xs">Акція</Badge>
                )}
                {product.is_new && !product.is_sale && (
                  <Badge className="absolute top-3 left-3 bg-orange text-accent-foreground border-0 text-xs">Новинка</Badge>
                )}
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
                    <ShoppingCart size={14} />
                    В кошик
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
