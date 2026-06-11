import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, Menu as MenuIcon } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import AnnouncementBar from './AnnouncementBar';

export default function Navbar({ onOpenCart }) {
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  return (
    <>
      <AnnouncementBar />
      <nav className="sticky w-full z-50 top-0 transition-all duration-300 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-amber-500 rounded-xl group-hover:bg-amber-600 transition-colors duration-300">
                <Coffee className="w-6 h-6 text-gray-900" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Luxe<span className="text-amber-500">Cafe</span>
              </span>
            </Link>

            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">Home</Link>
              <Link to="/menu" className="text-gray-300 hover:text-white font-medium transition-colors">Menu</Link>
              <Link to="/my-orders" className="text-gray-300 hover:text-white font-medium transition-colors">My Orders</Link>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onOpenCart}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-900 transform translate-x-1/4 -translate-y-1/4 bg-amber-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <div className="md:hidden">
                <MenuIcon className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
