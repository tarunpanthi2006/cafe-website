import React, { useState, useEffect } from 'react';
import AdminAuth from '../components/AdminAuth';
import KPICard from '../components/KPICard';
import OrderQueueTable from '../components/OrderQueueTable';
import PeakHoursChart from '../components/PeakHoursChart';
import PopularItemsChart from '../components/PopularItemsChart';
import { getOrders, getDashboardAnalytics } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('luxecafe_admin_auth') === 'true'
  );
  
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ordersData, analyticsData] = await Promise.all([
        getOrders(),
        getDashboardAnalytics()
      ]);
      setOrders(ordersData || []);
      setAnalytics(analyticsData || null);
    } catch (err) {
      console.error(err);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(() => {
        loadData();
      }, 10000); // 10s auto refresh
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem('luxecafe_admin_auth');
    setIsAuthenticated(false);
    addToast('Logged out securely', 'info');
  };

  if (!isAuthenticated) {
    return <AdminAuth onLogin={() => {
      setIsAuthenticated(true);
      addToast('Welcome back, Admin!', 'success');
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cafe Owner Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time store metrics and live order queue</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Section 1 - KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Today's Orders" value={analytics?.todayOrders || 0} icon="Receipt" color="blue" />
          <KPICard title="Today's Revenue" value={`रू${analytics?.todayRevenue || 0}`} icon="Wallet" color="green" />
          <KPICard title="Most Popular Item" value={analytics?.popularItem || 'N/A'} icon="Star" color="amber" />
          <KPICard title="Avg. Prep Time" value="18 min" icon="Clock" color="purple" />
        </div>

        {/* Section 2 - Order Queue */}
        <div className="mt-8">
          <OrderQueueTable orders={orders} onRefresh={loadData} isLoading={isLoading} />
        </div>

        {/* Section 3 & 4 - Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <PeakHoursChart data={analytics?.peakHoursData || []} />
          <PopularItemsChart data={analytics?.popularItemsData || []} />
        </div>
      </div>
    </div>
  );
}
