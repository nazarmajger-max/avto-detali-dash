export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  registeredAt: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brands: string[];
  price: number;
  stock: number;
  description: string;
  image: string;
  available: boolean;
  badge?: 'sale' | 'new';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Новий' | 'В обробці' | 'Відправлено' | 'Доставлено' | 'Скасовано';
  address: string;
}

export interface CarBrand {
  id: string;
  name: string;
  logo: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  footerDescription: string;
}
