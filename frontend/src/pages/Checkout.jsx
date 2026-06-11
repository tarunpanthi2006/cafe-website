import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { items, orderType, setOrderType, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  if (items.length === 0) {
    return <Navigate to="/menu" replace />;
  }

  const subtotal = getSubtotal();
  const discount = promoResult?.valid ? promoResult.discount_amount : 0;
  const total = subtotal - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    try {
      const res = await api.promo.validate(promoCode, subtotal);
      setPromoResult(res);
    } catch (err) {
      setPromoResult({ valid: false, message: 'Failed to validate promo' });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to place an order.");
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      // Simulate Khalti Payment Delay
      await new Promise(r => setTimeout(r, 1500));

      const payload = {
        user_id: user.id,
        items: items.map(i => ({ menu_item_id: i.id, quantity: i.quantity, unit_price: i.price })),
        order_type: orderType,
        total_amount: total,
        address: orderType === 'delivery' ? address : null,
        table_number: orderType === 'dine_in' ? tableNumber : null,
        promo_code: promoResult?.valid ? promoCode : null
      };

      const res = await api.orders.create(payload);
      clearCart();
      navigate(`/order-tracking/${res.order_id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to place order');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Type */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Order Type</h2>
            <div className="grid grid-cols-3 gap-4">
              {['dine_in', 'takeaway', 'delivery'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${orderType === type ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                >
                  {type.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {orderType === 'dine_in' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Table Number</label>
                <input 
                  type="text" 
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 4"
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Delivery Address</label>
                <textarea 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  rows={3}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            )}
          </div>

          {/* Promo Code */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Promo Code</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder="Enter code (e.g. LUXE20)"
                className="flex-1 bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 uppercase"
              />
              <button 
                onClick={handleApplyPromo}
                disabled={!promoCode || isApplyingPromo}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
              >
                {isApplyingPromo ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply'}
              </button>
            </div>
            {promoResult && (
              <div className={`mt-3 flex items-center gap-2 text-sm ${promoResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                {promoResult.valid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {promoResult.message}
              </div>
            )}
          </div>

        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto hide-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="text-gray-300">
                    <span className="text-white font-bold mr-2">{item.quantity}x</span>
                    {item.name}
                  </div>
                  <div className="text-white">रू {item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>रू {subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400 text-sm font-bold">
                  <span>Discount ({promoResult.discount_percent}%)</span>
                  <span>- रू {discount}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-800">
                <span>Total</span>
                <span className="text-amber-500">रू {total}</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || (orderType === 'delivery' && !address) || (orderType === 'dine_in' && !tableNumber)}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-gray-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex justify-center items-center gap-2"
            >
              {isPlacingOrder ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing Khalti...</>
              ) : (
                'Pay with Khalti'
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By placing this order, you agree to our Terms of Service. Mock Khalti payment will be automatically successful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
