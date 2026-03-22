import React from 'react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function FeaturedProducts() {
  const { products } = useStore();
  const { addToCart } = useCart();
  const featured = products.filter(p => p.badge).slice(0, 4);

  return (
    <section id="sale" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Акційні товари</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <div key={product.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                {product.badge && (
                  <Badge className={`absolute top-3 left-3 ${product.badge === 'sale' ? 'bg-destructive' : 'bg-orange'} text-accent-foreground border-0 text-xs`}>
                    {product.badge === 'sale' ? 'Акція' : 'Новинка'}
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{product.sku}</p>
                <h3 className="font-medium text-sm mb-3 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange">{product.price} ₴</span>
                  <button
                    onClick={() => { addToCart(product); toast.success('Додано в кошик'); }}
                    className="btn-orange px-3 py-2 rounded-lg text-xs flex items-center gap-1.5"
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
