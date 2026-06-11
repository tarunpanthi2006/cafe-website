import React, { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useToast } from '../context/ToastContext';
import { Sparkles, Plus, Check } from 'lucide-react';

export default function SmartRecommendations() {
  const { items, addItem, addMultipleItems } = useCartStore();
  const [recommendations, setRecommendations] = useState([]);
  const [bundleDeal, setBundleDeal] = useState(null);
  const [personalizedPick, setPersonalizedPick] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (items.length === 0) {
      setRecommendations([]);
      setBundleDeal(null);
      setPersonalizedPick(null);
      return;
    }
    generateRecommendations();
  }, [items]);

  const generateRecommendations = () => {
    // Rule 1: Cart-based recommendations
    const cartCategories = items.map(item => item.category);
    let suggestedItems = [];
    
    if (cartCategories.includes('Pizza') || cartCategories.includes('Pizzas')) {
      suggestedItems = ['Garlic Bread', 'Coke', 'Chocolate Lava Cake'];
    } else if (cartCategories.includes('Burger') || cartCategories.includes('Burgers')) {
      suggestedItems = ['French Fries', 'Chocolate Shake', 'Onion Rings'];
    } else if (cartCategories.includes('Shake') || cartCategories.includes('Shakes')) {
      suggestedItems = ['French Fries', 'Classic Burger', 'Cookie'];
    } else if (cartCategories.includes('Cake') || cartCategories.includes('Cakes')) {
      suggestedItems = ['Cold Coffee', 'Hot Chocolate', 'Ice Cream'];
    } else {
      suggestedItems = ['Garlic Bread', 'French Fries', 'Coke'];
    }
    
    // Filter out items already in cart
    const cartItemNames = items.map(item => item.name);
    const filtered = suggestedItems.filter(name => !cartItemNames.includes(name));
    
    // Mock recommendations data
    setRecommendations(filtered.map(name => ({ 
      id: `rec_${name.replace(/\s+/g, '')}`, 
      name, 
      price: 150, 
      image_url: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80` // placeholder 
    })));
    
    // Rule 2: Bundle Deal (if cart has 3+ items OR total > 800)
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const bundleItems = ['Margherita Pizza', 'Garlic Bread', 'Coke'];
    const allBundleItemsInCart = bundleItems.every(name => cartItemNames.includes(name));

    if (!allBundleItemsInCart && (items.length >= 3 || cartTotal > 800)) {
      setBundleDeal({
        bundleItems,
        originalPrice: 699,
        dealPrice: 599,
        savings: 100
      });
    } else {
      setBundleDeal(null);
    }
    
    // Rule 3: Personalized from order history
    try {
      const history = JSON.parse(localStorage.getItem('luxecafe_order_history') || '[]');
      let foundPersonalized = false;
      if (history.length > 0) {
        const categoryCount = {};
        history.forEach(order => {
          (order.items || []).forEach(item => {
            if (item.category) {
              categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
            }
          });
        });
        const categoriesKeys = Object.keys(categoryCount);
        if (categoriesKeys.length > 0) {
          const favCategory = categoriesKeys.reduce((a, b) => 
            categoryCount[a] > categoryCount[b] ? a : b
          );
          
          const personalizedName = `${favCategory} Deluxe`;
          if (!cartItemNames.includes(personalizedName)) {
            setPersonalizedPick({
              message: `🍕 You love ${favCategory}! Try our special:`,
              item: { id: `spec_${favCategory}`, name: personalizedName, price: 299, category: favCategory }
            });
            foundPersonalized = true;
          }
        }
      }
      if (!foundPersonalized) setPersonalizedPick(null);
    } catch (e) {
      console.error(e);
      setPersonalizedPick(null);
    }
  };

  const handleAddToCart = (item) => {
    addItem({ ...item, quantity: 1 });
    addToast(`Added ${item.name} to cart!`, 'success');
  };

  const handleAddBundleDeal = () => {
    if (!bundleDeal) return;
    
    const cartItemNames = items.map(i => i.name);
    const itemsToAdd = bundleDeal.bundleItems
      .filter(name => !cartItemNames.includes(name))
      .map(name => ({ 
        id: `bundle_${name.replace(/\s+/g, '')}`, 
        name: name, 
        price: name.includes('Pizza') ? 400 : name.includes('Bread') ? 150 : 49, 
        quantity: 1,
        category: 'Bundle'
      }));
      
    if (itemsToAdd.length > 0) {
      // In our store, addMultipleItems acts as replaceCart currently (set({ items: [...newItems] }))
      // so we pass the combined array:
      addMultipleItems([...items, ...itemsToAdd]);
      addToast(`Added ${itemsToAdd.length} of ${bundleDeal.bundleItems.length} items (others already in cart)`, 'success');
    } else {
      addToast('All bundle items are already in your cart!', 'info');
    }
    setBundleDeal(null);
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" /> Smart Picks for You
      </h2>
      
      {/* Personalized pick */}
      {personalizedPick && (
        <div className="mb-6 p-4 bg-gray-950 rounded-xl border border-amber-500/30">
          <p className="text-sm text-gray-400 mb-2">{personalizedPick.message}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-white">{personalizedPick.item.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-amber-500 font-bold">रू{personalizedPick.item.price}</span>
              <button 
                onClick={() => handleAddToCart(personalizedPick.item)}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bundle Deal Card */}
      {bundleDeal && (
        <div className="mb-6 p-4 bg-amber-500/10 border-2 border-amber-500/50 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="inline-block bg-amber-500 text-gray-950 text-xs font-bold px-2 py-1 rounded-full mb-2">
                🔥 SAVE रू{bundleDeal.savings}
              </span>
              <p className="font-bold text-white">{bundleDeal.bundleItems.join(' + ')}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 line-through">रू{bundleDeal.originalPrice}</span>
                <span className="text-amber-500 font-bold">रू{bundleDeal.dealPrice}</span>
              </div>
            </div>
            <button 
              onClick={handleAddBundleDeal}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-4 py-2 rounded-xl text-sm font-bold transition-colors w-full sm:w-auto"
            >
              Add All 3 Items
            </button>
          </div>
        </div>
      )}
      
      {/* Horizontal scroll recommendations */}
      {recommendations.length > 0 && (
        <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
          {recommendations.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-40 bg-gray-950 rounded-xl border border-gray-800 p-3 shadow-sm hover:border-gray-700 transition-colors">
              <div className="w-full h-24 bg-gray-800 rounded-lg mb-3 flex items-center justify-center text-3xl overflow-hidden">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-80" />
              </div>
              <h4 className="font-bold text-sm text-white truncate" title={item.name}>{item.name}</h4>
              <p className="text-amber-500 font-bold text-sm mt-1">रू{item.price}</p>
              <button 
                onClick={() => handleAddToCart(item)}
                className="mt-3 w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
