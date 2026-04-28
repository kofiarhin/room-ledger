# RoomLedger Full Implementation Plan

## Source Spec

- Spec: `_spec/roomledger-full-implementation.md`
- Brief: `roomledger_project_brief.txt`
- Current state: minimal Vite React placeholder client and minimal Express backend with only `GET /`.

## Implementation Principles

- Build vertical slices that keep the app runnable after each major phase.
- Backend validation is the source of truth for booking rules and admin authorization.
- Frontend server state must use TanStack Query through custom hooks.
- Frontend API calls must use `client/src/lib/api.js` and service modules.
- Redux is allowed only for global auth/UI state, not duplicated booking or room data.
- Tailwind should be the primary styling system for new UI.
- Preserve the flat `server/` structure; do not introduce `server/src/`.

## Decisions To Lock Before Coding

1. Admin auth mode: use httpOnly cookie with JWT.
   - Reason: browser-only admin dashboard, safer token storage, simple session restoration through `/api/admin/me`.
   - Required server dependencies: `jsonwebtoken`, `bcryptjs`, `cookie-parser`.
   - Required CORS setting: credentials enabled with `CLIENT_ORIGIN`.
2. Pending bookings block availability.
   - Reason: avoids double-requesting the same room/time while admins review.
3. Public status edit is booking-ID-only.
   - Reason: matches brief; communicate that possession of the booking ID controls access.
   - Public booking status access can view all booking details, but edit and cancel actions are allowed only while `status === "pending"`.
   - If status is `approved`, `denied`, or `cancelled`, the public status view and API behavior are read-only.
4. Dates are stored as `YYYY-MM-DD` strings.
   - Reason: simpler date-only comparison and avoids timezone drift for MVP.
5. Time values are stored as `HH:mm` 24-hour strings and compared via minute conversion.

## Phase 0: Dependency And Script Setup

### Goals

Prepare the repo for backend auth/testing and frontend routing/query/testing/styling.

### Tasks

1. Update root `package.json`.
   - Add backend dependencies: `bcryptjs`, `cookie-parser`, `jsonwebtoken`, `nodemon` if missing.
   - Add backend dev dependencies: `jest`, `supertest`, `cross-env` if needed for test env.
   - Replace placeholder `test` script with backend test command or add `test:server`.
   - Keep existing `dev`, `server`, `client`, and `start` commands working.
2. Update `client/package.json`.
   - Add `react-router-dom`, `@tanstack/react-query`, `@reduxjs/toolkit`, `react-redux`, `axios`.
   - Add Tailwind tooling appropriate for installed Vite version.
   - Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
   - Add scripts: `test`, `test:run` if desired.
3. Add env examples.
   - Root `.env.example`: `MONGO_URI`, `MONGO_URI_TEST`, `PORT`, `CLIENT_ORIGIN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `NODE_ENV`.
   - `client/.env.example`: `VITE_API_URL`.
4. Add test config only where necessary.
   - Prefer Vite/Vitest config in `client/vite.config.js`.
   - Prefer Jest config in root `package.json` or `jest.config.js`.

### Verification

- `npm install` at root succeeds.
- `npm install --prefix client` succeeds.
- `npm run client` still starts Vite.
- `npm run server` still starts the server, except where env fail-fast is intentionally introduced later.

## Phase 1: Backend Foundation

### Goals

Add database connection, environment validation, app middleware, and stable error responses.

### Files To Create

- `server/config/env.js`
- `server/config/db.js`
- `server/middleware/errorMiddleware.js`
- `server/middleware/notFoundMiddleware.js`
- `server/utils/asyncHandler.js`

### Files To Update

- `server/app.js`
- `server/server.js`

### Tasks

1. Implement `server/config/env.js`.
   - Load `dotenv`.
   - Validate required env vars on startup.
   - In `test` mode, allow test-specific defaults only if tests explicitly provide them.
   - Export normalized config values.
2. Implement `server/config/db.js`.
   - Connect Mongoose using `MONGO_URI`.
   - Log connection success without exposing secrets.
   - Exit process on production connection failure.
3. Update `server/app.js`.
   - Add JSON parsing.
   - Add cookie parsing.
   - Add CORS configured from `CLIENT_ORIGIN` with credentials.
   - Keep `GET /` welcome route.
   - Add `GET /api/health`.
   - Mount placeholder route modules once created in later phases.
   - Add not-found and error middleware last.
4. Update `server/server.js`.
   - Load env.
   - Connect DB.
   - Seed rooms after DB connection in non-test runtime.
   - Start app on configured `PORT`.

### Verification

- `GET /` returns the existing welcome message or a compatible API welcome.
- `GET /api/health` returns `{ ok: true }`.
- Missing required env vars fail fast with actionable messages.

## Phase 2: Booking Domain Core

### Goals

Create the data model, constants, and reusable booking logic before routes.

### Files To Create

- `server/constants/booking.js`
- `server/constants/rooms.js`
- `server/models/Room.js`
- `server/models/Booking.js`
- `server/utils/bookingId.js`
- `server/utils/bookingValidation.js`
- `server/utils/overlap.js`
- `server/utils/seedRooms.js`

### Tasks

1. Define booking constants.
   - Working start: `08:00`.
   - Working end: `17:00`.
   - Slot interval: 60 minutes.
   - Durations: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` hours.
   - Blocking statuses: `pending`, `approved`.
   - All statuses: `pending`, `approved`, `denied`, `cancelled`.
   - Departments:
     ```js
     DEPARTMENTS = [
       "HR",
       "Finance",
       "IT",
       "Operations",
       "Marketing",
       "Sales",
       "Management",
       "Other"
     ]
     ```
