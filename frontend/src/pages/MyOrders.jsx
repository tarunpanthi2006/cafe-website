import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatInTimeZone } from 'date-fns-tz';
import { Clock, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.orders.getUserOrders(user.id)
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (authLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  if (!user) return <Navigate to="/" replace />;

  const getStatusColor = (status) => {
    switch(status) {
      case 'placed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'preparing': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'out_for_delivery': 
      case 'ready': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered': 
      case 'served': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const formatDate = (isoString) => {
    try {
      return formatInTimeZone(new Date(isoString), 'Asia/Kathmandu', 'MMM d, yyyy • h:mm a');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800 border-dashed">
          <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-6">You haven't placed any orders yet.</p>
          <Link to="/menu" className="inline-flex px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl transition-colors">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-gray-700 transition-colors">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-gray-500 text-sm font-mono">#{order.id.split('-')[0]}</span>
                </div>
                
                <p className="text-gray-300 text-sm">
                  {order.items.length} items • <span className="font-medium text-white">{order.order_type.replace('_', ' ').toUpperCase()}</span>
                </p>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatDate(order.created_at)}
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3 w-full md:w-auto border-t border-gray-800 pt-4 md:border-0 md:pt-0">
                <span className="text-2xl font-bold text-amber-500 tracking-tight">रू {order.total_amount}</span>
                <Link 
                  to={`/order-tracking/${order.id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-bold transition-colors w-full md:w-auto"
                >
                  Track Order <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
