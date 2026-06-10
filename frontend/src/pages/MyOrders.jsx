import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Package, ExternalLink } from 'lucide-react';
import { socket } from '../services/socket';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const phone = localStorage.getItem('customerPhone');

  useEffect(() => {
    if (!phone) {
      setIsLoading(false);
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/orders/customer/${phone}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch my orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();

    // Listen to real-time updates for my orders
    const handleOrderUpdated = (updatedOrder) => {
      if (updatedOrder.phone === phone) {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      }
    };

    socket.on('orderUpdated', handleOrderUpdated);

    return () => {
      socket.off('orderUpdated', handleOrderUpdated);
    };
  }, [phone]);

  if (!phone) {
    return (
      <div className="min-h-screen bg-brand-dark pt-24 pb-12 flex flex-col items-center justify-center px-4">
        <Package className="w-20 h-20 text-gray-600 mb-6" />
        <h1 className="text-3xl font-serif font-bold text-white mb-2">No Active Orders</h1>
        <p className="text-gray-400 text-center max-w-md">
          You haven't placed any orders yet, or your order history has been cleared from this device.
        </p>
      </div>
    );
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Pending':
        return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock, text: 'Order Received' };
      case 'Preparing':
        return { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircle, text: 'Preparing Your Food' };
      case 'Ready':
        return { color: 'text-brand-orange', bg: 'bg-brand-orange/10', icon: Package, text: 'Ready for Pickup / Serving' };
      case 'Completed':
        return { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle, text: 'Completed' };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-400/10', icon: Clock, text: status };
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            My Orders
          </motion.h1>
          <p className="text-gray-400">Tracking orders for <span className="font-bold text-white">{phone}</span></p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
           <div className="bg-brand-surface rounded-3xl p-12 text-center border border-white/5 flex flex-col items-center justify-center">
             <Package className="w-16 h-16 text-gray-600 mb-4" />
             <h2 className="text-2xl font-bold text-white mb-2">No Recent Orders</h2>
             <p className="text-gray-400">Your recent orders will appear here.</p>
           </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => {
                const statusInfo = getStatusDisplay(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={order.id}
                    className="bg-brand-surface rounded-3xl border border-white/5 overflow-hidden shadow-xl"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Order #{order.id.split('_')[2]}</p>
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg} ${statusInfo.color} font-bold text-sm`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.text}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-brand-orange">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-dark flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white">{item.name}</h4>
                                <p className="text-gray-400 text-sm">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                        <span>Placed at {new Date(order.createdAt).toLocaleTimeString()}</span>
                        <span>{order.tableOrAddress}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