2. Define room constants.
   - `Conference Room A` / `conference-room-a`.
   - `Conference Room B` / `conference-room-b`.
3. Create `Room` model.
   - `name`, `slug`, `isActive`, timestamps.
   - Unique indexes on `name` and `slug`.
4. Create `Booking` model.
   - Fields from the spec, including optional `requesterPhone`.
   - Enforce `department` as a required enum using the department constants.
   - Store `date` as `YYYY-MM-DD`.
   - Add indexes for `bookingId`, `room/date`, and status-based queries.
5. Implement time utilities.
   - Convert `HH:mm` to minutes.
   - Convert minutes to `HH:mm`.
   - Calculate end time from start and duration.
   - Validate weekday and working-hours boundaries.
   - Enforce hourly slot starts only.
6. Implement overlap helper.
   - Query blocking bookings by room/date/status.
   - Exclude current booking ID when editing.
   - Apply `newStart < existingEnd && newEnd > existingStart`.
7. Implement booking ID generator.
   - Use readable format such as `RL-YYYYMMDD-XXXX`.
   - Retry on duplicate key conflict.
8. Implement room seeding.
   - Upsert two initial rooms by slug.
   - Do not delete user-modified rooms.

### Verification

- Unit-testable utilities produce correct minute conversions and overlap outcomes.
- Room seed is idempotent.
- Mongoose models load without circular dependencies.

## Phase 3: Public Backend API

### Goals

Implement public room, availability, and booking workflows.

### Files To Create

- `server/controllers/roomController.js`
- `server/controllers/availabilityController.js`
- `server/controllers/bookingController.js`
- `server/routes/roomRoutes.js`
- `server/routes/availabilityRoutes.js`
- `server/routes/bookingRoutes.js`

### Files To Update

- `server/app.js`

### Tasks

1. Implement `GET /api/rooms`.
   - Return active rooms sorted by name.
   - Return public-safe fields: `id`, `name`, `slug`, `isActive`.
2. Implement `GET /api/rooms/:roomIdOrSlug`.
   - Accept either a Mongo ID or room slug.
   - Return one active room with public-safe fields.
   - Use this endpoint for the frontend room detail/booking page.
3. Implement `GET /api/availability?roomId=&date=`.
   - Accept `roomId` as a Mongo ID or slug.
   - Validate active room.
   - Validate `YYYY-MM-DD` weekday.
   - Return blocked intervals from pending/approved bookings.
   - Return hourly start slots and valid hourly durations per slot.
4. Implement `POST /api/bookings`.
   - Validate body fields, including optional `requesterPhone`.
   - Reject any `department` value outside the department enum.
   - Reject non-hourly start times and non-hourly durations.
   - Calculate `endTime`.
   - Check conflicts.
   - Generate `bookingId`.
   - Create pending booking.
   - Return confirmation payload.
