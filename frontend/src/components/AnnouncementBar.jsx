import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('luxecafe_promo_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('luxecafe_promo_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500 text-black px-4 py-2 flex items-center justify-center relative z-50">
      <p className="text-sm font-semibold tracking-wide flex-1 text-center">
        🎉 Use <span className="font-bold">LUXE20</span> for 20% off your first order!
      </p>
      <button 
        onClick={handleDismiss} 
        className="absolute right-4 p-1 hover:bg-amber-600 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
