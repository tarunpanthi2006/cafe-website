import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';

export default function Cart({ isOpen, onClose }) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-[70] flex flex-col border-l border-gray-800"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />}
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="text-amber-500 font-medium">रू {item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-4 text-center text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-800 p-6 bg-gray-900">
                <div className="flex justify-between items-center mb-4 text-white">
                  <span className="font-medium text-gray-400">Subtotal</span>
                  <span className="text-xl font-bold">रू {getSubtotal()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-bold text-gray-900 bg-amber-500 hover:bg-amber-400 transition-colors shadow-lg flex justify-center items-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
