
import React from 'react';

interface NavbarProps {
  onCartOpen: () => void;
  cartCount: number;
  onSearch: (q: string) => void;
  onAdminOpen: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartOpen, cartCount, onSearch, onAdminOpen, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-solid border-b-border-dark bg-[#141118]/90 backdrop-blur-md px-4 md:px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-white cursor-pointer" onClick={onHomeClick}>
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined text-3xl">spa</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">Redfragances</h2>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={onHomeClick}
            className="text-white text-sm font-medium hover:text-primary transition-colors"
          >
            Inicio
          </button>
          <a className="text-primary text-sm font-bold" href="#productos">Descubrir</a>
          <button 
            onClick={onAdminOpen}
            className="text-white text-sm font-medium hover:text-primary transition-colors"
          >
            Admin
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg ring-1 ring-border-dark focus-within:ring-primary transition-all">
            <div className="text-text-secondary flex bg-surface-dark items-center justify-center pl-4 rounded-l-lg">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input 
              className="form-input w-full border-none bg-surface-dark text-white text-sm focus:ring-0 placeholder:text-text-secondary px-4 pl-2 rounded-r-lg" 
              placeholder="Buscar perfume..." 
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </label>
        
        <div className="flex gap-2">
          <button 
            onClick={onCartOpen}
            className="relative flex items-center justify-center rounded-lg h-10 w-10 bg-surface-dark hover:bg-border-dark text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={onAdminOpen}
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-surface-dark hover:bg-border-dark text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
