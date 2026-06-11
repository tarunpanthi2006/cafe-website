import React, { useState } from 'react';
import { RotateCcw, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { useToast } from '../context/ToastContext';

export default function OrderAgainButton({ pastOrder }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { replaceCart } = useCartStore();
  const { addToast } = useToast();

  const handleOrderAgain = async () => {
    setIsProcessing(true);
    try {
      // 1 & 2. Get past items and current menu
      const currentMenu = await api.menu.getAll({});
      
      const newCartItems = [];
      const missingItems = [];

      // 3. Check each past item against current menu
      pastOrder.items.forEach(pastItem => {
        // the pastItem usually has { menu_item_id, quantity, unit_price } based on the mock backend
        // Let's verify the ID structure. The backend creates order items with `menu_item_id`.
        const menuItemId = pastItem.menu_item_id || pastItem.id;
        
        const currentItem = currentMenu.find(m => m.id === menuItemId);
        
        if (currentItem) {
          // 4a. Exists -> prepare to add to cart
          newCartItems.push({
            ...currentItem,
            quantity: pastItem.quantity
          });
        } else {
          // 4b. Missing -> collect
          missingItems.push(pastItem.name || `Item #${menuItemId}`);
        }
      });

      // 8. Replace cart
      replaceCart(newCartItems);

      // 5. Missing items warning
      if (missingItems.length > 0) {
        addToast(`⚠️ ${missingItems.join(', ')} are no longer available. Skipping.`, 'warning');
      }

      // 6. Success toast
      if (newCartItems.length > 0) {
        addToast(`✅ Added ${newCartItems.length} items from your past order`, 'success');
        // 7. Open Cart drawer
        window.dispatchEvent(new Event('open_cart'));
      } else {
        addToast(`No items from this order are available anymore.`, 'error');
      }

    } catch (err) {
      console.error(err);
      addToast('Failed to process order again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleOrderAgain}
      disabled={isProcessing}
      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-xl text-sm font-bold transition-colors w-full md:w-auto disabled:opacity-50"
    >
      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
      Order Again
    </button>
  );
}
