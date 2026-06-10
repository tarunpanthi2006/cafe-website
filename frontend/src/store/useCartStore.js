import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  isCartOpen: false,

  addToCart: (item) => {
    set((state) => {
      const existing = state.cartItems.find(i => i.id === item.id);
      if (existing) {
        return {
          cartItems: state.cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i),
          isCartOpen: true
        };
      }
      return {
        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
        isCartOpen: true
      };
    });
  },

  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter(i => i.id !== id)
  })),

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(id);
      return;
    }
    set((state) => ({
      cartItems: state.cartItems.map(i => i.id === id ? { ...i, quantity } : i)
    }));
  },

  clearCart: () => set({ cartItems: [] }),
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
}));

export const useCartTotal = () => useCartStore((state) => 
  state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const useCartCount = () => useCartStore((state) => 
  state.cartItems.reduce((count, item) => count + item.quantity, 0)
);
