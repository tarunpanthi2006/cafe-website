# Project: Premium SaaS Cafe Management System (Nepal Edition)

## Vision
Transform the existing cafe website into a high-performance, zero-lag, real-time web application tailored specifically for the Nepalese market. The system must perfectly synchronize the customer-facing frontend with the staff-facing backend, delivering a premium UX suitable for a commercial SaaS product.

## 1. Localization & Payments (Nepal Specific)
* **Payment Gateway:** Integrate Khalti API (or eSewa) for digital checkout. Strictly ensure NO Razorpay or Indian payment gateway dependencies exist in the codebase.
* **Currency:** All prices, cart totals, and UI elements must use Nepalese Rupees (NPR / Rs.).
* **Timezone:** All frontend timestamps (Order ETA, order history, staff dashboard notifications) must be strictly formatted to the `Asia/Kathmandu` timezone (UTC +5:45) using native JavaScript Date formatting.

## 2. Frontend UI/UX (Customer View)
* **Navigation Bar:** Must include 'Home', 'Menu', 'Cart', 'My Orders', and 'Profile'.
* **Theme:** Implement a sleek, premium Dark Mode / Midnight Theme.
* **Performance (Zero-Lag):** Eliminate all rendering lag. Use `useMemo`, `useCallback`, or proper state management (like Redux/Zustand) so the cart and dynamic features update instantly without full-page reloads.
* **Smart ETA:** Display an "Estimated Preparation Time" at checkout, dynamically calculated based on the current active order queue.

## 3. Backend & Dashboard (Staff View)
* **Real-Time Sync:** Integrate WebSockets (Socket.io) to ensure the staff dashboard receives new orders instantly without page refreshes.
* **Order Pipeline:** Staff must see orders in a pipeline (e.g., New -> Preparing -> Ready).
* **Live Tracking:** When staff updates an order status, the customer's "My Orders" page must update in real-time.

## 4. Pro Feature (Table-Side Ordering)
* **QR Code Ordering:** Add a system where unique QR codes map to specific tables. Scanning the QR code automatically tags the incoming order with that specific table number on the staff dashboard.

## Execution Constraints
* Code must be modular, highly scalable, and fully commented.
* Always run type-checks and build tests after significant changes to ensure stability.