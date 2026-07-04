import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, X } from 'lucide-react';
import { Product } from '../types';

export default function Header({ user, onLoginClick, onProfileClick, cartCount, onCartClick, searchQuery, onSearchChange, products, onProductSelect }: { user: { email: string } | null; onLoginClick: () => void; onProfileClick: () => void; cartCount: number; onCartClick: () => void; searchQuery: string; onSearchChange: (query: string) => void; products: Product[]; onProductSelect: (product: Product) => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Scroll down -> hide
      } else {
        setIsVisible(true); // Scroll up -> show
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Shoplon</h1>
        
        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search for Products, Brands and More" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 mt-1 rounded-md shadow-lg z-50">
              {suggestions.map((p, index) => (
                <div key={`${p.id}-${index}`} onClick={() => { onProductSelect(p); setSuggestions([]); onSearchChange(''); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100">
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile search icon */}
        <button className="md:hidden p-2" onClick={() => setIsMobileSearchOpen(true)}>
          <Search size={24} className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Mobile search full width when open */}
        {isMobileSearchOpen && (
          <div className="md:hidden absolute inset-0 bg-white dark:bg-gray-900 z-50 p-4 flex items-center gap-2">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:bg-gray-800"
                autoFocus
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 mt-1 rounded-md shadow-lg z-50">
                  {suggestions.map((p, index) => (
                    <div key={`${p.id}-${index}`} onClick={() => { onProductSelect(p); setSuggestions([]); setIsMobileSearchOpen(false); onSearchChange(''); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100">
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { setIsMobileSearchOpen(false); onSearchChange(''); }} className="p-2 dark:text-white">
              <X size={24} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-6">
          {user ? (
            <button 
              onClick={onProfileClick} 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: `#${(user.email.charCodeAt(0) * 0x123456 % 0xffffff).toString(16).padStart(6, '0')}` }}
            >
              {user.email.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button onClick={onLoginClick} className="flex items-center gap-1 hover:text-blue-600"><User size={20} /> Login</button>
          )}
          <button onClick={onCartClick} className="flex items-center gap-1 hover:text-blue-600 relative">
            <ShoppingCart size={20} /> Cart
            {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-1.5">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
