# Phase 3: Razorpay Integration & Smart ETA

This phase addresses the production readiness of the checkout process by embedding Razorpay for real UPI/QR payments, and implements a Smart ETA system to give customers dynamic wait times based on kitchen load.

## Proposed Changes

### 1. Backend Payment & ETA Logic
- **[MODIFY] [server.js](file:///Users/tarunpanthi/Desktop/cafe/backend/server.js)**
  - Integrate the `razorpay` Node.js SDK.
  - Create `POST /api/payments/create-order` to generate a Razorpay order ID.
  - Create `POST /api/payments/verify` to validate payment signatures via HMAC SHA256.
  - Update `POST /api/orders` to dynamically calculate `etaMinutes` based on the current queue length before saving.

### 2. Frontend Razorpay Checkout Flow
- **[MODIFY] [Cart.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/components/Cart.jsx)**
  - Implement dynamic script loading for `https://checkout.razorpay.com/v1/checkout.js`.
  - Overhaul the `handleCheckout` function:
    1. Call backend to create Razorpay Order.
    2. Open Razorpay UI.
    3. On success, verify signature with backend.
    4. Submit final order to `/api/orders`.

### 3. Smart ETA UI Display
- **[MODIFY] [MyOrders.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/MyOrders.jsx)**
  - Retrieve and display the `etaMinutes` property prominently on active orders (e.g., "Estimated Wait: 15 mins").
