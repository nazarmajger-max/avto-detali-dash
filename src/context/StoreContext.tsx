import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CarBrand, Category, Order, StoreSettings } from '@/types';
import { defaultProducts, defaultBrands, defaultCategories, defaultOrders, defaultSettings } from '@/data/mock-data';

interface StoreContextType {
  products: Product[];
  brands: CarBrand[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  setProducts: (p: Product[]) => void;
  setBrands: (b: CarBrand[]) => void;
  setCategories: (c: Category[]) => void;
  setOrders: (o: Order[]) => void;
  setSettings: (s: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('avtodetal_products', defaultProducts));
  const [brands, setBrands] = useState<CarBrand[]>(() => loadFromStorage('avtodetal_brands', defaultBrands));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('avtodetal_categories', defaultCategories));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('avtodetal_orders', defaultOrders));
  const [settings, setSettings] = useState<StoreSettings>(() => loadFromStorage('avtodetal_settings', defaultSettings));

  useEffect(() => { localStorage.setItem('avtodetal_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('avtodetal_brands', JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem('avtodetal_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('avtodetal_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('avtodetal_settings', JSON.stringify(settings)); }, [settings]);

  return (
    <StoreContext.Provider value={{ products, brands, categories, orders, settings, setProducts, setBrands, setCategories, setOrders, setSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
