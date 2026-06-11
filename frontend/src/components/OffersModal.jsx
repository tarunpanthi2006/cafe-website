import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Copy, Check, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function OffersModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(null);
  const { addToast } = useToast();

  const offers = [
    { code: 'LUXE20', title: '20% off your first order', desc: 'Valid on all items. Max discount रू500.' },
    { code: 'FIRST50', title: '50% off (Limited)', desc: 'Valid for new users only. Max discount रू1000.' }
  ];

  if (!isOpen) return null;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    addToast(`Promo code ${code} copied!`, 'success');
    setTimeout(() => setCopied(null), 2000);
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
            <Tag className="w-6 h-6 text-amber-500" />
            Active Offers
          </h2>

          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.code} className="border border-gray-800 bg-gray-950 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
                
                <h3 className="font-bold text-white text-lg mb-1">{offer.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{offer.desc}</p>
                
                <div className="flex items-center justify-between bg-gray-900 border border-gray-800 p-2 rounded-xl">
                  <span className="font-mono font-bold text-amber-500 px-2 tracking-widest">{offer.code}</span>
                  <button 
                    onClick={() => handleCopy(offer.code)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {copied === offer.code ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied === offer.code ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
