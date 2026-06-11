import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { CheckCircle2, AlertCircle, Loader2, Wallet, Truck, PersonStanding, UtensilsCrossed, MapPin } from 'lucide-react';
import LocationModal from '../components/LocationModal';
import { useToast } from '../context/ToastContext';
import SmartRecommendations from '../components/SmartRecommendations';

export default function Checkout() {
  const { items, orderType, setOrderType, getSubtotal, clearCart, appliedPromo, setAppliedPromo, removeAppliedPromo } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  
  const [promoCode, setPromoCode] = useState(appliedPromo?.code || '');
  const [promoError, setPromoError] = useState(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState(null);
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { addToast } = useToast();
  
  const savedLocation = localStorage.getItem('luxecafe_location') || address;

  if (items.length === 0) {
    return <Navigate to="/menu" replace />;
  }

  const subtotal = getSubtotal();
  const discount = appliedPromo ? Math.round(subtotal * (appliedPromo.discount_percent / 100)) : 0;
  const total = subtotal - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    try {
      const res = await api.promo.validate(promoCode, subtotal);
      if (res.valid) {
        setAppliedPromo({ code: promoCode.toUpperCase(), discount_percent: res.discount_percent });
        setPromoError(null);
      } else {
        setPromoError(res.message || 'Invalid promo code');
      }
    } catch (err) {
      setPromoError('Failed to validate promo');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    removeAppliedPromo();
    setPromoCode('');
    setPromoError(null);
  };

  const saveOrderToHistory = (orderData, cartItems, finalTotal) => {
    try {
      const history = JSON.parse(localStorage.getItem('luxecafe_order_history') || '[]');
      history.unshift({
        id: orderData.order_id || orderData.id,
        items: cartItems.map(item => ({ id: item.id, name: item.name, category: item.category })),
        total: finalTotal,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      });
      const trimmed = history.slice(0, 3);
      localStorage.setItem('luxecafe_order_history', JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save order history:', error);
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
      // Khalti Simulation
      await new Promise(r => setTimeout(r, 1500));
      
      // Khalti Success Toast
      addToast('✅ Payment successful via Khalti (Test Mode)', 'success');

      const payload = {
        user_id: user.id,
        items: items.map(i => ({ menu_item_id: i.id, quantity: i.quantity, unit_price: i.price })),
        order_type: orderType,
        total_amount: total,
        address: orderType === 'delivery' ? (savedLocation || address) : null,
        table_number: orderType === 'dine_in' ? tableNumber : null,
        promo_code: appliedPromo ? appliedPromo.code : null
      };

      const res = await api.orders.create(payload);
      
      saveOrderToHistory(res, items, total);
      
      clearCart();
      navigate(`/order-tracking/${res.order_id}`, { replace: true });
    } catch (err) {
      addToast('❌ Payment failed. Please try again.', 'error');
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
                <div className="flex gap-4">
                  <textarea 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={savedLocation || "Enter your full address"}
                    rows={2}
                    className="flex-1 bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>
            )}
            
            {/* Delivery Estimate */}
            <div className="mt-6 p-4 bg-gray-950 rounded-xl border border-gray-800 flex items-start gap-4">
              {orderType === 'delivery' && (
                <>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Truck className="w-6 h-6" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-white mb-1">Estimated delivery: 25-35 minutes</p>
                    {savedLocation ? (
                      <p className="text-sm text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> Delivering to {savedLocation}</p>
                    ) : (
                      <button onClick={() => setIsLocationModalOpen(true)} className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3"/> Set delivery location</button>
                    )}
                  </div>
                </>
              )}
              {orderType === 'takeaway' && (
                <>
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><PersonStanding className="w-6 h-6" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-white mb-1">Ready for pickup in 10-15 minutes</p>
                    <p className="text-sm text-gray-400">Please arrive at counter</p>
                  </div>
                </>
              )}
              {orderType === 'dine_in' && (
                <>
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><UtensilsCrossed className="w-6 h-6" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-white mb-1">Served at your table in 15-20 minutes</p>
                    <p className="text-sm text-gray-400">We'll bring it to you</p>
                  </div>
                </>
              )}
            </div>
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
            {appliedPromo ? (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl relative">
                <p className="text-green-400 font-bold mb-1 flex items-center gap-2">
                  🎉 You saved रू{discount} with {appliedPromo.code}!
                </p>
                <p className="text-sm text-green-500/80">Original: रू{subtotal} → After discount: रू{total}</p>
                <button 
                  onClick={handleRemovePromo}
                  className="absolute top-4 right-4 text-green-500/60 hover:text-green-400 text-sm underline underline-offset-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                {promoError && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {promoError}
                  </div>
                )}
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <p className="text-amber-500/90 text-sm flex items-start gap-2">
                    <span className="text-base">💡</span>
                    Add a promo code (LUXE20) to save 20% on your first order!
                  </p>
                </div>
              </>
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
              {appliedPromo && (
                <div className="flex justify-between text-green-400 text-sm font-bold">
                  <span>Discount ({appliedPromo.discount_percent}%)</span>
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
            
            <SmartRecommendations />

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || (orderType === 'delivery' && !address && !savedLocation) || (orderType === 'dine_in' && !tableNumber)}
              className="w-full py-4 bg-[#5E32E1] hover:bg-[#4A26B5] disabled:opacity-50 disabled:hover:bg-[#5E32E1] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(94,50,225,0.3)] flex justify-center items-center gap-2"
            >
              {isPlacingOrder ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing Khalti...</>
              ) : (
                'Pay with Khalti'
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
              <Wallet className="w-4 h-4" />
              <span>Khalti Test Mode — No real payment</span>
            </div>
            
          </div>
        </div>
      </div>
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        location={address}
        setLocation={(loc) => {
          setAddress(loc);
        }}
      />
    </div>
  );
}
