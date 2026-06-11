import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Home, Briefcase, Loader2, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function LocationModal({ isOpen, onClose, location, setLocation }) {
  const [address, setAddress] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setAddress('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock geocoding result since we don't have a real maps API
          setTimeout(() => {
            const detectedLoc = 'Detected Location (Mock)';
            localStorage.setItem('luxecafe_location', detectedLoc);
            setLocation(detectedLoc);
            setIsDetecting(false);
            addToast('Location detected successfully', 'success');
            onClose();
          }, 1000);
        },
        (error) => {
          setIsDetecting(false);
          addToast('Could not detect location. Please enter manually.', 'error');
        }
      );
    } else {
      setIsDetecting(false);
      addToast('Could not detect location. Please enter manually.', 'error');
    }
  };

  const handleManualSet = (e) => {
    e.preventDefault();
    if (address.trim()) {
      const loc = address.trim();
      localStorage.setItem('luxecafe_location', loc);
      setLocation(loc);
      addToast(`Location set to ${loc}`, 'success');
      onClose();
    }
  };

  const handleQuickSelect = (loc) => {
    localStorage.setItem('luxecafe_location', loc);
    setLocation(loc);
    addToast(`Location set to ${loc}`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-500" />
            Set Delivery Location
          </h2>

          <button 
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-amber-500 font-bold rounded-xl transition-colors mb-6 border border-amber-500/30 disabled:opacity-50"
          >
            {isDetecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
            {isDetecting ? 'Detecting location...' : 'Detect my location'}
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or enter address</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <form onSubmit={handleManualSet} className="mb-6">
            <div className="flex gap-2">
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter street, area, etc."
                className="flex-1 bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
              />
              <button 
                type="submit"
                disabled={!address.trim()}
                className="px-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 font-bold rounded-xl transition-colors"
              >
                Set
              </button>
            </div>
          </form>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Saved Addresses</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleQuickSelect('Kathmandu, Lakeside Road')}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 hover:border-gray-600 bg-gray-950 transition-colors text-left"
              >
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Home className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Home</div>
                  <div className="text-xs text-gray-500">Kathmandu, Lakeside Road</div>
                </div>
              </button>
              <button 
                onClick={() => handleQuickSelect('Kathmandu, Durbar Marg')}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 hover:border-gray-600 bg-gray-950 transition-colors text-left"
              >
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Briefcase className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Office</div>
                  <div className="text-xs text-gray-500">Kathmandu, Durbar Marg</div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
