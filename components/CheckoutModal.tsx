
import React, { useState } from 'react';
import { UserInfo } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
  onSubmit: (info: UserInfo) => void;
  total: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSubmit, total }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.email) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-dark rounded-2xl p-8 shadow-2xl border border-border-dark animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Completa tu pedido</h2>
          <button onClick={onClose} className="hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="mb-8 p-4 bg-background-dark/50 rounded-xl border border-border-dark flex justify-between items-center">
          <span className="text-text-secondary">Total a pagar:</span>
          <span className="text-2xl font-black text-primary">${total}</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase">Nombre Completo</label>
            <input 
              required
              type="text" 
              placeholder="Ej: Juan Pérez"
              className="bg-background-dark border-border-dark rounded-xl focus:ring-primary focus:border-primary text-white p-3"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase">Número de Teléfono</label>
            <input 
              required
              type="tel" 
              placeholder="+52 (555) 000-0000"
              className="bg-background-dark border-border-dark rounded-xl focus:ring-primary focus:border-primary text-white p-3"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase">Correo Electrónico (Gmail)</label>
            <input 
              required
              type="email" 
              placeholder="tu_nombre@gmail.com"
              className="bg-background-dark border-border-dark rounded-xl focus:ring-primary focus:border-primary text-white p-3"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <button 
            type="submit"
            className="mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">verified_user</span>
            Confirmar y Pagar Pedido
          </button>
          
          <p className="text-[10px] text-center text-text-secondary leading-relaxed">
            Al hacer clic en confirmar, aceptas nuestros términos de servicio y políticas de entrega premium.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
