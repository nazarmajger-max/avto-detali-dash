import React, { useState } from 'react';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/hooks/useBrands';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function AdminBrandsCategories() {
  const { data: brands = [], isLoading: bLoading } = useBrands();
  const { data: categories = [], isLoading: cLoading } = useCategories();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const [brandModal, setBrandModal] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<{ id?: string; name: string; logo_url: string }>({ name: '', logo_url: '🚗' });
  const [editingCat, setEditingCat] = useState<{ id?: string; name: string; icon: string }>({ name: '', icon: 'engine' });
  const [saving, setSaving] = useState(false);

  const saveBrand = async () => {
    if (!editingBrand.name) return;
    setSaving(true);
    try {
      if (editingBrand.id) {
        await updateBrand.mutateAsync({ id: editingBrand.id, name: editingBrand.name, logo_url: editingBrand.logo_url });
      } else {
        await createBrand.mutateAsync({ name: editingBrand.name, logo_url: editingBrand.logo_url });
      }
      setBrandModal(false);
      toast.success('Збережено');
    } catch { toast.error('Помилка'); }
    setSaving(false);
  };

  const saveCat = async () => {
    if (!editingCat.name) return;
    setSaving(true);
    try {
      if (editingCat.id) {
        await updateCat.mutateAsync({ id: editingCat.id, name: editingCat.name, icon: editingCat.icon });
      } else {
        await createCat.mutateAsync({ name: editingCat.name, icon: editingCat.icon });
      }
      setCatModal(false);
      toast.success('Збережено');
    } catch { toast.error('Помилка'); }
    setSaving(false);
  };

  const handleDeleteBrand = async (id: string) => {
    try { await deleteBrand.mutateAsync(id); toast.success('Видалено'); }
    catch { toast.error('Помилка видалення'); }
  };

  const handleDeleteCat = async (id: string) => {
    try { await deleteCat.mutateAsync(id); toast.success('Видалено'); }
    catch { toast.error('Помилка видалення'); }
  };

  if (bLoading || cLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Марки та категорії</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Марки авто</h2>
            <button onClick={() => { setEditingBrand({ name: '', logo_url: '🚗' }); setBrandModal(true); }} className="btn-orange px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Plus size={14} /> Додати
            </button>
          </div>
          {brands.length === 0 ? (
            <p className="text-sm text-muted-foreground">Марок ще немає — додайте першу</p>
          ) : (
            <div className="space-y-2">
              {brands.map(b => (
                <div key={b.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2"><span>{b.logo_url}</span><span className="text-sm">{b.name}</span></div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingBrand({ id: b.id, name: b.name, logo_url: b.logo_url || '🚗' }); setBrandModal(true); }} className="p-1 hover:bg-muted rounded"><Pencil size={14} /></button>
                    <button onClick={() => handleDeleteBrand(b.id)} className="p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Категорії запчастин</h2>
            <button onClick={() => { setEditingCat({ name: '', icon: 'engine' }); setCatModal(true); }} className="btn-orange px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Plus size={14} /> Додати
            </button>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Категорій ще немає — додайте першу</p>
          ) : (
            <div className="space-y-2">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-sm">{c.name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingCat({ id: c.id, name: c.name, icon: c.icon || 'engine' }); setCatModal(true); }} className="p-1 hover:bg-muted rounded"><Pencil size={14} /></button>
                    <button onClick={() => handleDeleteCat(c.id)} className="p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={brandModal} onOpenChange={setBrandModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{editingBrand.id ? 'Редагувати марку' : 'Додати марку'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input value={editingBrand.name} onChange={e => setEditingBrand({ ...editingBrand, name: e.target.value })} placeholder="Назва марки"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            <input value={editingBrand.logo_url} onChange={e => setEditingBrand({ ...editingBrand, logo_url: e.target.value })} placeholder="Емодзі або URL"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            <button onClick={saveBrand} disabled={saving} className="w-full btn-orange py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 size={14} className="animate-spin" />} Зберегти
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={catModal} onOpenChange={setCatModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{editingCat.id ? 'Редагувати категорію' : 'Додати категорію'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input value={editingCat.name} onChange={e => setEditingCat({ ...editingCat, name: e.target.value })} placeholder="Назва категорії"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            <button onClick={saveCat} disabled={saving} className="w-full btn-orange py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 size={14} className="animate-spin" />} Зберегти
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