5. Implement `GET /api/bookings/status/:bookingId`.
   - Normalize booking ID input.
   - Return public-safe booking details with room info.
   - Return 404 for unknown ID.
   - This endpoint is read-only for all statuses.
6. Implement `PATCH /api/bookings/status/:bookingId`.
   - Require existing booking status `pending`.
   - Allow only public-editable fields.
   - Reject updates when status is `approved`, `denied`, or `cancelled`.
   - Validate optional `requesterPhone` when present.
   - Reject any `department` value outside the department enum.
   - Reject non-hourly start times and non-hourly durations.
   - Recalculate time and conflicts.
   - Return updated booking.
7. Implement `PATCH /api/bookings/status/:bookingId/cancel`.
   - Require status `pending`.
   - Reject cancellation when status is `approved`, `denied`, or `cancelled`.
   - Set status `cancelled`.
   - Return updated booking.
8. Mount routes in `server/app.js`.

### Verification

- Public endpoints return consistent JSON shape: `data` on success, `message` on error.
- Back-to-back bookings are allowed.
- Exact, partial, and containment overlaps are rejected.
- Denied/cancelled bookings do not block new bookings.

## Phase 4: Admin Backend API

### Goals

Add secure admin login/session restoration and protected booking management.

### Files To Create

- `server/controllers/adminAuthController.js`
- `server/controllers/adminBookingController.js`
- `server/middleware/authMiddleware.js`
- `server/routes/adminRoutes.js`

### Files To Update

- `server/app.js`
- `server/config/env.js`

### Tasks

1. Implement admin login.
   - `POST /api/admin/login`.
   - Validate email/password.
   - Compare password against `ADMIN_PASSWORD_HASH`.
   - Sign JWT with `JWT_SECRET`.
   - Set httpOnly cookie with secure attributes based on `NODE_ENV`.
   - Return `{ email }` only.
2. Implement admin logout.
   - `POST /api/admin/logout`.
   - Clear cookie.
3. Implement current admin endpoint.
   - `GET /api/admin/me`.
   - Return admin identity when cookie token is valid.
4. Implement auth middleware.
   - Read and verify cookie token.
   - Reject missing/invalid/expired tokens with 401.
5. Implement `GET /api/admin/bookings`.
   - Support filters: `status`, `roomId`, `date`, `q`.
   - Populate room.
   - Sort newest first, then date/start time where useful.
6. Implement `PATCH /api/admin/bookings/:id`.
   - Admin can edit booking fields and status where valid.
   - Recalculate time and conflicts when room/date/time/duration/status changes.
   - Enforce hourly slots and valid hourly durations.
   - Enforce department enum values.
7. Implement approve endpoint.
   - `PATCH /api/admin/bookings/:id/approve`.
   - Recheck conflicts immediately before setting approved.
8. Implement deny endpoint.
   - `PATCH /api/admin/bookings/:id/deny`.
   - Accept optional `adminNote`.
   - Set status `denied`.
9. Implement delete endpoint.
   - `DELETE /api/admin/bookings/:id`.
   - Return success without leaking internals.

### Verification

- Unauthenticated admin routes return 401.
- Invalid credentials return 401 without revealing whether email exists.
- Approve fails if a conflict was created after request submission.
- Deny does not require conflict checks.

## Phase 5: Backend Tests

### Goals

Lock the booking rules and admin protection before building the UI.

### Files To Create

- `server/tests/setup.js`
- `server/tests/roomRoutes.test.js`
- `server/tests/availabilityRoutes.test.js`
- `server/tests/bookingRoutes.test.js`
- `server/tests/adminRoutes.test.js`

### Tasks

1. Configure test database strategy.
   - Prefer a dedicated `MONGO_URI_TEST` if available.
   - If adding `mongodb-memory-server`, document the dependency and ensure it works on the target machine.
2. Add setup/teardown.
   - Connect before tests.
   - Clear collections between tests.
   - Seed rooms before each relevant suite.
   - Disconnect after tests.
3. Test rooms and availability.
   - Active rooms list.
   - Single room lookup by Mongo ID.
   - Single room lookup by slug.
   - Weekend rejection.
   - Invalid room rejection.
   - Hourly slot generation and blocked intervals.
