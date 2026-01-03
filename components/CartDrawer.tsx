
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, items, onRemove, onUpdateQty, onCheckout 
}) => {
  const subtotal = items.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-dark h-full flex flex-col shadow-2xl animate-fade-in-up md:animate-none md:translate-x-0">
        <div className="flex items-center justify-between p-6 border-b border-border-dark">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Tu Carrito <span className="text-text-secondary font-normal text-sm">({items.length} artículos)</span>
          </h2>
          <button onClick={onClose} className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <span className="material-symbols-outlined text-6xl text-border-dark">shopping_basket</span>
              <p className="text-text-secondary">Tu colección está vacía</p>
              <button onClick={onClose} className="text-primary font-bold hover:underline">Empezar a comprar</button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                <div className="w-20 h-24 bg-background-dark rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-primary text-[10px] font-black uppercase tracking-widest">{item.selectedSize}</p>
                      <p className="text-text-secondary text-[10px] uppercase tracking-wider">{item.brand}</p>
                    </div>
                    <p className="font-black text-sm">${item.totalPrice * item.quantity}</p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center border border-border-dark rounded-lg overflow-hidden">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="px-2 py-1 hover:bg-border-dark">-</button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="px-2 py-1 hover:bg-border-dark">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-text-secondary hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-border-dark bg-[#1a1620]">
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary text-sm">Subtotal</span>
            <span className="text-white font-bold">${subtotal}</span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="text-text-secondary text-sm">Envío</span>
            <span className="text-green-500 text-sm font-medium">Gratis</span>
          </div>
          <div className="flex justify-between mb-6 pt-4 border-t border-border-dark">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-black text-primary">${subtotal}</span>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={onCheckout}
            className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
          >
            Finalizar Pedido y Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
