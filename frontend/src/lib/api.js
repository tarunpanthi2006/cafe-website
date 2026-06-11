const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMsg = "API request failed";
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch (e) {
      // Ignored
    }
    throw new ApiError(errorMsg, response.status);
  }

  return response.json();
}

export const api = {
  menu: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.veg) query.append('veg', 'true');
      if (params.search) query.append('search', params.search);
      return fetchApi(`/api/menu?${query.toString()}`);
    },
    getPopular: () => fetchApi('/api/menu/popular'),
  },
  orders: {
    create: (data) => fetchApi('/api/orders/', { method: 'POST', body: JSON.stringify(data) }),
    getUserOrders: (userId) => fetchApi(`/api/orders/${userId}`),
    getStatus: (orderId) => fetchApi(`/api/orders/${orderId}/status`),
  },
  promo: {
    validate: (code, cartTotal) => fetchApi('/api/promo/validate', { method: 'POST', body: JSON.stringify({ code, cart_total: cartTotal }) }),
  },
  reviews: {
    create: (data) => fetchApi('/api/reviews/', { method: 'POST', body: JSON.stringify(data) }),
    getForItem: (menuItemId) => fetchApi(`/api/reviews/${menuItemId}`),
  }
};

// --- MOCK API FOR ADMIN DASHBOARD ---

const MOCK_ORDERS = [
  { id: 'ORD-101', user_id: "demo-user-123", customer_name: "Rahul Sharma", items: [{name: "Margherita Pizza", quantity: 1, price: 550}], total_amount: 550, status: "placed", order_type: "delivery", created_at: new Date().toISOString() },
  { id: 'ORD-102', user_id: "demo-user-456", customer_name: "Anita Rai", items: [{name: "Classic Burger", quantity: 2, price: 350}], total_amount: 700, status: "preparing", order_type: "takeaway", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'ORD-103', user_id: "demo-user-789", customer_name: "Suman Shrestha", items: [{name: "Chocolate Shake", quantity: 1, price: 250}, {name: "French Fries", quantity: 1, price: 150}], total_amount: 400, status: "ready", order_type: "takeaway", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'ORD-104', user_id: "demo-user-101", customer_name: "Pooja Gurung", items: [{name: "Garlic Bread", quantity: 1, price: 200}], total_amount: 200, status: "out_for_delivery", order_type: "delivery", created_at: new Date(Date.now() - 5000000).toISOString() },
  { id: 'ORD-105', user_id: "demo-user-202", customer_name: "Bikash Thapa", items: [{name: "Double Cheese Burger", quantity: 1, price: 450}], total_amount: 450, status: "served", order_type: "dine_in", created_at: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
];

export const getOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Sort orders so newest are first
  return [...MOCK_ORDERS].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const updateOrderStatus = async (orderId, newStatus) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    return { success: true, order };
  }
  return { success: false, error: "Order not found" };
};

export const getDashboardAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const today = new Date().toISOString().split('T')[0];
  const todayOrdersList = MOCK_ORDERS.filter(o => o.created_at.startsWith(today));
  
  const todayOrders = todayOrdersList.length;
  const todayRevenue = todayOrdersList.reduce((sum, o) => sum + o.total_amount, 0);
  
  const popularItem = "Margherita Pizza";
  
  return {
    todayOrders,
    todayRevenue,
    popularItem,
    peakHoursData: [
      { hour: '10 AM', orders: 5 }, { hour: '11 AM', orders: 8 },
      { hour: '12 PM', orders: 15 }, { hour: '1 PM', orders: 25 },
      { hour: '2 PM', orders: 18 }, { hour: '3 PM', orders: 12 },
      { hour: '4 PM', orders: 10 }, { hour: '5 PM', orders: 14 },
      { hour: '6 PM', orders: 20 }, { hour: '7 PM', orders: 28 },
      { hour: '8 PM', orders: 30 }, { hour: '9 PM', orders: 22 },
      { hour: '10 PM', orders: 12 },
    ],
    popularItemsData: [
      { name: 'Margherita Pizza', value: 45 },
      { name: 'Classic Burger', value: 38 },
      { name: 'Chocolate Shake', value: 32 },
      { name: 'Garlic Bread', value: 28 },
      { name: 'French Fries', value: 25 },
    ],
  };
};
