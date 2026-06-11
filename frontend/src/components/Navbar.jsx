import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Coffee, Menu as MenuIcon, Search, MapPin, Tag, Receipt, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import AnnouncementBar from './AnnouncementBar';
import LocationModal from './LocationModal';
import OffersModal from './OffersModal';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar({ onOpenCart }) {
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState('Kathmandu');
  
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('luxecafe_location');
    if (saved) setLocation(saved);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <nav className="sticky w-full z-40 top-0 transition-all duration-300 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* LEFT SIDE: Hamburger (Mobile) + Logo */}
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-amber-500 rounded-xl group-hover:bg-amber-600 transition-colors duration-300 hidden sm:block">
                  <Coffee className="w-6 h-6 text-gray-900" />
                </div>
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-white whitespace-nowrap">
                  Luxe<span className="text-amber-500">Cafe</span>
                </span>
              </Link>
            </div>

            {/* CENTER: Search Bar */}
            <div className="flex-1 flex justify-center px-4">
              <form onSubmit={handleSearch} className={`relative flex items-center ${isSearchExpanded ? 'w-full absolute left-0 px-4 z-50 bg-gray-900 h-20' : 'hidden md:flex w-40 lg:w-64'}`}>
                {isSearchExpanded && (
                  <button type="button" onClick={() => setIsSearchExpanded(false)} className="md:hidden mr-2 text-gray-400">
                    <span className="text-xl">&times;</span>
                  </button>
                )}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search pizza, burger, coffee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </form>
            </div>

            {/* RIGHT SIDE: Actions */}
            <div className="flex items-center gap-2 sm:gap-4 relative">
              
              {/* Mobile Search Toggle */}
              <button 
                className="md:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setIsSearchExpanded(true)}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Location Chip (Desktop/Tablet) */}
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium text-gray-300 transition-colors truncate max-w-[150px]"
              >
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </button>

              {/* Offers Icon */}
              <button 
                onClick={() => setIsOffersModalOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-colors relative"
                title="Active Offers"
              >
                <Tag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-gray-900"></span>
              </button>

              {/* My Orders */}
              <Link 
                to="/my-orders" 
                className="flex items-center gap-1 p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Receipt className="w-5 h-5" />
                <span className="hidden lg:block font-medium text-sm">Orders</span>
              </Link>

              {/* Cart Icon */}
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

              {/* Profile Avatar */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-gray-900 font-bold text-sm ml-1 hover:ring-2 hover:ring-amber-500 hover:ring-offset-2 hover:ring-offset-gray-900 transition-all"
                >
                  R
                </button>
                <ProfileDropdown 
                  isOpen={isProfileOpen} 
                  onClose={() => setIsProfileOpen(false)} 
                  onOpenOffers={() => setIsOffersModalOpen(true)}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 hover:text-white font-medium py-2">Home</Link>
            <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 hover:text-white font-medium py-2">Menu</Link>
            <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 hover:text-white font-medium py-2">My Orders</Link>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); setIsOffersModalOpen(true); }}
              className="w-full text-left text-amber-500 font-medium py-2"
            >
              Active Offers
            </button>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); setIsLocationModalOpen(true); }}
              className="w-full flex items-center gap-2 text-gray-300 hover:text-white font-medium py-2"
            >
              <MapPin className="w-5 h-5 text-amber-500" />
              Location: {location}
            </button>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        location={location}
        setLocation={setLocation}
      />
      <OffersModal 
        isOpen={isOffersModalOpen} 
        onClose={() => setIsOffersModalOpen(false)} 
      />
    </>
  );
}
