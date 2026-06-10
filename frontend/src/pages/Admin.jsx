import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, RefreshCw, Phone, MapPin, User, Clock, CheckCircle, Package } from 'lucide-react';
import { socket } from '../services/socket';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('http://localhost:5001/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    const handleNewOrder = (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    };
    
    const handleOrderUpdated = (updatedOrder) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };

    socket.on('newOrder', handleNewOrder);
    socket.on('orderUpdated', handleOrderUpdated);

    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.off('orderUpdated', handleOrderUpdated);
    };
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      // The update will come back via socket.on('orderUpdated')
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
      case 'Preparing': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      case 'Ready': return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
      case 'Completed': return 'bg-green-400/10 text-green-400 border-green-400/20';
      default: return 'bg-white/10 text-gray-300 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Admin Header */}
      <div className="bg-brand-surface border-b border-white/5 py-12 px-4 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-brand-orange" />
            <h1 className="text-3xl font-serif font-bold text-white">Staff Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <span className="text-gray-400 mr-2">Active Orders:</span>
              <span className="font-bold text-xl text-brand-orange">{orders.filter(o => o.status !== 'Completed').length}</span>
            </div>
            <button 
              onClick={fetchOrders}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center border border-white/10"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-brand-surface rounded-2xl shadow-xl border border-white/5">
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-brand-surface rounded-2xl shadow-xl p-12 text-center border border-white/5 flex flex-col items-center justify-center">
             <Package className="w-20 h-20 text-gray-600 mb-4" />
             <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
             <p className="text-gray-400 max-w-md">Orders placed by customers will appear here in real-time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={order.id} 
                className="bg-brand-surface rounded-2xl shadow-lg border border-white/5 overflow-hidden hover:shadow-xl hover:shadow-brand-orange/5 transition-all"
              >
                {/* Order Header */}
                <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-white">Order #{order.id.split('_')[2]}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400 block mb-1">Total</span>
                    <span className="text-2xl font-bold text-brand-orange">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/5">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-white">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-white">{order.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Table / Address</p>
                      <p className="font-medium text-white">{order.tableOrAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="bg-brand-orange text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm">
                            {item.quantity}x
                          </span>
                          <span className="font-medium text-white">{item.name}</span>
                        </div>
                        <span className="text-gray-400 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3">
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Ready')}
                      className="flex-1 py-3 bg-brand-orange hover:bg-brand-red text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'Ready' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Completed')}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                    >
                      <CheckCircle className="w-5 h-5" /> Complete Order
                    </button>
                  )}
                  {order.status === 'Completed' && (
                    <div className="flex-1 py-3 bg-white/5 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                      <CheckCircle className="w-5 h-5" /> Completed
                    </div>
                  )}
                </div>

              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
