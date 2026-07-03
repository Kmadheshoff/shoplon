import React from 'react';
import { Product } from '../types';
import { ArrowLeft, ShoppingCart, Check, Truck, RotateCcw, CreditCard } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
  onViewCart?: () => void;
}

export default function ProductDetails({ product, onBack, onAddToCart, isInCart, onViewCart }: ProductDetailsProps) {
  return (
    <div className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 p-4 md:p-6 rounded-lg shadow-sm">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 font-medium">
        <ArrowLeft size={20} /> Back to Products
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full h-80 md:h-96 object-cover rounded-lg" />
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-200 mt-2">₹{product.price}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Truck className="text-blue-500" size={20} />
                <span>24h Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <RotateCcw className="text-blue-500" size={20} />
                <span>3 Days Return</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <CreditCard className="text-blue-500" size={20} />
                <span>Online Payment Only</span>
            </div>
          </div>
          
          <div className="mt-8">
            {isInCart ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onViewCart} 
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 text-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Check size={20} />
                  View Cart
                </button>
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onBack();
                  }} 
                  className="bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-700 py-3 px-6 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 text-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  + Add More
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onAddToCart(product)} 
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 text-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
