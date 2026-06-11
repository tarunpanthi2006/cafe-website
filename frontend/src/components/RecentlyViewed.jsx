import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentlyViewed() {
  const [recentItems, setRecentItems] = useState([]);

  const loadRecentItems = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('luxecafe_recently_viewed')) || [];
      setRecentItems(stored);
    } catch (e) {
      setRecentItems([]);
    }
  };

  useEffect(() => {
    loadRecentItems();
    window.addEventListener('recently_viewed_updated', loadRecentItems);
    return () => window.removeEventListener('recently_viewed_updated', loadRecentItems);
  }, []);

  if (recentItems.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
        <div className="p-3 bg-gray-800 rounded-full">
          <Clock className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h3 className="font-bold text-white mb-1">Recently Viewed</h3>
          <p className="text-sm text-gray-400">Browse our menu to see recently viewed items here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-amber-500" />
        Recently Viewed
      </h3>
      <div className="space-y-4">
        {recentItems.map((item) => (
          <div key={item.id} className="flex gap-4 items-center group cursor-pointer" onClick={() => window.location.href = '/menu'}>
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-500 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-gray-400">{item.category}</p>
              <p className="text-sm font-bold text-amber-500 mt-1">रू {item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
