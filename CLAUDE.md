# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # start server (nodemon) + client (vite) concurrently
npm run server       # server only (nodemon)
npm run client       # client only (vite)
```

### Tests
```bash
# Server tests (Jest + Supertest + MongoDB Memory Server)
npm test                          # all server tests
npm test -- --testPathPattern=bookingRoutes   # single test file

# Client tests (Vitest)
cd client && npm test             # watch mode
cd client && npm run test:run     # run once
```

### Build / Lint
```bash
cd client && npm run build        # production build
cd client && npm run lint         # ESLint
```

## Environment

Copy `.env.example` and fill in:
- `MONGO_URI` — production MongoDB connection string
- `MONGO_URI_TEST` — test database (MongoDB Memory Server overrides this in tests)
- `JWT_SECRET` — used to sign the admin session cookie `roomledger_admin`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — hardcoded admin credentials (no user table)
- `CLIENT_ORIGIN` — CORS allow-origin (default `http://localhost:5173`)
- `PORT` — default `5000`

Client needs `VITE_API_URL` set (e.g. `http://localhost:5000`) — the Vitest setup stubs this to `http://localhost:5000`.

## Architecture

### Request flow
```
Browser → React (Vite :5173)
          ↓ Axios (withCredentials, VITE_API_URL)
Express (:5000) → route → controller → Mongoose → MongoDB
          ↓
   HttpError → errorMiddleware → JSON 4xx/5xx
```

### Auth model
Single admin account — credentials in env vars. Login sets an `httpOnly` JWT cookie (`roomledger_admin`). The `requireAdmin` middleware in [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js) verifies that cookie on every protected admin route. Redux `authSlice` mirrors the session state on the client; `ProtectedAdminRoute` gates `/admin/dashboard`.

### Server layout
- [server/app.js](server/app.js) — Express setup, CORS, route mounting
- [server/config/env.js](server/config/env.js) — validates required env vars at startup (skipped in `NODE_ENV=test`)
- [server/constants/booking.js](server/constants/booking.js) — canonical business rules (work hours 08:00–17:00, slot interval 60 min, blocking statuses)
- [server/utils/overlap.js](server/utils/overlap.js) — booking conflict detection
- [server/utils/seedRooms.js](server/utils/seedRooms.js) — idempotent room seed on startup

### Client layout
- [client/src/redux/providers.jsx](client/src/redux/providers.jsx) — wraps the tree with Redux + React Query; Query defaults: `retry: 1`, `staleTime: 30s`
- [client/src/lib/api.js](client/src/lib/api.js) — single Axios instance; all services import from here
- [client/src/hooks/queries/](client/src/hooks/queries/) — TanStack Query read hooks
- [client/src/hooks/mutations/](client/src/hooks/mutations/) — TanStack Query write hooks
- [client/src/services/](client/src/services/) — raw Axios calls; hooks wrap these

### Data model
`Booking` has a composite index on `(room, date, status, startTime, endTime)` — used for overlap queries. `bookingId` is a human-readable unique ID generated in [server/utils/bookingId.js](server/utils/bookingId.js). Date is stored as a `YYYY-MM-DD` string; times as `HH:MM` strings.

### Server test helpers
[server/tests/helpers.js](server/tests/helpers.js) provides:
- `firstRoom()` — returns the first seeded room document
- `validBooking(overrides)` — returns a valid booking payload
- `createBooking(overrides)` — POST to `/api/bookings` and return the response
- `adminAgent()` — returns a Supertest agent already logged in as admin

Each test run gets a fresh in-memory MongoDB; rooms are re-seeded in `beforeEach`.
