# Project: Premium SaaS Cafe Management System

## Vision
Transform the existing cafe website into a high-performance, zero-lag, real-time web application. The system must perfectly synchronize the customer-facing frontend with the staff-facing backend, delivering a premium UX suitable for a commercial SaaS product.

## 1. Frontend UI/UX (Customer View)
* **Navigation Bar:** Must include 'Home', 'Menu', 'Cart', 'My Orders', and 'Profile'.
* **Theme:** Implement a sleek, premium Dark Mode / Midnight Theme.
* **Performance:** Eliminate all rendering lag. Use `useMemo`, `useCallback`, or proper state management (like Redux/Zustand) so the cart and dynamic features update instantly without full-page reloads.
* **Digital Payments:** Integrate a clean checkout UI supporting UPI and QR Code payments.
* **Smart ETA:** Display an "Estimated Preparation Time" at checkout, dynamically calculated based on the current active order queue.

## 2. Backend & Dashboard (Staff View)
* **Real-Time Sync:** Integrate WebSockets (Socket.io) to ensure the staff dashboard receives new orders instantly without page refreshes.
* **Order Pipeline:** Staff must see orders in a pipeline (e.g., New -> Preparing -> Ready).
* **Live Tracking:** When staff updates an order status, the customer's "My Orders" page must update in real-time.

## 3. Pro Feature (Table-Side Ordering)
* **QR Code Ordering:** Add a system where unique QR codes map to specific tables. Scanning the QR code automatically tags the incoming order with that specific table number on the staff dashboard.

## Execution Constraints
* Code must be modular, highly scalable, and fully commented.
* Always run type-checks and build tests after significant changes.