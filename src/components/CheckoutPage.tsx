import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ArrowLeft, CreditCard, Check, QrCode } from 'lucide-react';
import { addOrder } from '../lib/gasApi';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutPageProps {
  cart: CartItem[];
  total: number;
  onBack: () => void;
  user: { email: string } | null;
  onOrderSuccess: () => void;
}

export default function CheckoutPage({ cart, total, onBack, user, onOrderSuccess }: CheckoutPageProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePlaceOrder = () => {
    if (!name.trim() || mobile.length !== 10 || !city.trim() || !address.trim()) {
      alert('Please fill in all customer details correctly (Mobile number must be 10 digits)');
      return;
    }
    setShowQrCode(true);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      await addOrder({
        orderId: 'ORD-' + Date.now(),
        email: user?.email || 'guest',
        customerName: name,
        phone: mobile,
        address: `${address}, ${city}`,
        itemsCount: cart.reduce((count, item) => count + item.quantity, 0),
        totalAmount: total,
        itemsDetails: cart.map(item => `${item.name} (${item.quantity})`).join(', ')
      });

      // Send email
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || 'customer@example.com',
          orderDetails: cart.map(item => `${item.name} (${item.quantity})`).join(', ')
        })
      }).catch(e => console.error("Email failed", e));

      setShowSuccess(true);
      setTimeout(() => {
        onOrderSuccess();
      }, 2500);
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
            >
                <Check size={40} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400">Thank you for your purchase.</p>
        </motion.div>
    );
  }

  if (showQrCode) {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 text-center">
            <h2 className="text-2xl font-bold dark:text-white mb-6">Scan to Pay</h2>
            <div className="flex justify-center mb-6">
                <div className="w-64 h-64 border-4 border-gray-800 dark:border-gray-200 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <QrCode size={128} className="text-gray-600 dark:text-gray-400" />
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Scan this QR code with any UPI app to complete payment of ₹{total}</p>
            <button 
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? 'Confirming...' : 'I have paid, Confirm Order'}
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6 font-medium">
        <ArrowLeft size={20} /> Back to Cart
      </button>

      <h2 className="text-2xl font-bold dark:text-white mb-6">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold dark:text-gray-200 mb-2">Customer Details</h3>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white" />
          <input 
            type="text" 
            value={mobile} 
            onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,10}$/.test(val)) {
                    setMobile(val);
                }
            }} 
            placeholder="Mobile Number (10 digits)" 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white" 
          />
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white" />
          <textarea 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white"
            placeholder="Complete Delivery Address"
            rows={3}
          />
        </div>

        <div>
            <h3 className="font-bold dark:text-gray-200 mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
                {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between dark:text-gray-400">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                    </div>
                ))}
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg dark:text-white">
                <span>Total</span>
                <span>₹{total}</span>
            </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="font-bold dark:text-gray-200 mb-4">Payment Method</h3>
        <div className="p-4 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3 text-blue-800 dark:text-blue-200">
            <CreditCard />
            <span>Online Payment (Required)</span>
        </div>
        <button 
          onClick={handlePlaceOrder}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
