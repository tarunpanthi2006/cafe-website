import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';

const featuredItems = [
  {
    id: 1,
    name: 'Truffle Mushroom Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    rating: 4.9
  },
  {
    id: 2,
    name: 'Spicy Inferno Burger',
    image: 'https://images.unsplash.com/photo-1594212848116-b8dbf932f94d?auto=format&fit=crop&q=80&w=800',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Dark Chocolate Truffle',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    rating: 5.0
  },
  {
    id: 4,
    name: 'Oreo Overload Shake',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&q=80&w=800',
    rating: 4.7
  }
];

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: y1, opacity }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000" 
            alt="Cafe ambiance" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl">
              Taste the Extraordinary
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
              Experience culinary mastery with our artisanal pizzas, handcrafted burgers, decadent cakes, and indulgent shakes.
            </p>
            <Link 
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-red text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,127,80,0.4)]"
            >
              Order Now <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Items Horizontal Scroll */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">Chef's Signatures</h2>
              <p className="text-gray-500">Discover our most loved culinary creations.</p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center gap-1 text-brand-orange font-bold hover:text-brand-red transition-colors">
              View Full Menu <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="flex gap-8 overflow-x-auto pb-8 snap-x scrollbar-hide py-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[300px] md:min-w-[400px] snap-center group cursor-pointer"
              >
                <div className="relative h-[300px] rounded-3xl overflow-hidden mb-6 shadow-xl">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 z-20 shadow-lg">
                    <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                    <span className="font-bold text-sm">{item.rating}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark group-hover:text-brand-orange transition-colors">{item.name}</h3>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link to="/menu" className="inline-flex items-center gap-1 text-brand-orange font-bold hover:text-brand-red transition-colors">
              View Full Menu <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
