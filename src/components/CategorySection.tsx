import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Cog, Disc, Car, Filter, Boxes, Zap, Settings, Thermometer } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  engine: Cog, brake: Disc, suspension: Car, filter: Filter,
  body: Boxes, electric: Zap, transmission: Settings, cooling: Thermometer,
};

export function CategorySection() {
  const { data: categories = [] } = useCategories();
  const navigate = useNavigate();

  return (
    <section id="catalog" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Категорії запчастин</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(cat => {
            const Icon = iconMap[cat.icon || ''] || Cog;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/catalog?category=${encodeURIComponent(cat.name)}`)}
                className="bg-card rounded-xl p-6 flex flex-col items-center gap-3 card-hover border border-border hover:border-orange cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-orange-light flex items-center justify-center group-hover:bg-orange transition-colors">
                  <Icon size={24} className="text-orange group-hover:text-accent-foreground transition-colors" />
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
