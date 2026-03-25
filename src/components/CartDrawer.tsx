import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: Props) {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Увійдіть в акаунт для оформлення замовлення');
      return;
    }
    if (items.length === 0) return;
    onOpenChange(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag size={20} /> Кошик
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag size={48} className="text-muted-foreground mb-4" />
            <p className="font-medium mb-1">Кошик порожній</p>
            <p className="text-sm text-muted-foreground">Додайте товари з каталогу</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 mt-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-muted rounded-xl">
                  <img src={item.product.image_url || ''} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-md bg-background border flex items-center justify-center hover:bg-muted transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-md bg-background border flex items-center justify-center hover:bg-muted transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-orange">{(Number(item.product.price) * item.quantity).toLocaleString()} ₴</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)}
                    className="p-1 self-start text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Разом:</span>
                <span className="text-orange">{totalPrice.toLocaleString()} ₴</span>
              </div>
              <button onClick={handleCheckout} className="w-full btn-orange py-3 rounded-lg text-sm font-medium">
                Оформити замовлення
              </button>
              <button onClick={clearCart} className="w-full py-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                Очистити кошик
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
