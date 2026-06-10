# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Transform the existing cafe website into a high-performance, zero-lag, real-time web application. The system will perfectly synchronize a customer-facing frontend with a staff-facing backend using WebSockets, delivering a premium UX suitable for a commercial SaaS product.

## Goals
1. **Frontend Performance & UX**: Implement a zero-lag, premium Dark Mode frontend with instant state updates for Cart and Menu.
2. **Real-Time Staff Dashboard**: Provide a live order pipeline (New -> Preparing -> Ready) that syncs instantly via WebSockets without page refreshes.
3. **Table-Side Ordering**: Allow customers to scan table-specific QR codes to automatically tag orders to their table.
4. **Digital Payments**: Integrate a production-ready Razorpay payment gateway supporting UPI and QR code payments.
5. **Smart ETA**: Display dynamically calculated preparation times based on the active order queue.

## Non-Goals (Out of Scope)
- Complex multi-tenant architecture for different restaurants (this version focuses on a single cafe).
- Advanced inventory management tracking exact ingredient levels.

## Users
- **Customers**: Will browse the menu, add items to cart, checkout with Razorpay, and view real-time order status updates.
- **Staff/Admins**: Will view incoming orders in a real-time dashboard, update order statuses, and manage the queue.

## Constraints
- **Performance**: Zero rendering lag required; proper state management (`useMemo`, `useCallback`, Redux/Zustand) is mandatory.
- **Real-Time**: Must use WebSockets (Socket.io).
- **Quality**: Code must be modular, highly scalable, fully commented, and rigorously tested (type checks and build tests).

## Success Criteria
- [ ] Customers can place an order and see it appear instantly on the Staff Dashboard.
- [ ] Order status updates reflect instantly on the customer's "My Orders" screen.
- [ ] Razorpay test transactions complete successfully.
- [ ] Scanning a table QR code automatically populates the table number during checkout.
