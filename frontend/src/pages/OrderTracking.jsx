import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Circle, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STAGES = {
  placed: { index: 0, label: 'Order Placed' },
  preparing: { index: 1, label: 'Preparing' },
  ready: { index: 2, label: 'Ready' },
  out_for_delivery: { index: 2, label: 'Out for Delivery' },
  served: { index: 3, label: 'Served' },
  delivered: { index: 3, label: 'Delivered' }
};

export default function OrderTracking() {
  const { id } = useParams();
  const [status, setStatus] = useState('placed');
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.orders.getStatus(id);
        setStatus(res.status);
        if ((res.status === 'delivered' || res.status === 'served') && !hasReviewed) {
          setShowReviewModal(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [id, hasReviewed]);

  const currentStage = STATUS_STAGES[status]?.index ?? 0;

  const stages = [
    { index: 0, label: 'Order Placed' },
    { index: 1, label: 'Preparing' },
    { index: 2, label: status === 'ready' || status === 'served' ? 'Ready' : 'Out for Delivery' },
    { index: 3, label: status === 'ready' || status === 'served' ? 'Served' : 'Delivered' },
  ];

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 blur-[100px] rounded-full" />
        
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Track Your Order</h1>
        <p className="text-gray-400 text-center mb-12">Order ID: <span className="font-mono text-gray-300">{id.split('-')[0]}</span></p>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-800 md:left-auto md:top-8 md:right-10 md:bottom-auto md:w-[calc(100%-80px)] md:h-0.5" />
          <div 
            className="absolute left-8 top-10 w-0.5 bg-amber-500 transition-all duration-1000 ease-in-out md:left-auto md:top-8 md:h-0.5"
            style={{ 
              height: window.innerWidth < 768 ? `${(currentStage / 3) * 100}%` : '0.5px',
              width: window.innerWidth >= 768 ? `${(currentStage / 3) * 100}%` : '2px',
            }} 
          />

          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
            {stages.map((stage, i) => {
              const isActive = i <= currentStage;
              const isCurrent = i === currentStage;
              
              return (
                <div key={i} className="flex flex-row md:flex-col items-center gap-4 text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500 ${isActive ? 'bg-amber-500 text-gray-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-gray-800 text-gray-500'}`}
                  >
                    {isActive ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                  </motion.div>
                  <div className="md:mt-2 text-left md:text-center">
                    <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{stage.label}</h3>
                    {isCurrent && <p className="text-sm text-amber-500 animate-pulse">In progress...</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/my-orders" className="text-gray-400 hover:text-white transition-colors underline underline-offset-4">
            View all my orders
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showReviewModal && (
          <ReviewModal 
            onClose={() => {
              setShowReviewModal(false);
              setHasReviewed(true);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { id } = useParams(); // Using order id roughly here since mock data isn't deeply linked to items for the review modal

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      // In a real app we'd review specific items, here we just mock a review for the first item type or generally.
      // For demo, we just pretend it succeeded.
      await new Promise(r => setTimeout(r, 1000));
      onClose();
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 z-[90] shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-2 text-center">How was your food?</h2>
        <p className="text-gray-400 text-center mb-8">We'd love to hear your feedback!</p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={`w-10 h-10 ${star <= (hover || rating) ? 'fill-amber-500 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-gray-700'}`} 
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Any specific comments? (Optional)"
          rows={3}
          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500 resize-none mb-6"
        />

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Skip
          </button>
          <button 
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 transition-colors flex justify-center items-center"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
