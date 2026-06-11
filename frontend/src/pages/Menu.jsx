import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShoppingBag, Plus, Minus } from 'lucide-react';
import { api } from '../lib/api';
import { useCartStore } from '../store/useCartStore';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [filters, setFilters] = useState({ veg: false, vegan: false, glutenFree: false });
  
  const { addItem, items: cartItems, updateQuantity } = useCartStore();

  const categories = ['All', 'Pizza', 'Burgers', 'Cakes', 'Shakes'];

  const fetchMenu = useCallback(async (currentSearch) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.menu.getAll({ 
        category, 
        veg: filters.veg || filters.vegan, // Simplification for backend matching
        search: currentSearch 
      });
      // Client-side filtering for the other pills since backend only has 'veg' in query param design
      let filtered = data;
      if (filters.vegan) filtered = filtered.filter(i => i.is_vegan);
      if (filters.glutenFree) filtered = filtered.filter(i => i.is_gluten_free);
      
      setItems(filtered);
    } catch (err) {
      setError(err.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, [category, filters]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenu(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchMenu]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-6">
        <h1 className="text-4xl font-bold text-white tracking-tight">Our Menu</h1>
        
        {/* Search and Filters row */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilters(f => ({ ...f, veg: !f.veg }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filters.veg ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600'}`}
            >
              Veg
            </button>
            <button 
              onClick={() => setFilters(f => ({ ...f, vegan: !f.vegan }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filters.vegan ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600'}`}
            >
              Vegan
            </button>
            <button 
              onClick={() => setFilters(f => ({ ...f, glutenFree: !f.glutenFree }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filters.glutenFree ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600'}`}
            >
              Gluten-Free
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-colors ${category === cat ? 'bg-white text-gray-950' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <button onClick={() => fetchMenu(search)} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-[380px] bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800 border-dashed">
          <p className="text-gray-400 text-lg">No matching items found.</p>
          <button onClick={() => { setSearch(''); setFilters({veg:false, vegan:false, glutenFree:false}); setCategory('All'); }} className="mt-4 text-amber-500 hover:text-amber-400 font-medium">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex flex-col group relative transition-transform hover:-translate-y-1 hover:border-gray-700 hover:shadow-2xl hover:shadow-black/50">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[80%]">
                  {item.is_veg && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded backdrop-blur-md border border-green-500/30 shadow-lg">VEG</span>}
                  {item.is_vegan && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded backdrop-blur-md border border-emerald-500/30 shadow-lg">VEGAN</span>}
                  {item.is_gluten_free && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded backdrop-blur-md border border-amber-500/30 shadow-lg">GF</span>}
                </div>
                {item.avg_rating > 0 && (
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-amber-500 flex items-center gap-1 border border-white/10 shadow-lg">
                    ★ {item.avg_rating}
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-amber-500 font-bold text-xl tracking-tight">रू {item.price}</span>
                  {cartItems.find(i => i.id === item.id) ? (
                    <div className="flex items-center gap-2 bg-gray-800 p-1.5 rounded-xl border border-gray-700">
                      <button 
                        onClick={() => updateQuantity(item.id, cartItems.find(i => i.id === item.id).quantity - 1)}
                        className="p-2 rounded-lg hover:bg-gray-700 text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-white min-w-[1.2rem] text-center">
                        {cartItems.find(i => i.id === item.id).quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, cartItems.find(i => i.id === item.id).quantity + 1)}
                        className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-900 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addItem(item)}
                      className="p-3 bg-gray-800 hover:bg-amber-500 text-white hover:text-gray-900 rounded-xl transition-colors shadow-lg active:scale-95"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
