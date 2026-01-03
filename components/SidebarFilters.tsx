
import React from 'react';

interface SidebarFiltersProps {
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFamilies: string[];
  setSelectedFamilies: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedBrands, setSelectedBrands,
  selectedFamilies, setSelectedFamilies,
  priceRange, setPriceRange
}) => {
  const brands = ['Tom Ford', 'Le Labo', 'Chanel', 'Byredo', 'Jo Malone', 'Dior'];
  const families = ['Amaderado', 'Floral', 'Cítrico', 'Oriental', 'Fresco'];

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleFamily = (family: string) => {
    setSelectedFamilies(prev => prev.includes(family) ? prev.filter(f => f !== family) : [...prev, family]);
  };

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedFamilies([]);
    setPriceRange([0, 500]);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-bold">Filtros</h3>
        <button 
          onClick={clearAll}
          className="text-xs text-primary hover:text-white underline transition-colors font-bold"
        >
          Limpiar Todo
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Marcas */}
        <section>
          <h4 className="text-white text-sm font-bold mb-4 flex justify-between items-center group cursor-pointer">
            Marcas
            <span className="material-symbols-outlined text-text-secondary text-sm group-hover:text-primary transition-colors">expand_more</span>
          </h4>
          <div className="flex flex-col gap-3">
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="peer appearance-none w-4 h-4 border border-border-dark rounded bg-surface-dark checked:bg-primary checked:border-primary transition-all"
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                  </span>
                </div>
                <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-white font-medium' : 'text-text-secondary group-hover:text-white'}`}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Familia Olfativa */}
        <section>
          <h4 className="text-white text-sm font-bold mb-4 flex justify-between items-center group cursor-pointer">
            Familia Olfativa
            <span className="material-symbols-outlined text-text-secondary text-sm group-hover:text-primary transition-colors">expand_more</span>
          </h4>
          <div className="flex flex-col gap-3">
            {families.map(family => (
              <label key={family} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedFamilies.includes(family)}
                    onChange={() => toggleFamily(family)}
                    className="peer appearance-none w-4 h-4 border border-border-dark rounded bg-surface-dark checked:bg-primary checked:border-primary transition-all"
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                  </span>
                </div>
                <span className={`text-sm transition-colors ${selectedFamilies.includes(family) ? 'text-white font-medium' : 'text-text-secondary group-hover:text-white'}`}>
                  {family}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Precio - Diseño llamativo solicitado */}
        <section className="relative overflow-hidden p-0.5 rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-indigo-600 shadow-xl shadow-primary/10">
          <div className="bg-surface-dark p-5 rounded-[calc(1rem-2px)] flex flex-col gap-4">
            <h4 className="text-white text-sm font-black uppercase tracking-widest">Rango de Precio</h4>
            
            <div className="relative pt-2">
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-background-dark rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between mt-6 items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-secondary font-bold uppercase mb-1">Desde</span>
                  <span className="text-white font-black">$0</span>
                </div>
                
                <div className="bg-white text-background-dark px-4 py-2 rounded-xl border-2 border-primary shadow-[0_0_20px_rgba(255,255,255,0.2)] transform hover:scale-105 transition-transform">
                  <span className="text-[10px] block font-black uppercase leading-none mb-1 text-primary">Hasta</span>
                  <span className="text-xl font-black tabular-nums">${priceRange[1]}<span className="text-xs">+</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default SidebarFilters;
