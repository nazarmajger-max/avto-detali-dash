import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function AdminBrandsCategories() {
  const { brands, setBrands, categories, setCategories } = useStore();
  const [brandModal, setBrandModal] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<{ id?: string; name: string; logo: string }>({ name: '', logo: '🚗' });
  const [editingCat, setEditingCat] = useState<{ id?: string; name: string; icon: string }>({ name: '', icon: 'engine' });

  const saveBrand = () => {
    if (!editingBrand.name) return;
    if (editingBrand.id) {
      setBrands(brands.map(b => b.id === editingBrand.id ? { ...b, name: editingBrand.name, logo: editingBrand.logo } : b));
    } else {
      setBrands([...brands, { id: String(Date.now()), name: editingBrand.name, logo: editingBrand.logo }]);
    }
    setBrandModal(false); toast.success('Збережено');
  };

  const saveCat = () => {
    if (!editingCat.name) return;
    if (editingCat.id) {
      setCategories(categories.map(c => c.id === editingCat.id ? { ...c, name: editingCat.name, icon: editingCat.icon } : c));
    } else {
      setCategories([...categories, { id: String(Date.now()), name: editingCat.name, icon: editingCat.icon }]);
    }
    setCatModal(false); toast.success('Збережено');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Марки та категорії</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brands */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Марки авто</h2>
            <button onClick={() => { setEditingBrand({ name: '', logo: '🚗' }); setBrandModal(true); }} className="btn-orange px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Plus size={14} /> Додати
            </button>
          </div>
          <div className="space-y-2">
            {brands.map(b => (
              <div key={b.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-2"><span>{b.logo}</span><span className="text-sm">{b.name}</span></div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingBrand(b); setBrandModal(true); }} className="p-1 hover:bg-muted rounded"><Pencil size={14} /></button>
                  <button onClick={() => { setBrands(brands.filter(x => x.id !== b.id)); toast.success('Видалено'); }} className="p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Категорії запчастин</h2>
            <button onClick={() => { setEditingCat({ name: '', icon: 'engine' }); setCatModal(true); }} className="btn-orange px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Plus size={14} /> Додати
            </button>
          </div>
          <div className="space-y-2">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <span className="text-sm">{c.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingCat(c); setCatModal(true); }} className="p-1 hover:bg-muted rounded"><Pencil size={14} /></button>
                  <button onClick={() => { setCategories(categories.filter(x => x.id !== c.id)); toast.success('Видалено'); }} className="p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand modal */}
      <Dialog open={brandModal} onOpenChange={setBrandModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{editingBrand.id ? 'Редагувати марку' : 'Додати марку'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input value={editingBrand.name} onChange={e => setEditingBrand({ ...editingBrand, name: e.target.value })} placeholder="Назва марки"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            <input value={editingBrand.logo} onChange={e => setEditingBrand({ ...editingBrand, logo: e.target.value })} placeholder="Емодзі"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            <button onClick={saveBrand} className="w-full btn-orange py-2 rounded-lg text-sm">Зберегти</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category modal */}
      <Dialog open={catModal} onOpenChange={setCatModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{editingCat.id ? 'Редагувати категорію' : 'Додати категорію'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input value={editingCat.name} onChange={e => setEditingCat({ ...editingCat, name: e.target.value })} placeholder="Назва категорії"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            <button onClick={saveCat} className="w-full btn-orange py-2 rounded-lg text-sm">Зберегти</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
