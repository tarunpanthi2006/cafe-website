import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', tableOrAddress: '', phone: '' });
  const [orderStatus, setOrderStatus] = useState(null); // 'loading', 'success', 'error'

  const handleCheckout = async (e) => {
    e.preventDefault();
    setOrderStatus('loading');
    
    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          totalAmount: cartTotal
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit order');
      
      setOrderStatus('success');
      clearCart();
      setTimeout(() => {
        setIsCartOpen(false);
        setOrderStatus(null);
        setIsCheckingOut(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setOrderStatus('error');
      setTimeout(() => setOrderStatus(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-brand-orange" />
                <h2 className="text-xl font-serif font-bold text-brand-dark">Your Order</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 && !isCheckingOut && orderStatus !== 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg">Your cart is empty</p>
                </div>
              ) : orderStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-green-500 gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-gray-800">Order Placed!</p>
                  <p className="text-gray-500 text-center">Your delicious food is being prepared.</p>
                </div>
              ) : isCheckingOut ? (
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Table No. or Address</label>
                    <input 
                      required
                      type="text" 
                      value={formData.tableOrAddress}
                      onChange={e => setFormData({...formData, tableOrAddress: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                      placeholder="Table 4 / 123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-dark">{item.name}</h3>
                        <p className="text-brand-orange font-medium">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-brand-red transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && orderStatus !== 'success' && (
              <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-brand-dark">${cartTotal.toFixed(2)}</span>
                </div>
                {orderStatus === 'error' && (
                  <p className="text-red-500 text-sm mb-4 text-center">Failed to process order. Try again.</p>
                )}
                {isCheckingOut ? (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      form="checkout-form"
                      disabled={orderStatus === 'loading'}
                      className="flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-brand-orange hover:bg-brand-red transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                      {orderStatus === 'loading' ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-4 rounded-xl font-bold text-white bg-brand-orange hover:bg-brand-red transition-colors shadow-lg shadow-brand-orange/30 flex justify-center items-center gap-2"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
