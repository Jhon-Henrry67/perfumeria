
import React, { useState } from 'react';
import { Product, SizePrice } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product, size: string, price: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('50ml');
  
  // Tamaños por defecto y sus multiplicadores por si no hay precios específicos
  const sizeConfig = [
    { label: '30ml', multiplier: 0.7 },
    { label: '50ml', multiplier: 1.0 },
    { label: '100ml', multiplier: 1.6 },
    { label: '200ml', multiplier: 2.8 }
  ];

  // Buscar si hay un precio específico definido por el admin para el tamaño seleccionado
  const specificSize = product.sizePrices?.find(s => s.size === selectedSize);
  
  let currentPrice: number;
  let originalPrice: number | null = null;

  if (specificSize && specificSize.price > 0) {
    currentPrice = specificSize.discountPrice || specificSize.price;
    originalPrice = specificSize.discountPrice ? specificSize.price : null;
  } else {
    // Fallback al cálculo por multiplicador si no hay precio específico
    const basePrice = product.discountPrice || product.price;
    const multiplier = sizeConfig.find(s => s.label === selectedSize)?.multiplier || 1;
    currentPrice = Math.round(basePrice * multiplier);
    originalPrice = product.discountPrice ? Math.round(product.price * multiplier) : null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-surface-dark rounded-2xl overflow-hidden shadow-2xl border border-border-dark animate-fade-in-up flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background-dark/80 flex items-center justify-center hover:bg-primary transition-colors"
        >
          <span className="material-symbols-outlined text-white">close</span>
        </button>

        <div className="w-full md:w-1/2 bg-[#1a1620] relative aspect-square md:aspect-auto">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          {originalPrice && (
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-red-500 text-white text-xs font-black px-4 py-2 rounded-lg shadow-xl uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">sell</span>
                Oferta Especial
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-dark to-transparent">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">{product.brand}</span>
            <h2 className="text-3xl font-black text-white">{product.name}</h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">
                {product.family}
              </span>
              <div className="flex items-center ml-auto">
                <span className="material-symbols-outlined text-yellow-500 fill-current text-sm">star</span>
                <span className="text-white text-sm font-bold ml-1">{product.rating}</span>
                <span className="text-text-secondary text-xs ml-1">({product.reviewCount} reseñas)</span>
              </div>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed mb-8 italic">
              "{product.description || 'Una fragancia única de nuestra colección exclusiva.'}"
            </p>

            <div className="mb-8">
              <h4 className="text-white font-bold text-sm mb-4">Seleccionar Tamaño</h4>
              <div className="grid grid-cols-4 gap-2">
                {sizeConfig.map(size => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === size.label 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-background-dark border-border-dark text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="text-white font-bold text-sm">Notas Olfativas</h4>
              <div className="flex flex-wrap gap-2">
                {product.notes && product.notes.length > 0 ? product.notes.map(note => (
                  <span key={note} className="bg-surface-dark border border-border-dark text-text-secondary text-[11px] px-3 py-1.5 rounded-lg">
                    {note}
                  </span>
                )) : <span className="text-text-secondary text-xs">No hay notas registradas.</span>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border-dark mt-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-text-secondary text-xs uppercase font-bold tracking-tighter mb-1">Precio Final ({selectedSize})</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">${currentPrice.toLocaleString()}</span>
                  {originalPrice && (
                    <span className="text-text-secondary text-base line-through font-bold">${originalPrice.toLocaleString()}</span>
                  )}
                  <span className="text-text-secondary text-xs">USD</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product, selectedSize, currentPrice)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
