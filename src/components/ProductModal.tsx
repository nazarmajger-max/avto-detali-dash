import React from 'react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const { addToCart } = useCart();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  if (!product) return null;

  const category = categories.find(c => c.id === product.category_id);
  const productBrands = brands.filter(b => (product.brand_ids || []).includes(b.id));

  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
            <img src={product.image_url || ''} alt={product.name} className="w-full h-full object-cover" />
            {product.is_sale && <Badge className="absolute top-3 left-3 bg-destructive text-accent-foreground border-0">Акція</Badge>}
            {product.is_new && !product.is_sale && <Badge className="absolute top-3 left-3 bg-orange text-accent-foreground border-0">Новинка</Badge>}
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground mb-1">Артикул: {product.sku}</p>
            {category && <p className="text-sm text-muted-foreground mb-1">Категорія: {category.name}</p>}
            {productBrands.length > 0 && <p className="text-sm text-muted-foreground mb-4">Марки: {productBrands.map(b => b.name).join(', ')}</p>}
            <p className="text-sm leading-relaxed mb-4 text-muted-foreground">{product.description}</p>
            <div className="flex items-center gap-2 mb-2">
              {product.in_stock ? (
                <span className="flex items-center gap-1.5 text-sm text-green-600"><CheckCircle size={16} /> В наявності ({product.stock} шт.)</span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-destructive"><XCircle size={16} /> Немає в наявності</span>
              )}
            </div>
            <div className="mt-auto pt-4 border-t">
              <p className="text-2xl font-bold text-orange mb-4">{Number(product.price).toLocaleString()} ₴</p>
              <button
                disabled={!product.in_stock}
                onClick={() => { addToCart(product); toast.success('Додано в кошик'); }}
                className="w-full btn-orange py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} /> Додати в кошик
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
