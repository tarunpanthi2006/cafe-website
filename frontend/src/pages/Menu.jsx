import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { Plus } from 'lucide-react';

const categories = ['All', 'Pizza', 'Burger', 'Cake', 'Shake'];

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const addToCart = useCartStore(state => state.addToCart);


  useEffect(() => {
    fetch('http://localhost:5001/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch menu:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Menu Header */}
      <div className="bg-brand-dark text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            Our Menu
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Crafted with passion, served with love. Choose from our selection of premium delicacies.
          </motion.p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-20 z-40 bg-brand-surface/90 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 md:space-x-8 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
                  activeCategory === category ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-orange rounded-full z-0 shadow-md shadow-brand-orange/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAdd={() => addToCart(item)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 3D Magnetic Tilt Card Component
function MenuItemCard({ item, onAdd }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Calculate rotation limits (max 10 degrees)
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{
        perspective: 1000,
      }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-brand-surface rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-brand-orange/20 transition-all duration-300 flex flex-col h-full group"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative h-56 overflow-hidden" style={{ transform: "translateZ(30px)" }}>
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">
            {item.category}
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow" style={{ transform: "translateZ(20px)" }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
            <span className="text-brand-orange font-bold text-xl ml-4">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-gray-400 text-sm mb-6 flex-grow">{item.description}</p>
          
          <button 
            onClick={onAdd}
            className="w-full py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
            style={{ transform: "translateZ(10px)" }}
          >
            <Plus className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
