import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'dine_in',
      appliedPromo: null,
      
      setOrderType: (type) => set({ orderType: type }),
      
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          };
        });
      },
      
      clearCart: () => set({ items: [], appliedPromo: null }),
      
      replaceCart: (newItems) => set({ items: [...newItems] }),
      
      addMultipleItems: (newItems) => set({ items: [...newItems] }),
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      setAppliedPromo: (promo) => set({ appliedPromo: promo }),
      
      removeAppliedPromo: () => set({ appliedPromo: null })
    }),
    {
      name: 'luxecafe-cart',
    }
  )
);
