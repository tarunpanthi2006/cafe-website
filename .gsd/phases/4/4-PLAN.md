# Phase 4: Nepal Localization & Khalti Integration

Following the updated PRD, this phase strips out all Razorpay integration and Indian currency dependencies, replacing them with Khalti, NPR currency, and strict Nepal timezone bindings.

## Proposed Changes

### 1. Strip Razorpay & Integrate Khalti (Backend)
- **[MODIFY] [package.json](file:///Users/tarunpanthi/Desktop/cafe/backend/package.json)**
  - Remove `razorpay` dependency.
- **[MODIFY] [server.js](file:///Users/tarunpanthi/Desktop/cafe/backend/server.js)**
  - Remove Razorpay SDK initialization.
  - Refactor `POST /api/payments/create-order` into `POST /api/payments/khalti/initiate`.
  - Refactor `POST /api/payments/verify` into `POST /api/payments/khalti/verify`.
  - Convert the `menuItems` mock database prices from USD to NPR.

### 2. Frontend Payment Flow & Currency Update
- **[MODIFY] [Cart.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/components/Cart.jsx)**
  - Remove Razorpay script injection and handler.
  - Replace `$` with `Rs.` in cart totals.
- **[MODIFY] [Menu.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/Menu.jsx)**
  - Update `$` symbol to `Rs.`.
- **[MODIFY] [Admin.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/Admin.jsx)**
  - Update `$` to `Rs.`.
- **[MODIFY] [MyOrders.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/MyOrders.jsx)**
  - Update `$` to `Rs.`.

### 3. Timezone Enforcements (`Asia/Kathmandu`)
- **[MODIFY] [Admin.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/Admin.jsx)**
  - Force `toLocaleTimeString` to use `{ timeZone: 'Asia/Kathmandu' }`.
- **[MODIFY] [MyOrders.jsx](file:///Users/tarunpanthi/Desktop/cafe/frontend/src/pages/MyOrders.jsx)**
  - Force `toLocaleTimeString` to use `{ timeZone: 'Asia/Kathmandu' }`.
