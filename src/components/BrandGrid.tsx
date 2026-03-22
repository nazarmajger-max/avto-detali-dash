import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

export function BrandGrid() {
  const { brands } = useStore();
  const navigate = useNavigate();

  return (
    <section id="brands" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Оберіть марку автомобіля</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => navigate(`/catalog?brand=${encodeURIComponent(brand.name)}`)}
              className="bg-card rounded-xl p-6 flex flex-col items-center gap-3 card-hover border-2 border-transparent hover:border-orange cursor-pointer group"
            >
              <span className="text-3xl">{brand.logo}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-orange transition-colors">{brand.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
