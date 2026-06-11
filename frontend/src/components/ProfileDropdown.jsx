import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Receipt, Tag, LogOut, Award, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileDropdown({ isOpen, onClose, onOpenOffers }) {
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    // Clear all luxecafe_* keys from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('luxecafe_')) {
        localStorage.removeItem(key);
      }
    });
    logout();
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute top-14 right-0 w-72 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
      >
        <div className="p-4 border-b border-gray-800 bg-gray-950/50">
          <p className="font-bold text-white truncate">{user.name || 'Rahul Sharma'}</p>
          <p className="text-sm text-gray-400 truncate">{user.email || 'demo@luxecafe.com'}</p>
          <p className="text-xs text-gray-500 mt-1">Member since: January 2026</p>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
              <Award className="w-4 h-4" /> 240 Points
            </span>
            <span className="text-xs text-gray-500">Silver Tier</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">60 more for free brownie!</p>
        </div>

        <div className="p-2 flex flex-col gap-1">
          <Link 
            to="/my-orders" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <Receipt className="w-4 h-4" /> My Orders (3)
          </Link>
          <button 
            onClick={() => {
              onClose();
              if (onOpenOffers) onOpenOffers();
            }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors w-full text-left"
          >
            <Tag className="w-4 h-4" /> My Offers
          </button>
          <Link 
            to="/admin/dashboard" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
          </Link>
        </div>

        <div className="p-2 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors w-full text-left font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
