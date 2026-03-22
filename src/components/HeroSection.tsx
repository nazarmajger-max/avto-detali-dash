import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export function HeroSection() {
  const [searchMode, setSearchMode] = useState<'vin' | 'select'>('vin');

  return (
    <section className="hero-gradient text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 fade-up" style={{ lineHeight: '1.15' }}>
          Запчастини для будь-якого авто
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 fade-up stagger-1">
          Більше 500 000 позицій в наявності
        </p>

        <div className="max-w-3xl mx-auto fade-up stagger-2">
          {/* Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setSearchMode('vin')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${searchMode === 'vin' ? 'bg-orange' : 'bg-white/10 hover:bg-white/15'}`}
            >
              Пошук за VIN-кодом
            </button>
            <button
              onClick={() => setSearchMode('select')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${searchMode === 'select' ? 'bg-orange' : 'bg-white/10 hover:bg-white/15'}`}
            >
              Підбір за параметрами
            </button>
          </div>

          {searchMode === 'vin' ? (
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Введіть VIN-код автомобіля..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange text-sm"
                />
              </div>
              <button className="btn-orange px-6 rounded-lg text-sm whitespace-nowrap">
                Знайти запчастини
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Марка', 'Модель', 'Рік', 'Тип двигуна'].map(label => (
                <div key={label} className="relative">
                  <select className="w-full appearance-none bg-white text-foreground px-4 py-3.5 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange">
                    <option>{label}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                </div>
              ))}
              <button className="btn-orange rounded-lg text-sm">Підібрати</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
