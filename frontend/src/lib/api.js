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
