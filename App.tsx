
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PERFUMES as INITIAL_PERFUMES } from './constants';
import { Product, CartItem, UserInfo, Order } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SidebarFilters from './components/SidebarFilters';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';
import AIChatAssistant from './components/AIChatAssistant';
import AdminModal from './components/AdminModal';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'Para Él' | 'Para Ella' | 'Unisex'>('Unisex');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Novedades');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const productGridRef = useRef<HTMLDivElement>(null);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // Rango extendido para administración

  // Cargar datos persistidos
  useEffect(() => {
    const savedProducts = localStorage.getItem('redfragances_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PERFUMES);
    }

    const savedOrders = localStorage.getItem('redfragances_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const addToCart = (product: Product, size: string = '50ml', finalPrice?: number) => {
    let p: number;

    if (finalPrice !== undefined) {
      p = finalPrice;
    } else {
      // Intentar obtener precio específico del admin
      const specificSize = product.sizePrices?.find(s => s.size === size);
      if (specificSize && specificSize.price > 0) {
        p = specificSize.discountPrice || specificSize.price;
      } else {
        // Fallback a multiplicadores
        const basePrice = product.discountPrice || product.price;
        const sizeMultipliers: Record<string, number> = {
          '30ml': 0.7, '50ml': 1.0, '100ml': 1.6, '200ml': 2.8
        };
        p = Math.round(basePrice * (sizeMultipliers[size] || 1));
      }
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.selectedSize === size) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, totalPrice: p }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const categoryMatch = selectedCategory === 'Unisex' ? true : 
                          (selectedCategory === 'Para Él' ? p.category === 'Men' : 
                           p.category === 'Women');
      
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const familyMatch = selectedFamilies.length === 0 || selectedFamilies.includes(p.family);
      
      const currentPrice = p.discountPrice || p.price;
      const priceMatch = currentPrice >= priceRange[0] && currentPrice <= priceRange[1];
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && brandMatch && familyMatch && priceMatch && searchMatch;
    });

    if (sortBy === 'Precio: Menor a Mayor') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'Precio: Mayor a Menor') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, selectedBrands, selectedFamilies, priceRange, searchQuery, sortBy]);

  const handleCheckoutSubmit = (info: UserInfo) => {
    const total = cart.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
    const newOrder: Order = {
      ...info,
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString('es-ES'),
      items: cart.map(item => ({ name: item.name, size: item.selectedSize, quantity: item.quantity })),
      total: total
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('redfragances_orders', JSON.stringify(updatedOrders));
    
    alert(`¡Gracias ${info.name}! Tu pedido ha sido procesado con éxito.`);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('redfragances_products', JSON.stringify(updated));
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    localStorage.setItem('redfragances_products', JSON.stringify(updated));
  };

  const handleRemoveProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('redfragances_products', JSON.stringify(updated));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onCartOpen={() => setIsCartOpen(true)} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onSearch={setSearchQuery}
        onAdminOpen={() => setIsAdminOpen(true)}
        onHomeClick={scrollToTop}
      />
      
      <main className="flex-grow">
        <Hero onExplore={() => productGridRef.current?.scrollIntoView({ behavior: 'smooth' })} onIAOpen={() => setIsChatOpen(true)} />
        
        <div id="productos" ref={productGridRef} className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 flex flex-col lg:flex-row gap-8">
          <SidebarFilters 
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedFamilies={selectedFamilies}
            setSelectedFamilies={setSelectedFamilies}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-dark mb-6 gap-4">
              <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {(['Para Él', 'Para Ella', 'Unisex'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-all ${
                      selectedCategory === cat 
                      ? 'border-b-primary text-white font-bold' 
                      : 'border-b-transparent text-text-secondary hover:text-white hover:border-b-primary/50'
                    }`}
                  >
                    <span className="text-sm tracking-[0.015em] whitespace-nowrap">{cat}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3 pb-3 md:pb-0">
                <span className="text-text-secondary text-sm hidden md:block">Ordenar por:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-surface-dark text-white border border-border-dark rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option>Novedades</option>
                    <option>Precio: Menor a Mayor</option>
                    <option>Precio: Mayor a Menor</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAddToCart={addToCart} 
                  onViewDetails={setSelectedProduct} 
                />
              ))}
              {filteredAndSortedProducts.length === 0 && (
                <div className="col-span-full py-20 text-center text-text-secondary flex flex-col items-center gap-4 border border-dashed border-border-dark rounded-2xl">
                  <span className="material-symbols-outlined text-6xl opacity-20">search_off</span>
                  <p className="font-bold text-lg">Catálogo vacío</p>
                  <p className="text-sm">Añade perfumes desde el panel de administración.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-dark bg-[#110a18] mt-auto">
        <div className="max-w-[1200px] mx-auto px-10 py-12 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <span className="material-symbols-outlined text-primary text-2xl">spa</span> Redfragances
              </h2>
              <p className="text-text-secondary text-sm max-w-xs mx-auto md:mx-0">
                Curando las mejores fragancias para tu viaje personal.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal 
          onClose={() => setIsCheckoutOpen(false)} 
          onSubmit={handleCheckoutSubmit}
          total={cart.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0)}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart}
        />
      )}

      {isAdminOpen && (
        <AdminModal 
          orders={orders} 
          products={products}
          onClose={() => setIsAdminOpen(false)} 
          onDeleteOrder={(id) => {
            const updated = orders.filter(o => o.id !== id);
            setOrders(updated);
            localStorage.setItem('redfragances_orders', JSON.stringify(updated));
          }}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleRemoveProduct}
        />
      )}

      <AIChatAssistant isOpenControlled={isChatOpen} onToggleControlled={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default App;
