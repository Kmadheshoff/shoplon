/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import BannerSlider from './components/BannerSlider';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import ProductDetails from './components/ProductDetails';
import AuthModal from './components/AuthModal';
import UserDrawer from './components/UserDrawer';
import CartDrawer from './components/CartDrawer';
import LoadingSpinner from './components/LoadingSpinner';
import CategorySection from './components/CategorySection';
import CheckoutPage from './components/CheckoutPage';
import { fetchProducts } from './lib/gasApi';
import { useState, useRef, useEffect } from 'react';
import { Product, CartItem } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    fetchProducts().then((data) => {
        setProducts(data);
        setLoadingProducts(false);
    });
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem('cart_' + user.email);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cart_' + user.email, JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (email: string) => {
    const newUser = { email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsDrawerOpen(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean) as string[];

  const filteredProducts = products.filter(p => 
    (!selectedCategory || p.category === selectedCategory) &&
    ((p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
     (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleProductClick = (product: Product) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 overflow-x-hidden pt-20">
      <Header 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onProfileClick={() => setIsDrawerOpen(true)} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {selectedProduct ? (
        <main className="container mx-auto px-4 py-6">
          <ProductDetails 
            product={selectedProduct} 
            onBack={handleBack} 
            onAddToCart={addToCart} 
            isInCart={cart.some(item => item.id === selectedProduct.id)}
            onViewCart={() => {setIsCartOpen(true); setSelectedProduct(null);}}
          />
        </main>
      ) : isCheckoutOpen ? (
        <main className="container mx-auto px-4 py-6">
          <CheckoutPage 
            cart={cart}
            total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            onBack={() => setIsCheckoutOpen(false)}
            user={user}
            onOrderSuccess={() => {
                setCart([]);
                setIsCheckoutOpen(false);
            }}
          />
        </main>
      ) : loadingProducts ? (
        <LoadingSpinner />
      ) : (
        <>
          <CategoryBar categories={categories} selectedCategory={selectedCategory} onSelect={(cat) => { setSelectedCategory(cat); setSelectedProduct(null); }} />
          <main className="container mx-auto px-4 py-6">
            {!selectedCategory && (
              <div className="mb-10">
                <BannerSlider />
              </div>
            )}
            
            {selectedCategory ? (
              <CategorySection
                category={selectedCategory}
                products={filteredProducts}
                onProductClick={handleProductClick}
                onAddToCart={addToCart}
                cart={cart}
                onViewCart={() => setIsCartOpen(true)}
                isSingleCategoryView={true}
              />
            ) : (
              <>
                {categories.map((cat) => {
                  const catProducts = filteredProducts.filter((p) => p.category === cat);
                  if (catProducts.length === 0) return null;
                  return (
                    <CategorySection
                      key={cat}
                      category={cat}
                      products={catProducts}
                      onProductClick={handleProductClick}
                      onAddToCart={addToCart}
                      cart={cart}
                      onViewCart={() => setIsCartOpen(true)}
                      onSelectCategory={(selectedCat) => {
                        setSelectedCategory(selectedCat);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  );
                })}
                {filteredProducts.some((p) => !p.category || !categories.includes(p.category)) && (
                  <CategorySection
                    category="Other Items"
                    products={filteredProducts.filter((p) => !p.category || !categories.includes(p.category))}
                    onProductClick={handleProductClick}
                    onAddToCart={addToCart}
                    cart={cart}
                    onViewCart={() => setIsCartOpen(true)}
                  />
                )}
              </>
            )}
          </main>
        </>
      )}
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />
      <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} onCheckout={() => {setIsCartOpen(false); setIsCheckoutOpen(true);}} />
    </div>
  );
}
