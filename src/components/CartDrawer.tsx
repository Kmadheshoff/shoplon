import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout, cart, removeFromCart, updateQuantity }: CartDrawerProps) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 z-50 p-6 shadow-xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X className="dark:text-white" /></button>
            </div>
            
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-4">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ShoppingCart size={64} className="text-gray-300 dark:text-gray-700" />
                    </motion.div>
                    <p className="text-xl font-bold dark:text-white">Your cart is empty</p>
                    <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Shop Now</button>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-8 flex-1 overflow-y-auto">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-4 items-center border border-gray-200 dark:border-gray-800 p-3 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                            <p className="font-medium dark:text-white">{item.name}</p>
                            <p className="text-sm font-semibold dark:text-gray-400">₹{item.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center dark:text-white">-</button>
                                <span className="w-8 text-center dark:text-white">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center dark:text-white">+</button>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    </div>

                    <div className="border-t pt-4 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg dark:text-gray-300">Total</p>
                        <p className="text-2xl font-bold dark:text-white">₹{total}</p>
                    </div>
                    <button onClick={onCheckout} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">Proceed to Checkout</button>
                    </div>
                </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
