# Phase 2: Core Staff Dashboard & Real-Time Sync

This phase focuses on building the live order pipeline on the admin side and creating the customer-facing "My Orders" experience, fully synchronized in real-time via WebSockets.

## Proposed Changes

### 1. Staff Dashboard Modernization & Real-Time Sync
Currently, `Admin.jsx` relies on 30-second polling and uses the old light theme (`bg-gray-50`, `bg-white`).
- **[MODIFY] [Admin.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/Admin.jsx)**
  - Remove `setInterval` polling.
  - Implement `socket.on('newOrder')` and `socket.on('orderUpdated')` to update the state immediately when events occur.
  - Refactor Tailwind classes to use the Phase 1 dark theme (`bg-brand-dark`, `bg-brand-surface`, `text-white`).

### 2. Customer Order Tracking (My Orders)
Customers need a place to see their order status change in real-time.
- **[MODIFY] [Cart.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/components/Cart.jsx)**
  - On successful checkout, save the customer's phone number to `localStorage`.
  - Add a "View Order" button that redirects to `/my-orders`.
- **[MODIFY] [Navbar.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/components/Navbar.jsx)**
  - Add a link to "My Orders" next to the Menu link.
- **[NEW] [MyOrders.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/MyOrders.jsx)**
  - Create a new premium Dark Mode page displaying the customer's active and past orders.
  - Connect to `socket.io` to animate status changes (e.g., Pending → Preparing) live without refreshing.
- **[MODIFY] [App.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/App.jsx)**
  - Add the `<Route path="/my-orders" element={<MyOrders />} />`.

### 3. Backend Enhancements
- **[MODIFY] [server.js](file:///Users/tarunpanthi/Desktop/cafe/backend/server.js)**
  - Add a lightweight `GET /api/orders/customer/:phone` endpoint to fetch orders specifically for the logged-in customer, avoiding sending all admin orders to the client.
