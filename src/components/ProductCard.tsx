import React from 'react';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isInCart?: boolean;
  onViewCart?: () => void;
}

export default function ProductCard({ product, onClick, onAddToCart, isInCart, onViewCart }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 p-2 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between" onClick={() => onClick(product)}>
      <div>
        <div className="relative h-32 md:h-48 mb-2">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-md" />
          <button onClick={(e) => e.stopPropagation()} className="absolute top-1 right-1 p-1 md:p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:text-red-500 dark:text-gray-300">
            <Heart size={16} />
          </button>
        </div>
        <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate">{product.name}</h3>
        <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-gray-200 mt-1">₹{product.price}</p>
      </div>
      {isInCart ? (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onViewCart) onViewCart();
          }}
          className="w-full mt-2 md:mt-4 bg-green-600 text-white py-1.5 md:py-2 rounded-md hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Check size={16} />
          View Cart
        </button>
      ) : (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onAddToCart) onAddToCart(product);
          }}
          className="w-full mt-2 md:mt-4 bg-blue-600 text-white py-1.5 md:py-2 rounded-md hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      )}
    </div>
  );
}
