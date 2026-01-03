
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  useEffect(() => {
    try {
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
    } catch (e) {
      console.error("Error cargando datos locales", e);
      setProducts(INITIAL_PERFUMES);
    }
  }, []);

  const addToCart = (product: Product, size: string = '50ml', finalPrice?: number) => {
    let p: number;
    if (finalPrice !== undefined) {
      p = finalPrice;
    } else {
      const specificSize = product.sizePrices?.find(s => s.size === size);
      if (specificSize && specificSize.price > 0) {
        p = specificSize.discountPrice || specificSize.price;
      } else {
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
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });

    if (sortBy === 'Precio: Menor a Mayor') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'Precio: Mayor a Menor') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    }
    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

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
    alert(`¡Gracias ${info.name}! Tu pedido ha sido procesado.`);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark">
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
          <SidebarFilters selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} selectedFamilies={selectedFamilies} setSelectedFamilies={setSelectedFamilies} priceRange={priceRange} setPriceRange={setPriceRange} />
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-dark mb-6">
              <div className="flex gap-8">
                {(['Para Él', 'Para Ella', 'Unisex'] as const).map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`pb-4 pt-4 border-b-2 transition-all ${selectedCategory === cat ? 'border-primary text-white font-bold' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onViewDetails={setSelectedProduct} />
              ))}
              {filteredAndSortedProducts.length === 0 && (
                <div className="col-span-full py-20 text-center text-text-secondary border border-dashed border-border-dark rounded-2xl">
                  <span className="material-symbols-outlined text-6xl opacity-20">search_off</span>
                  <p className="font-bold text-lg">Catálogo vacío</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdateQty={updateQuantity} onCheckout={() => setIsCheckoutOpen(true)} />
      {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} onSubmit={handleCheckoutSubmit} total={cart.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0)} />}
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      {isAdminOpen && <AdminModal orders={orders} products={products} onClose={() => setIsAdminOpen(false)} onDeleteOrder={(id) => setOrders(orders.filter(o => o.id !== id))} onAddProduct={(p) => { const u = [p, ...products]; setProducts(u); localStorage.setItem('redfragances_products', JSON.stringify(u)); }} onUpdateProduct={(p) => { const u = products.map(x => x.id === p.id ? p : x); setProducts(u); localStorage.setItem('redfragances_products', JSON.stringify(u)); }} onDeleteProduct={(id) => { const u = products.filter(x => x.id !== id); setProducts(u); localStorage.setItem('redfragances_products', JSON.stringify(u)); }} />}
      <AIChatAssistant isOpenControlled={isChatOpen} onToggleControlled={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default App;
