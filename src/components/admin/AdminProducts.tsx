import React, { useState, useMemo } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Search, Loader2, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const emptyForm = {
  name: '', sku: '', category_id: '', brand_ids: [] as string[], price: 0, stock: 0,
  description: '', image_url: 'https://picsum.photos/seed/new/400/400',
  in_stock: true, is_sale: false, is_new: false,
};

export function AdminProducts() {
  const { data: products = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name, sku: p.sku, category_id: p.category_id || '',
      brand_ids: p.brand_ids || [], price: Number(p.price), stock: p.stock,
      description: p.description || '', image_url: p.image_url || '',
      in_stock: p.in_stock ?? true, is_sale: p.is_sale ?? false, is_new: p.is_new ?? false,
    });
    setModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) { toast.error('Помилка завантаження'); setUploading(false); return; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    setForm({ ...form, image_url: data.publicUrl });
    setUploading(false);
    toast.success('Зображення завантажено');
  };

  const handleSave = async () => {
    if (!form.name || !form.sku) { toast.error('Заповніть обовʼязкові поля'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, ...form });
        toast.success('Товар оновлено');
      } else {
        await createProduct.mutateAsync(form);
        toast.success('Товар додано');
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Помилка');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Товар видалено');
    } catch { toast.error('Помилка видалення'); }
    setDeleteConfirm(null);
  };

  const toggleBrand = (brandId: string) => {
    setForm(f => ({
      ...f,
      brand_ids: f.brand_ids.includes(brandId) ? f.brand_ids.filter(b => b !== brandId) : [...f.brand_ids, brandId],
    }));
  };

  const filtered = useMemo(() => products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category_id === filterCat;
    return matchSearch && matchCat;
  }), [products, search, filterCat]);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Товари</h1>
        <button onClick={openAdd} className="btn-orange px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus size={16} /> Додати товар
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук товарів..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-orange" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-orange">
          <option value="">Всі категорії</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-lg font-medium mb-2">Товарів ще немає</p>
          <p className="text-sm text-muted-foreground">Додайте перший товар</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left px-4 py-3 font-medium">Фото</th>
                  <th className="text-left px-4 py-3 font-medium">Назва</th>
                  <th className="text-left px-4 py-3 font-medium">Артикул</th>
                  <th className="text-left px-4 py-3 font-medium">Категорія</th>
                  <th className="text-left px-4 py-3 font-medium">Ціна (₴)</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const cat = categories.find(c => c.id === p.category_id);
                  return (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3"><img src={p.image_url || ''} alt="" className="w-10 h-10 rounded object-cover" /></td>
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                      <td className="px-4 py-3">{cat?.name || '—'}</td>
                      <td className="px-4 py-3 font-semibold">{Number(p.price).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.in_stock ? 'default' : 'secondary'} className={p.in_stock ? 'bg-green-100 text-green-700 border-0' : ''}>
                          {p.in_stock ? 'В наявності' : 'Немає'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product form modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редагувати товар' : 'Додати товар'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Назва товару *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Артикул (SKU) *</label>
                <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Категорія</label>
                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange">
                  <option value="">Оберіть</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Сумісні марки авто</label>
              <div className="flex flex-wrap gap-2">
                {brands.map(b => (
                  <label key={b.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" checked={form.brand_ids.includes(b.id)} onChange={() => toggleBrand(b.id)} className="accent-orange" />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Ціна (₴)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Кількість на складі</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Зображення</label>
              <div className="flex gap-2">
                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="URL або завантажте файл"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
                <label className="btn-orange px-3 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Опис</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange resize-none" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} className="accent-orange" />
                В наявності
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_sale} onChange={e => setForm({ ...form, is_sale: e.target.checked })} className="accent-orange" />
                Акція
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_new} onChange={e => setForm({ ...form, is_new: e.target.checked })} className="accent-orange" />
                Новинка
              </label>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full btn-orange py-2.5 rounded-lg text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingId ? 'Зберегти зміни' : 'Додати товар'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Видалити товар?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Ця дія є незворотною.</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">Скасувати</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">Видалити</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
