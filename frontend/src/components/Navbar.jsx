import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, Menu as MenuIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-brand-orange rounded-xl group-hover:bg-brand-red transition-colors duration-300">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-brand-dark">
              Luxe<span className="text-brand-orange">Cafe</span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-brand-dark hover:text-brand-orange font-medium transition-colors">Home</Link>
            <Link to="/menu" className="text-brand-dark hover:text-brand-orange font-medium transition-colors">Menu</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleCart}
              className="relative p-2 text-brand-dark hover:text-brand-orange transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-red rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="md:hidden">
              <MenuIcon className="w-6 h-6 text-brand-dark" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
