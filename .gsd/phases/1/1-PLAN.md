---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Foundation & Real-Time Setup

## Objective
Setup Socket.io on both backend and frontend, establish the core Dark Mode theme, and migrate global state management to Zustand for zero-lag performance.

## Context
- .gsd/SPEC.md
- .gsd/ARCHITECTURE.md
- frontend/src/context/CartContext.jsx
- frontend/tailwind.config.js
- frontend/src/index.css
- backend/server.js

## Tasks

<task type="auto">
  <name>Migrate to Zustand</name>
  <files>frontend/package.json, frontend/src/store/useCartStore.js, frontend/src/components/Cart.jsx, frontend/src/components/Navbar.jsx, frontend/src/App.jsx, frontend/src/context/CartContext.jsx</files>
  <action>
    - Install `zustand`.
    - Create `frontend/src/store/useCartStore.js` with the same logic as `CartContext.jsx` but using Zustand.
    - Update `Cart.jsx`, `Navbar.jsx`, and any other consumers to use the Zustand store.
    - Remove `CartContext.jsx` and `CartProvider` from `App.jsx`.
  </action>
  <verify>grep -q "zustand" frontend/package.json && echo "Zustand installed"</verify>
  <done>Zustand is installed and Cart state is managed globally without Context Providers.</done>
</task>

<task type="auto">
  <name>Implement Premium Dark Mode Theme</name>
  <files>frontend/tailwind.config.js, frontend/src/index.css, frontend/src/App.jsx</files>
  <action>
    - Update `tailwind.config.js` to include dark mode colors (e.g., midnight-base: #0f172a, midnight-surface: #1e293b, accent: #FF7F50).
    - Update `index.css` body classes to use the dark theme and update the scrollbar.
    - Update existing components to use the new dark theme classes for a sleek, premium feel.
  </action>
  <verify>grep -q "midnight" frontend/tailwind.config.js && echo "Dark mode configured"</verify>
  <done>The application defaults to a premium Dark Mode aesthetic.</done>
</task>

<task type="auto">
  <name>Integrate Socket.io</name>
  <files>backend/package.json, backend/server.js, frontend/package.json, frontend/src/services/socket.js</files>
  <action>
    - Install `socket.io` in the backend and `socket.io-client` in the frontend.
    - Update `backend/server.js` to use `http.createServer` and attach `socket.io`. Handle basic `connection` and `disconnect` events. Emit a test event when an order is created.
    - Create `frontend/src/services/socket.js` to export the initialized socket client pointing to `http://localhost:5001`.
  </action>
  <verify>grep -q "socket.io" backend/package.json && grep -q "socket.io-client" frontend/package.json && echo "Socket.io installed"</verify>
  <done>Socket.io is installed and running on both backend and frontend.</done>
</task>

## Success Criteria
- [ ] Cart state is managed by Zustand without performance lag.
- [ ] The app renders in a premium dark mode.
- [ ] Socket.io is successfully integrated into the backend and a frontend client is available.
