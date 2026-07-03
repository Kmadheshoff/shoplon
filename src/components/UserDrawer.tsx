import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut, Package, CreditCard, FileText, Gift, Moon, Sun, ArrowLeft } from 'lucide-react';
import { fetchOrders } from '../lib/gasApi';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email: string } | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface Order {
  OrderID: string;
  Date: string;
  TotalAmount: number;
  Status: string;
  PurchasedItems: string;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'paid': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
};

export default function UserDrawer({ isOpen, onClose, user, onLogout, isDarkMode, toggleDarkMode }: UserDrawerProps) {
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user && showOrders) {
      setLoading(true);
      fetchOrders(user.email).then(setOrders).finally(() => setLoading(false));
    }
  }, [isOpen, user, showOrders]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 z-50 p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold dark:text-white">{showOrders ? 'Order History' : 'Profile'}</h2>
              <button onClick={onClose}><X className="dark:text-white" /></button>
            </div>
            
            {showOrders ? (
                <div className="space-y-4">
                    <button onClick={() => setShowOrders(false)} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
                        <ArrowLeft size={16} /> Back
                    </button>
                    {loading ? <p className="dark:text-white">Loading orders...</p> : (
                        orders.length === 0 ? <p className="dark:text-white">No orders found.</p> :
                        orders.map(order => (
                            <div key={order.OrderID} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold dark:text-white">{order.OrderID}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.Status)}`}>{order.Status}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{order.Date.split('T')[0]}</p>
                                <p className="text-sm dark:text-gray-300 mt-1">{order.PurchasedItems}</p>
                                <p className="font-bold dark:text-white mt-2">₹{order.TotalAmount}</p>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <>
                <div className="mb-8 dark:text-gray-300">
                  <p className="font-semibold">{user?.email}</p>
                </div>
    
                <nav className="space-y-4">
                  <button onClick={() => setShowOrders(true)} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded dark:text-white"><Package size={20} /> Orders</button>
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded dark:text-white"><CreditCard size={20} /> Payment History</button>
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded dark:text-white"><FileText size={20} /> Terms and Conditions</button>
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded dark:text-white"><Gift size={20} /> Offers</button>
                  <button onClick={toggleDarkMode} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded dark:text-white">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button onClick={onLogout} className="flex items-center gap-3 w-full p-2 text-red-600 hover:bg-red-50 rounded"><LogOut size={20} /> Logout</button>
                </nav>
                </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
