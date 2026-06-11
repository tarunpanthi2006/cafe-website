import React, { useState } from 'react';
import { updateOrderStatus } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Loader2 } from 'lucide-react';

export default function OrderQueueTable({ orders, onRefresh, isLoading }) {
  const { addToast } = useToast();
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdate = async (id, status) => {
    setUpdatingId(id);
    const res = await updateOrderStatus(id, status);
    if (res.success) {
      addToast(`Order #${id} status updated to ${status}`, 'success');
      onRefresh();
    } else {
      addToast(res.error || 'Failed to update order', 'error');
    }
    setUpdatingId(null);
  };

  const getStatusBadge = (status) => {
    const map = {
      placed: 'bg-gray-200 text-gray-700',
      preparing: 'bg-blue-100 text-blue-700',
      out_for_delivery: 'bg-amber-100 text-amber-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-purple-100 text-purple-700',
      served: 'bg-purple-100 text-purple-700'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] || map.placed}`}>{status}</span>;
  };

  const pendingOrders = orders.filter(o => ['placed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="font-bold text-lg text-gray-900">📋 Live Orders — Kitchen Display</h2>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-amber-500" />}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Order ID</th>
              <th className="p-4 font-bold">Customer</th>
              <th className="p-4 font-bold">Items</th>
              <th className="p-4 font-bold">Total</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingOrders.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No pending orders in the queue.</td></tr>
            ) : pendingOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-semibold text-gray-900">{order.id}</td>
                <td className="p-4 text-sm text-gray-700">{order.customer_name || 'Guest'}</td>
                <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}>
                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </td>
                <td className="p-4 text-sm font-bold text-amber-600">रू{order.total_amount}</td>
                <td className="p-4 text-sm">{getStatusBadge(order.status)}</td>
                <td className="p-4 text-sm">
                  {order.status === 'placed' && (
                    <button disabled={updatingId === order.id} onClick={() => handleUpdate(order.id, 'preparing')} className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors disabled:opacity-50">
                      {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : 'Start Preparing'}
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button disabled={updatingId === order.id} onClick={() => handleUpdate(order.id, order.order_type === 'delivery' ? 'out_for_delivery' : 'ready')} className="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors disabled:opacity-50">
                      {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : 'Mark Ready'}
                    </button>
                  )}
                  {['ready', 'out_for_delivery'].includes(order.status) && (
                    <button disabled={updatingId === order.id} onClick={() => handleUpdate(order.id, order.order_type === 'delivery' ? 'delivered' : 'served')} className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-200 transition-colors disabled:opacity-50">
                       {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : 'Complete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
