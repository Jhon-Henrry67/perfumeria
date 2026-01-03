
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product, size: string) => void;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    onAddToCart(product, size);
    setShowSizePicker(false);
  };

  const defaultImg = "https://images.unsplash.com/photo-1588405864443-f11149882935?auto=format&fit=crop&q=80&w=800";

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col bg-surface-dark rounded-xl overflow-hidden border border-border-dark hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5 cursor-pointer"
    >
      {/* Insignias */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-lg">Nuevo</span>
        )}
        {product.discountPrice && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1 shadow-lg">
            <span className="material-symbols-outlined text-[12px]">sell</span>
            Oferta
          </span>
        )}
      </div>

      <div className="relative w-full aspect-[4/5] bg-[#1a1620] overflow-hidden flex items-center justify-center">
        <img 
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imgError ? 'opacity-50 blur-sm' : ''}`}
          src={imgError ? defaultImg : product.image} 
          alt={product.name}
          onError={() => setImgError(true)}
        />
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
             <span className="material-symbols-outlined text-4xl text-primary/50 mb-2">image_not_supported</span>
             <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Fragancia Premium</p>
          </div>
        )}
        
        {/* Overlay de añadir rápido */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
          {!showSizePicker ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowSizePicker(true);
              }}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              Añadir rápido
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-fade-in-up w-full px-4">
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">¿Qué tamaño deseas?</p>
              <div className="grid grid-cols-2 gap-2 w-full">
                {['30ml', '50ml', '100ml', '200ml'].map(size => (
                  <button
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    className="bg-white/10 hover:bg-primary text-white text-xs font-bold py-2 px-3 rounded-lg border border-white/20 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSizePicker(false); }}
                className="mt-2 text-white/50 hover:text-white text-[10px] uppercase font-bold"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">{product.brand}</p>
        <div className="flex justify-between items-start mt-0.5">
          <h3 className="text-white text-base md:text-lg font-bold group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex flex-col items-end">
            {product.discountPrice ? (
              <>
                <p className="text-red-400 font-black">${product.discountPrice.toLocaleString()}</p>
                <p className="text-text-secondary text-[10px] line-through">${product.price.toLocaleString()}</p>
              </>
            ) : (
              <p className="text-white font-black">${product.price.toLocaleString()}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`material-symbols-outlined text-[14px] ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-border-dark'}`}>
                star
              </span>
            ))}
          </div>
          <span className="text-text-secondary text-[10px] font-medium">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
