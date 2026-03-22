import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const emptyProduct: Omit<Product, 'id'> = {
  name: '', sku: '', category: '', brands: [], price: 0, stock: 0, description: '',
  image: 'https://picsum.photos/seed/new/400/400', available: true, badge: undefined,
};

export function AdminProducts() {
  const { products, setProducts, categories, brands } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.sku) { toast.error('Заповніть обовʼязкові поля'); return; }
    if (editing) {
      setProducts(products.map(p => p.id === editing.id ? { ...form, id: editing.id } as Product : p));
      toast.success('Товар оновлено');
    } else {
      setProducts([...products, { ...form, id: String(Date.now()) } as Product]);
      toast.success('Товар додано');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteConfirm(null);
    toast.success('Товар видалено');
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Товари</h1>
        <button onClick={openAdd} className="btn-orange px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus size={16} /> Додати товар
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук товарів..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-orange" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-orange">
          <option value="">Всі категорії</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
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
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3"><img src={p.image} alt="" className="w-10 h-10 rounded object-cover" /></td>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.available ? 'default' : 'secondary'} className={p.available ? 'bg-green-100 text-green-700 border-0' : ''}>
                      {p.available ? 'В наявності' : 'Немає'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product form modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Редагувати товар' : 'Додати товар'}</DialogTitle>
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
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange">
                  <option value="">Оберіть</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
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
              <label className="text-sm font-medium mb-1 block">Фото (URL)</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Опис</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange resize-none" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="accent-orange" />
                В наявності
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.badge === 'sale'} onChange={e => setForm({ ...form, badge: e.target.checked ? 'sale' : undefined })} className="accent-orange" />
                Акція
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.badge === 'new'} onChange={e => setForm({ ...form, badge: e.target.checked ? 'new' : form.badge === 'new' ? undefined : form.badge })} className="accent-orange" />
                Новинка
              </label>
            </div>
            <button onClick={handleSave} className="w-full btn-orange py-2.5 rounded-lg text-sm mt-2">
              {editing ? 'Зберегти зміни' : 'Додати товар'}
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
