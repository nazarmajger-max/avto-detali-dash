import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { defaultUsers } from '@/data/mock-data';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUsers: (users: User[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('avtodetal_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('avtodetal_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  useEffect(() => {
    if (user) localStorage.setItem('avtodetal_user', JSON.stringify(user));
    else localStorage.removeItem('avtodetal_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('avtodetal_users', JSON.stringify(users));
  }, [users]);

  const login = (email: string, password: string): boolean => {
    if (email === 'admin@avtodetal.ua' && password === 'admin123') {
      const adminUser = users.find(u => u.email === 'admin@avtodetal.ua');
      if (adminUser) { setUser(adminUser); return true; }
    }
    const found = users.find(u => u.email === email && u.active);
    if (found) { setUser(found); return true; }
    return false;
  };

  const register = (name: string, email: string, _password: string): boolean => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      role: 'admin',
      registeredAt: new Date().toISOString().split('T')[0],
      active: true,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);
  const updateUsers = (u: User[]) => setUsers(u);

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, updateUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
