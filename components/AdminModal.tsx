
import React, { useState, useEffect } from 'react';
import { Order, Product, SizePrice } from '../types';

interface AdminModalProps {
  orders: Order[];
  products: Product[];
  onClose: () => void;
  onDeleteOrder: (id: string) => void;
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const DEFAULT_SIZES = ['30ml', '50ml', '100ml', '200ml'];

const AdminModal: React.FC<AdminModalProps> = ({ orders, products, onClose, onDeleteOrder, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'gallery'>('url');
  
  const [newProd, setNewProd] = useState<Partial<Product>>({
    brand: '',
    name: '',
    price: 0,
    category: 'Unisex',
    family: 'Fresco',
    image: '',
    description: '',
    notes: [],
    sizePrices: DEFAULT_SIZES.map(s => ({ size: s, price: 0 }))
  });

  const [discountPercents, setDiscountPercents] = useState<Record<string, number>>({
    '30ml': 0, '50ml': 0, '100ml': 0, '200ml': 0
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd({ ...newProd, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSizeField = (size: string, field: 'price' | 'discountPercent', value: number) => {
    if (field === 'discountPercent') {
      setDiscountPercents(prev => ({ ...prev, [size]: value }));
    } else {
      setNewProd(prev => ({
        ...prev,
        sizePrices: prev.sizePrices?.map(sp => 
          sp.size === size ? { ...sp, price: value } : sp
        )
      }));
    }
  };

  // Sincronizar discountPrice basado en price y discountPercent
  useEffect(() => {
    setNewProd(prev => ({
      ...prev,
      sizePrices: prev.sizePrices?.map(sp => {
        const pct = discountPercents[sp.size] || 0;
        if (pct > 0 && sp.price > 0) {
          return { ...sp, discountPrice: Math.round(sp.price * (1 - pct / 100)) };
        }
        return { ...sp, discountPrice: undefined };
      })
    }));
  }, [discountPercents]);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProd(product);
    
    // Calcular porcentajes de descuento actuales para el estado local
    const newPercents: Record<string, number> = {};
    product.sizePrices?.forEach(sp => {
      if (sp.discountPrice && sp.price) {
        newPercents[sp.size] = Math.round((1 - (sp.discountPrice / sp.price)) * 100);
      } else {
        newPercents[sp.size] = 0;
      }
    });
    setDiscountPercents(newPercents);
    
    setImageMode(product.image?.startsWith('data:') ? 'gallery' : 'url');
    document.getElementById('admin-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProd({ 
      brand: '', name: '', price: 0, category: 'Unisex', family: 'Fresco', 
      image: '', description: '', notes: [], 
      sizePrices: DEFAULT_SIZES.map(s => ({ size: s, price: 0 })) 
    });
    setDiscountPercents({ '30ml': 0, '50ml': 0, '100ml': 0, '200ml': 0 });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.brand || !newProd.image) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    // Usar el precio de 50ml como precio base por defecto para compatibilidad
    const base50 = newProd.sizePrices?.find(s => s.size === '50ml');

    const prodToSave: Product = {
      ...(newProd as Product),
      id: editingId || `P-${Date.now()}`,
      price: base50?.price || 0,
      discountPrice: base50?.discountPrice,
      rating: (newProd as Product).rating || 5.0,
      reviewCount: (newProd as Product).reviewCount || 0,
      notes: Array.isArray(newProd.notes) ? newProd.notes : [],
      isNew: editingId ? (newProd as Product).isNew : true
    };

    if (editingId) {
      onUpdateProduct(prodToSave);
      alert('¡Perfume actualizado con éxito!');
    } else {
      onAddProduct(prodToSave);
      alert('¡Perfume añadido con éxito!');
    }
    
    handleCancelEdit();
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-surface-dark rounded-2xl p-8 border border-border-dark animate-fade-in-up">
          <h2 className="text-xl font-bold mb-6 text-center">Acceso Administrador</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Introduce contraseña..."
              className="bg-background-dark border-border-dark rounded-xl text-white p-3 focus:ring-primary focus:border-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl bg-surface-dark h-[90vh] rounded-2xl overflow-hidden flex flex-col border border-border-dark animate-fade-in-up">
        <div className="p-6 border-b border-border-dark flex flex-col md:flex-row justify-between items-center bg-background-dark/50 gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">shield_person</span>
              Redfragances Admin
            </h2>
            <nav className="flex bg-surface-dark rounded-xl p-1 border border-border-dark">
              <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}>Pedidos</button>
              <button onClick={() => setActiveTab('catalog')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'catalog' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}>Catálogo</button>
            </nav>
          </div>
          <button onClick={onClose} className="hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-4xl">cancel</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 no-scrollbar">
          {activeTab === 'orders' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.length === 0 ? (
                <div className="col-span-full py-20 text-center text-text-secondary flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-6xl opacity-20">order_approve</span>
                  <p>Aún no hay pedidos registrados.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-background-dark/50 border border-border-dark rounded-2xl p-5 flex flex-col gap-4 group relative hover:border-primary/50 transition-all">
                    <button onClick={() => onDeleteOrder(order.id)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <div className="border-b border-border-dark pb-3">
                      <h4 className="font-bold text-white text-lg">{order.name}</h4>
                      <p className="text-primary text-[10px] font-black uppercase">{order.id}</p>
                    </div>
                    <div className="text-sm space-y-2">
                      <p className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-text-secondary">phone</span> {order.phone}</p>
                      <p className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-text-secondary">mail</span> {order.email}</p>
                    </div>
                    <div className="bg-surface-dark p-3 rounded-xl border border-border-dark">
                      <p className="text-[10px] font-bold text-text-secondary uppercase mb-2">Artículos:</p>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs mb-1">
                          <span className="text-white truncate">{it.name} ({it.size})</span>
                          <span className="text-primary font-bold">x{it.quantity}</span>
                        </div>
                      ))}
                      <div className="mt-3 pt-2 border-t border-border-dark flex justify-between items-center">
                        <span className="text-xs font-bold">Total:</span>
                        <span className="text-lg font-black text-primary">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
              {/* Formulario */}
              <div id="admin-form" className="xl:col-span-2">
                <div className="bg-background-dark/50 p-6 rounded-2xl border border-primary/20">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined">{editingId ? 'edit' : 'add_circle'}</span>
                    {editingId ? 'Editar Perfume' : 'Nuevo Perfume'}
                  </h3>
                  <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Imagen</label>
                        <div className="flex gap-2 mb-2 bg-surface-dark p-1 rounded-lg">
                          <button type="button" onClick={() => setImageMode('url')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${imageMode === 'url' ? 'bg-primary text-white' : 'text-text-secondary'}`}>URL</button>
                          <button type="button" onClick={() => setImageMode('gallery')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${imageMode === 'gallery' ? 'bg-primary text-white' : 'text-text-secondary'}`}>Galería</button>
                        </div>
                        {imageMode === 'url' ? (
                          <input placeholder="https://..." className="bg-surface-dark border-border-dark rounded-xl text-white p-3 text-sm" value={newProd.image} onChange={e => setNewProd({...newProd, image: e.target.value})} />
                        ) : (
                          <label className="bg-surface-dark border border-dashed border-border-dark rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                            <span className="material-symbols-outlined text-text-secondary">upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          </label>
                        )}
                      </div>
                      <div className="flex flex-col gap-4">
                        <input required placeholder="Marca" className="bg-surface-dark border-border-dark rounded-xl text-white p-3 text-sm" value={newProd.brand} onChange={e => setNewProd({...newProd, brand: e.target.value})} />
                        <input required placeholder="Nombre" className="bg-surface-dark border-border-dark rounded-xl text-white p-3 text-sm" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
                        <select className="bg-surface-dark border-border-dark rounded-xl text-white p-3 text-sm" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value as any})}>
                          <option value="Men">Para Él</option><option value="Women">Para Ella</option><option value="Unisex">Unisex</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-surface-dark/50 p-4 rounded-2xl border border-border-dark">
                      <h4 className="text-xs font-black uppercase text-primary mb-4 tracking-widest">Precios y Descuentos por Mililitros</h4>
                      <div className="space-y-4">
                        {DEFAULT_SIZES.map(size => {
                          const sizeData = newProd.sizePrices?.find(s => s.size === size);
                          return (
                            <div key={size} className="grid grid-cols-3 gap-3 items-end bg-background-dark/30 p-3 rounded-xl border border-border-dark/50">
                              <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">{size} (Precio)</label>
                                <input type="number" placeholder="0" className="w-full bg-surface-dark border-border-dark rounded-lg text-white p-2 text-xs" value={sizeData?.price || ''} onChange={e => updateSizeField(size, 'price', Number(e.target.value))} />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">% Desc.</label>
                                <input type="number" placeholder="0%" className="w-full bg-surface-dark border-border-dark rounded-lg text-primary p-2 text-xs font-bold" value={discountPercents[size] || ''} onChange={e => updateSizeField(size, 'discountPercent', Number(e.target.value))} />
                              </div>
                              <div className="text-right pb-2">
                                <span className="text-[9px] block text-text-secondary uppercase font-bold">Costo Final</span>
                                <span className="text-sm font-black text-white">${sizeData?.discountPrice ? sizeData.discountPrice.toLocaleString() : (sizeData?.price || 0).toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <textarea placeholder="Descripción..." className="bg-surface-dark border-border-dark rounded-xl text-white p-3 text-sm h-20" value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} />
                    
                    <div className="flex gap-2">
                      <button className="flex-grow bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all">{editingId ? 'Guardar Cambios' : 'Añadir Catálogo'}</button>
                      {editingId && <button type="button" onClick={handleCancelEdit} className="bg-surface-dark px-4 rounded-xl text-white">X</button>}
                    </div>
                  </form>
                </div>
              </div>

              {/* Lista */}
              <div className="xl:col-span-3">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined">inventory_2</span> Catálogo ({products.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(p => (
                    <div key={p.id} className={`flex gap-4 p-4 border rounded-2xl items-center transition-all ${editingId === p.id ? 'bg-primary/10 border-primary' : 'bg-background-dark/30 border-border-dark'}`}>
                      <img src={p.image} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-bold truncate">{p.name}</h4>
                        <p className="text-[10px] text-text-secondary uppercase">{p.brand}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {p.sizePrices?.filter(s => s.price > 0).map(s => (
                            <span key={s.size} className="text-[9px] bg-surface-dark px-1.5 py-0.5 rounded border border-border-dark">
                              {s.size}: <span className="text-primary font-bold">${s.discountPrice || s.price}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(p)} className="p-2 text-text-secondary hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                        <button onClick={() => { if(confirm('¿Eliminar?')) onDeleteProduct(p.id) }} className="p-2 text-text-secondary hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
