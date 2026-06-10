# Phase 1 Research: Foundation & Real-Time Setup

## 1. State Management
- **Current state**: Uses `React Context` (`CartContext.jsx`) which triggers re-renders on all consumers whenever state changes.
- **Requirement**: Zero-lag, high performance.
- **Decision**: Migrate to `Zustand` to prevent unnecessary re-renders.

## 2. Real-Time Sync
- **Current state**: None.
- **Requirement**: Socket.io on both backend and frontend.
- **Decision**: Install `socket.io` (backend) and `socket.io-client` (frontend). Create a `socket.js` utility in the frontend.

## 3. Dark Mode Theme
- **Current state**: Light theme (`bg-brand-cream`, `text-brand-dark`).
- **Requirement**: Premium Dark Mode / Midnight Theme.
- **Decision**: Update `tailwind.config.js` to define Midnight theme colors (`midnight-base`, `midnight-surface`, etc.) and apply them in `index.css`.