4. Test public bookings.
   - Valid creation.
   - Required field errors.
   - Invalid email.
   - Optional phone accepted when valid.
   - Non-enum department rejection.
   - Out-of-hours rejection.
   - Non-hourly slot or duration rejection.
   - Overlap rejection.
   - Public lookup.
   - Pending edit/cancel.
   - Approved, denied, and cancelled bookings are read-only through public routes.
5. Test admin.
   - Login success/failure.
   - Protected route rejection.
   - List filters.
   - Approve, deny, edit, delete.
   - Conflict recheck on approve/edit.

### Verification

- `npm test` or `npm run test:server` passes.
- Tests do not depend on production data.
- Tests do not require real admin password values.

## Phase 6: Frontend Foundation

### Goals

Replace the placeholder app shell with routing, providers, shared API, and base UI system.

### Files To Create

- `client/src/lib/api.js`
- `client/src/redux/store.js`
- `client/src/redux/providers.jsx`
- `client/src/redux/auth/authSlice.js`
- `client/src/redux/ui/uiSlice.js`
- `client/src/routes/AppRouter.jsx`
- `client/src/routes/ProtectedAdminRoute.jsx`
- `client/src/services/roomService.js`
- `client/src/services/availabilityService.js`
- `client/src/services/bookingService.js`
- `client/src/services/adminService.js`
- `client/src/hooks/queries/useRooms.js`
- `client/src/hooks/queries/useRoom.js`
- `client/src/hooks/queries/useAvailability.js`
- `client/src/hooks/queries/useBookingStatus.js`
- `client/src/hooks/queries/useAdminBookings.js`
- `client/src/hooks/mutations/useCreateBooking.js`
- `client/src/hooks/mutations/useUpdateBooking.js`
- `client/src/hooks/mutations/useCancelBooking.js`
- `client/src/hooks/mutations/useAdminAuth.js`
- `client/src/hooks/mutations/useAdminBookingActions.js`

### Files To Update

- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/index.css`
- `client/src/App.css`
- `client/vite.config.js`

### Tasks

1. Configure Tailwind.
   - Replace placeholder CSS with app tokens and Tailwind base layers.
   - Use neutral palette with one restrained accent.
   - Avoid purple/blue glow styling.
2. Implement provider stack.
   - Redux provider.
   - TanStack Query client provider.
   - React Router provider.
3. Implement shared API client.
   - Base URL from `import.meta.env.VITE_API_URL`.
   - `withCredentials: true` for admin cookie auth.
   - Normalize error messages for UI.
4. Implement services and hooks.
   - Keep raw Axios calls in services.
   - Keep query keys stable and colocated near hooks.
5. Implement route shell.
   - Shared top navigation.
   - Public links only: Rooms and Status. Admin routes must not appear in public navigation.
   - Main content container.
6. Implement reusable UI primitives.
   - `Button`, `InputField`, `SelectField`, `TextareaField`.
   - `StatusBadge`, `SkeletonBlock`, `ErrorMessage`, `EmptyState`.
   - `ConfirmDialog` for delete/cancel actions.

### Design Guardrails

- Dashboard/software UI should use sans-serif typography only.
- Use CSS Grid for responsive layouts.
- Use `min-h-[100dvh]` if full-viewport screens are needed.
- All form labels sit above inputs.
- Provide loading, empty, error, and success states from the beginning.
- Use cards only for individual repeated items, dialogs, and framed tools.

### Verification

- `npm run lint --prefix client` passes after foundation files exist.
- App loads with route shell and no console errors.
- Missing `VITE_API_URL` produces a clear configuration failure or documented default only if explicitly chosen.

## Phase 7: Public Frontend Flows

### Goals

Implement home, room booking, confirmation, and status management.

### Files To Create

- `client/src/pages/HomePage.jsx`
- `client/src/pages/RoomBookingPage.jsx`
- `client/src/pages/StatusPage.jsx`
- `client/src/pages/BookingConfirmationPage.jsx` if using a route instead of in-place state.
- `client/src/components/layout/AppLayout.jsx`
- `client/src/components/rooms/RoomSelector.jsx`
- `client/src/components/availability/DatePickerField.jsx`
- `client/src/components/availability/SlotPicker.jsx`
- `client/src/components/bookings/BookingForm.jsx`
- `client/src/components/bookings/BookingSummary.jsx`
- `client/src/components/bookings/BookingStatusPanel.jsx`
- `client/src/components/bookings/EditBookingForm.jsx`

### Tasks

1. Build home page.
   - Brand: `RoomLedger`.
   - Tagline: `Smart scheduling. Zero conflicts.`
   - Two room choices loaded from API.
   - Status lookup call-to-action.
   - Loading and empty states for rooms.
2. Build room booking page.
   - Load room by slug with `GET /api/rooms/:roomIdOrSlug`.
   - Date input defaults to next valid weekday or today if valid.
   - Fetch availability by selected room/date.
   - Show blocked intervals and hourly available slots.
   - Disable weekend dates in UI where practical.
3. Build booking form.
   - Fields: name, email, optional phone, department, purpose, start time, duration.
   - Department is selected from the backend-defined enum values.
   - Derive available hourly durations from selected hourly slot.
   - Client-side validation for required fields, email format, enum department values, hourly start times, and hourly durations.
   - Disable submit while mutation is pending.
4. Build booking confirmation.
   - Display booking ID prominently.
   - Show room/date/time/status.
   - Provide link to `/status`.
5. Build status page.
   - Lookup by booking ID.
   - Show not-found state.
   - Show booking details and status badge.
   - If status is `pending`, allow edit and cancel.
   - If status is `approved`, `denied`, or `cancelled`, render booking details as read-only and hide edit/cancel actions.
6. Add accessible destructive confirmations.
   - Cancel booking requires confirmation dialog.

### Verification

- Public user can complete booking flow against local API.
- Invalid client inputs show inline errors.
- Server-side validation errors show near the relevant action.
- Mobile layout is single-column and no text overlaps.

## Phase 8: Admin Frontend Flows

### Goals

Implement admin login, protected route handling, and dashboard actions.

### Files To Create

- `client/src/pages/AdminLoginPage.jsx`
- `client/src/pages/AdminDashboardPage.jsx`
- `client/src/components/admin/AdminBookingTable.jsx`
- `client/src/components/admin/AdminBookingFilters.jsx`
- `client/src/components/admin/AdminBookingActions.jsx`
- `client/src/components/admin/AdminBookingEditor.jsx`
- `client/src/components/admin/AdminMetrics.jsx`

### Tasks

1. Build admin login page.
   - Email/password fields.
   - Inline invalid credentials error.
   - Disable submit while pending.
   - Redirect authenticated admins to dashboard.
2. Implement session restoration.
   - Call `/api/admin/me` on app/admin route load.
   - Store only minimal admin identity in Redux auth slice.
3. Implement protected admin route.
   - Loading state while session is checked.
   - Redirect unauthenticated users to `/admin/login`.
4. Build dashboard layout.
   - Summary metrics: total bookings, pending bookings, approved bookings, denied bookings, and cancelled bookings.
   - Filters: room, date, status, search.
   - Booking table with responsive fallback for small screens.
5. Implement admin actions.
   - Approve pending booking.
   - Deny with optional note.
   - Edit booking details in dialog or drawer.
   - Delete with confirmation.
   - Invalidate/refetch relevant queries after mutation.
6. Implement action failure handling.
   - Conflict on approve/edit shows clear message.
   - Auth expiry redirects or prompts login.

### Verification

- Admin can log in, refresh, remain authenticated, and log out.
- Unauthenticated dashboard access redirects to login.
- All admin actions update UI after success.
- Empty filtered table has a useful empty state.

## Phase 9: Frontend Tests

### Goals

Cover public and admin behavior without requiring a live backend.

### Files To Create

- `client/test/setup/setup.js`
- `client/test/pages/HomePage.test.jsx`
- `client/test/pages/RoomBookingPage.test.jsx`
- `client/test/pages/StatusPage.test.jsx`
- `client/test/pages/AdminDashboardPage.test.jsx`
- `client/test/routes/ProtectedAdminRoute.test.jsx`

### Tasks

1. Configure Vitest with jsdom and Testing Library setup.
2. Mock service layer or API client, not individual Axios internals where possible.
3. Test home page.
   - Rooms render.
   - Loading and empty states render.
4. Test booking page.
   - Availability loads.
   - Form validation works.
   - Successful submit displays booking ID.
5. Test status page.
   - Lookup loading, found, not found.
   - Pending booking shows edit/cancel.
   - Approved, denied, and cancelled bookings render as read-only and hide edit/cancel.
6. Test admin dashboard.
   - Protected route handling can be tested at route level.
   - Bookings render.
   - Total, pending, approved, denied, and cancelled metrics render.
   - Approve/deny/edit/delete controls call expected mutations.
7. Keep all frontend tests under `client/test/`.
   - Do not place tests inside `client/src/`.
   - Use `client/test/setup/setup.js` as the centralized setup file.

### Verification

- `npm run test:run --prefix client` passes.
- Tests assert visible user behavior, not implementation details.

## Phase 10: Integration, Polish, And Hardening

### Goals

Connect the full app, clean rough edges, and verify the MVP end to end.

### Tasks

1. Run full local stack.
   - Configure `.env` and `client/.env`.
   - Start `npm run dev`.
2. Manually verify public booking.
   - Select each room.
   - Book valid slot.
   - Attempt overlapping slot.
   - Attempt weekend/out-of-hours if UI allows direct request.
   - Check status.
   - Edit pending booking.
   - Cancel pending booking.
3. Manually verify admin.
   - Log in.
   - Filter bookings.
   - Approve booking.
   - Deny booking with note.
   - Edit booking.
   - Delete booking.
   - Log out.
4. Verify security posture.
   - No `passwordHash` or sensitive values in responses.
   - Admin endpoints reject unauthenticated requests.
   - Cookies use proper secure/same-site settings by environment.
5. Verify responsive UI.
   - Mobile width around 375px.
   - Tablet width around 768px.
   - Desktop width around 1440px.
   - No overlapping text or layout shifts.
6. Run final commands.
   - `npm test` or `npm run test:server`.
   - `npm run test:run --prefix client`.
   - `npm run lint --prefix client`.
   - `npm run build --prefix client`.

### Verification

- All acceptance criteria from `_spec/roomledger-full-implementation.md` are satisfied.
- No known console errors in the browser.
- No server stack traces are returned to clients in production mode.

## Suggested Slice Order For Implementation

1. Backend app foundation and env validation.
2. Room/booking models and booking utilities.
3. Public API routes and backend tests.
4. Admin API routes and backend tests.
5. Frontend provider/router/API foundation.
6. Public booking UI.
7. Status lookup/edit/cancel UI.
8. Admin login/session UI.
9. Admin dashboard/action UI.
10. Frontend tests and final polish.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Timezone drift with Date objects | Bookings appear on wrong day | Store date as `YYYY-MM-DD`; compare times as minutes |
| Public booking ID grants pending edit access | Anyone with ID can edit or cancel a pending request | Treat booking ID as secret; enforce read-only behavior once status is approved, denied, or cancelled |
| Pending bookings blocking availability may frustrate users | Slots can be held by unapproved requests | This is intentional for MVP; revisit when email/expiry exists |
| Cookie auth across frontend/backend domains | Login may fail in deployment | Configure `CLIENT_ORIGIN`, CORS credentials, same-site/secure flags |
| Overlap race condition | Two requests can pass conflict check simultaneously | Use final conflict check immediately before save; consider transaction/index later |
| Tailwind migration from current CSS | Styling churn | Replace placeholder styles only; keep focused app-level CSS |

## Definition Of Done

- Backend public and admin APIs implemented and tested.
- MongoDB models and seed logic implemented.
- Frontend routes and pages replace the Vite placeholder.
- Public booking, status lookup, pending edit, and cancel flows work.
- Approved, denied, and cancelled public bookings are read-only.
- Admin login, dashboard, filters, and booking actions work.
- Environment examples exist and no secrets are hard-coded.
- All API calls use `client/src/lib/api.js` through service modules.
- Loading, empty, error, success, and disabled-submit states are present.
- Tests, lint, and client build pass.

## Design Skill Pre-Flight For Implementation

- [x] Global state is limited to admin identity and UI state.
- [x] Server data remains in TanStack Query.
- [x] Mobile collapse is planned for all asymmetric layouts.
- [x] Full-height screens must use `min-h-[100dvh]`, not `h-screen`.
- [x] Loading, empty, error, and success states are included in each UI phase.
- [x] Heavy animations are avoided for this operational MVP.
- [x] Cards are limited to repeated booking items, dialogs, and framed controls.
