import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, RefreshCw, Phone, MapPin, User, Clock, CheckCircle, Package } from 'lucide-react';

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
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders(); // Refresh to get updated data
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Admin Header */}
      <div className="bg-brand-dark text-white py-12 px-4 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-brand-orange" />
            <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
              <span className="text-gray-300 mr-2">Total Orders:</span>
              <span className="font-bold text-xl text-brand-orange">{orders.length}</span>
            </div>
            <button 
              onClick={fetchOrders}
              className="p-3 bg-brand-orange hover:bg-brand-red rounded-lg transition-colors flex items-center justify-center shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-2rem] relative z-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-xl">
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center">
             <Package className="w-20 h-20 text-gray-300 mb-4" />
             <h2 className="text-2xl font-bold text-gray-500 mb-2">No Orders Yet</h2>
             <p className="text-gray-400 max-w-md">Orders placed by customers will appear here in real-time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={order.id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-brand-dark">Order #{order.id.split('_')[2]}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block mb-1">Total</span>
                    <span className="text-2xl font-bold text-brand-orange">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-brand-dark">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-brand-dark">{order.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Table / Address</p>
                      <p className="font-medium text-brand-dark">{order.tableOrAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="bg-brand-orange text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm">
                            {item.quantity}x
                          </span>
                          <span className="font-medium text-brand-dark">{item.name}</span>
                        </div>
                        <span className="text-gray-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-500/20"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Completed')}
                      className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-500/20"
                    >
                      <CheckCircle className="w-5 h-5" /> Mark Completed
                    </button>
                  )}
                  {order.status === 'Completed' && (
                    <div className="flex-1 py-2 bg-gray-200 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                      <CheckCircle className="w-5 h-5" /> Completed
                    </div>
                  )}
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
