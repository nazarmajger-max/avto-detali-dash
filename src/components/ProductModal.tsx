import React from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <Badge className={`absolute top-3 left-3 ${product.badge === 'sale' ? 'bg-destructive' : 'bg-orange'} text-accent-foreground border-0`}>
                {product.badge === 'sale' ? 'Акція' : 'Новинка'}
              </Badge>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground mb-1">Артикул: {product.sku}</p>
            <p className="text-sm text-muted-foreground mb-1">Категорія: {product.category}</p>
            <p className="text-sm text-muted-foreground mb-4">Марки: {product.brands.join(', ')}</p>
            
            <p className="text-sm leading-relaxed mb-4 text-muted-foreground">{product.description}</p>

            <div className="flex items-center gap-2 mb-2">
              {product.available ? (
                <span className="flex items-center gap-1.5 text-sm text-green-600"><CheckCircle size={16} /> В наявності ({product.stock} шт.)</span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-destructive"><XCircle size={16} /> Немає в наявності</span>
              )}
            </div>

            <div className="mt-auto pt-4 border-t">
              <p className="text-2xl font-bold text-orange mb-4">{product.price.toLocaleString()} ₴</p>
              <button
                disabled={!product.available}
                onClick={() => { addToCart(product); toast.success('Додано в кошик'); }}
                className="w-full btn-orange py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                Додати в кошик
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
