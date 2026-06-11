import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Clock, ShieldCheck, Sparkles, ChevronRight, ShoppingBag } from 'lucide-react';
import { api } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import RecentlyViewed from '../components/RecentlyViewed';

export default function Home() {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    api.menu.getPopular()
      .then(data => {
        setPopularItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80" 
            alt="Cafe Interior" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            Experience <span className="text-amber-500">Premium</span> Taste
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-md">
            Savor the finest Nepalese ingredients crafted into global delicacies. Zero wait time, perfectly synced.
          </p>
          <div className="pt-8">
            <Link 
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1"
            >
              Order Now <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Best Sellers</h2>
            <p className="text-gray-400">Our most loved creations</p>
          </div>
          <Link to="/menu" className="text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[280px] h-[350px] bg-gray-900 rounded-2xl animate-pulse flex-shrink-0 border border-gray-800" />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {popularItems.map((item) => (
              <div key={item.id} className="min-w-[280px] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex-shrink-0 snap-start group relative transition-transform hover:-translate-y-2">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.is_veg && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded backdrop-blur-md border border-green-500/30">VEG</span>}
                  </div>
                  {item.avg_rating > 0 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-amber-500 flex items-center gap-1 border border-white/10">
                      ★ {item.avg_rating}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col justify-between h-[180px]">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 truncate">{item.name}</h3>
                    <p className="text-amber-500 font-bold text-lg">रू {item.price}</p>
                  </div>
                  <button 
                    onClick={() => addItem(item)}
                    className="w-full py-3 bg-gray-800 hover:bg-amber-500 text-white hover:text-gray-900 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed Section (Horizontal) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <RecentlyViewed />
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-900 border-y border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white">Fresh Ingredients</h3>
              <p className="text-sm text-gray-400">Locally sourced daily</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white">30-min Delivery</h3>
              <p className="text-sm text-gray-400">Hot and fresh to you</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white">FSSAI Certified</h3>
              <p className="text-sm text-gray-400">Guaranteed quality</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white">100% Hygienic</h3>
              <p className="text-sm text-gray-400">Safe prep environment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
