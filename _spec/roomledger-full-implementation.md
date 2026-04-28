# RoomLedger Full Implementation Spec

## Summary

Build RoomLedger as a full MVP conference room booking system. Users can browse two conference rooms, check weekday availability, submit booking requests without an account, receive a unique booking ID, and later view, edit, or cancel pending requests. Admins can sign in to a private dashboard to review, approve, deny, edit, and delete bookings while enforcing conflict-free scheduling.

The current repository is a minimal scaffold: Vite/React placeholder UI in `client/src/App.jsx`, a basic Express app in `server/app.js`, and no existing database models, API modules, auth flow, tests, shared API client, router, query setup, Redux setup, Tailwind setup, or environment validation.

## Goal

Deliver a usable MVP for two rooms, Monday-Friday from 8:00 AM to 5:00 PM, with reliable overlap prevention, clear request statuses, admin review controls, and a polished responsive interface.

## Non-Goals

- User account registration or user login.
- Email notifications.
- Recurring bookings.
- Calendar provider sync.
- Payment, billing, or organization management.
- Multi-admin role management beyond one configured admin credential.
- Full analytics beyond basic dashboard counts.

## Users / Actors

- Anonymous user: books rooms and checks requests with a booking ID.
- Admin: authenticates, manages all bookings, and resolves pending requests.
- System: validates times, prevents overlaps, stores booking state, and returns availability.

## Core Requirements

1. Seed or initialize two active rooms: `Conference Room A` and `Conference Room B`.
2. Support valid booking windows only Monday-Friday, 8:00 AM through 5:00 PM.
3. Prevent overlapping approved bookings and pending booking requests for the same room/date unless the edited booking is the same record.
4. Generate a unique human-readable `bookingId` on booking creation.
5. Default new bookings to `pending`.
6. Allow anonymous users to view booking status by `bookingId`.
7. Allow users to edit or cancel only pending bookings.
8. Require admin authentication for all admin routes.
9. Allow admins to approve, deny, edit, and delete bookings.
10. Keep frontend API calls inside `client/src/services/` using shared client `client/src/lib/api.js`.
11. Use TanStack Query through custom hooks for server state.
12. Do not duplicate server data into Redux.
13. Add focused frontend and backend tests.

## User Flows

### Public Booking Flow

1. User lands on `/`.
2. User sees RoomLedger branding, the tagline "Smart scheduling. Zero conflicts.", two room choices, and a status lookup entry point.
3. User selects a room and navigates to `/rooms/:roomSlug`.
4. User picks a weekday date from a calendar/date selector.
5. App loads available start times and valid durations.
6. User selects start time and duration.
7. User fills name, email, department, and purpose.
8. User submits the request.
9. System creates a pending booking and shows a confirmation screen with the booking ID.

### Status Flow

1. User navigates to `/status`.
2. User enters a booking ID.
3. App displays room, date, time, requester details, purpose, status, and admin note when present.
4. If status is `pending`, user can edit details or cancel the request.
5. If status is `approved`, `denied`, or `cancelled`, edit controls are hidden.

### Admin Flow

1. Admin navigates to `/admin/login`.
2. Admin enters configured credentials.
3. On success, admin is redirected to `/admin/dashboard`.
4. Dashboard lists all bookings with filters for room, date, and status.
5. Admin can approve, deny with optional note, edit booking details, or delete a booking.
6. Admin changes are persisted and reflected in availability calculations.

## Functional Details

### Frontend Architecture

Use React Router for pages:

- `/` -> home and room selection.
- `/rooms/:roomSlug` -> room calendar, availability, and booking form.
- `/booking/:bookingId/confirmation` or in-place confirmation state after creation.
- `/status` -> lookup form and status result.
- `/admin/login` -> admin login form.
- `/admin/dashboard` -> protected admin dashboard.

Create `client/src/routes/` for router configuration and protected admin route handling. Use Redux only for global UI/auth state if needed, with `redux/store.js`, `redux/providers.jsx`, and domain folders such as `redux/auth/` and `redux/ui/`.

Use TanStack Query for rooms, availability, booking status, and admin bookings. Query hooks should live under `client/src/hooks/queries/`; mutation hooks under `client/src/hooks/mutations/`.

### Frontend UI / Design

Replace the Vite placeholder screen entirely. RoomLedger should feel like a focused operations tool, not a marketing landing page. Use a restrained SaaS/dashboard aesthetic: neutral base, one accent color, readable typography, and dense but calm booking controls.

Recommended UI structure:

- Top navigation with brand and public status link only. Admin must not appear publicly.
- Home screen with concise room selection and current-day availability summary.
- Room booking screen with a two-column desktop layout: date/availability controls on the left, booking form/details on the right. Collapse to one column on mobile.
- Status screen with lookup form, result panel, and clear status badge.
- Admin dashboard with summary metrics, filters, booking table, and action dialogs.

Required UI states:

- Loading: skeleton rows or panels matching the final layout.
- Empty: no rooms, no availability, no bookings, or no lookup result.
- Error: inline API and validation messages.
- Success: booking ID confirmation and admin action confirmation.
- Duplicate submit: disable active submit buttons while mutations are pending.

Accessibility requirements:

- Labels above inputs.
- Error text below fields.
- Keyboard-accessible forms and action buttons.
- Visible focus styles.
- Status badges with text, not color alone.
- Confirm destructive actions such as delete/cancel.

### Backend Architecture

Keep the backend flat under `server/`:

- `server/config/` for database and environment configuration.
- `server/models/` for Mongoose models.
- `server/controllers/` for request handlers.
- `server/routes/` for route definitions.
- `server/middleware/` for auth, errors, validation, and async handling.
- `server/utils/` for booking ID generation, time parsing, overlap checks, and seeding rooms.
- `server/constants/` for rooms, statuses, and working hours.
- `server/tests/` for Jest/Supertest tests.

Add centralized error handling and JSON body parsing in `server/app.js`. Add environment validation at startup and fail fast for missing required values.

### Database Models

#### Room

Fields:

- `name`: string, required, unique.
- `slug`: string, required, unique.
- `isActive`: boolean, default `true`.
- timestamps.

Initial records:

- `Conference Room A`, slug `conference-room-a`.
- `Conference Room B`, slug `conference-room-b`.

#### Booking

Fields:

- `bookingId`: string, required, unique, indexed.
- `room`: ObjectId ref `Room`, required, indexed.
- `requesterName`: string, required.
- `requesterEmail`: string, required, lowercase, trimmed.
- `department`: string, required.
- `purpose`: string, required.
- `date`: string or Date normalized to date-only, required, indexed.
- `startTime`: string in `HH:mm`, required.
- `endTime`: string in `HH:mm`, required.
- `durationHours`: number, required.
- `status`: enum `pending | approved | denied | cancelled`, default `pending`, indexed.
- `adminNote`: string, optional.
- timestamps.

Use a compound index on `room`, `date`, `startTime`, `endTime`, and `status` to support availability checks.

### Booking Rules

Working hours:

- Earliest start: `08:00`.
- Latest end: `17:00`.
- Valid days: Monday-Friday only.

Overlap rule:

```txt
newStart < existingEnd && newEnd > existingStart
```

Conflict checks must include `pending` and `approved` bookings. Ignore `denied` and `cancelled` bookings. Editing must exclude the booking currently being edited from conflict checks.

Recommended slot granularity: 60 minutes. Valid durations are 1–9 hours.

### API Endpoints

#### Health

- `GET /` returns API welcome/health message.
- `GET /api/health` returns `{ ok: true }`.

#### Rooms

- `GET /api/rooms`
  - Returns active rooms sorted by name.

#### Availability

- `GET /api/availability?roomId=&date=`
  - Validates room and weekday date.
  - Returns room, date, working hours, existing blocked intervals, and available slots.

#### Public Bookings

- `POST /api/bookings`
  - Creates pending booking.
  - Validates required fields, room, weekday, working hours, duration, and conflicts.
  - Returns booking details and `bookingId`.

- `GET /api/bookings/status/:bookingId`
  - Returns public-safe booking details.
  - Does not expose internal Mongo IDs unnecessarily.

- `PATCH /api/bookings/status/:bookingId`
  - Allows edits only while pending.
  - Editable fields: requester name/email, department, purpose, room, date, start time, duration.
  - Recalculates end time and validates conflicts.

- `PATCH /api/bookings/status/:bookingId/cancel`
  - Allows cancellation only while pending.

#### Admin Auth

- `POST /api/admin/login`
  - Accepts admin credentials from env-backed configuration.
  - Returns a signed JWT or sets an httpOnly cookie. Prefer httpOnly cookie if deployment supports same-site configuration cleanly.

- `POST /api/admin/logout`
  - Clears cookie or invalidates client session.

- `GET /api/admin/me`
  - Returns current admin identity for route restoration.

#### Admin Bookings

- `GET /api/admin/bookings?status=&roomId=&date=&q=`
  - Returns filtered bookings with room data.

- `PATCH /api/admin/bookings/:id`
  - Edits any booking fields allowed for admin.
  - Validates conflicts for active statuses.

- `PATCH /api/admin/bookings/:id/approve`
  - Sets status to `approved` if no conflict exists.

- `PATCH /api/admin/bookings/:id/deny`
  - Sets status to `denied`; accepts optional `adminNote`.

- `DELETE /api/admin/bookings/:id`
  - Deletes booking after confirmation.

### Validation

Backend validation is authoritative. Client validation should improve UX but never replace server checks.

Validate:

- Required strings are present and trimmed.
- Email format is valid.
- Date is a valid weekday and not ambiguous.
- Start/end times use `HH:mm`.
- Duration is positive and aligns to slot granularity.
- Booking remains within working hours.
- Room exists and is active.
- Status transitions are allowed.
- Booking ID exists for public lookup/update.

### Admin Security

Use environment variables for admin auth and secrets:

- `MONGO_URI`
- `PORT`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET` if JWT is used
- `CLIENT_ORIGIN`

Do not expose admin credentials through APIs. Protect all `/api/admin/*` routes except login.

### Environment Files

Create/update:

- Root `.env.example` for backend values.
- `client/.env.example` with `VITE_API_URL=`.

Frontend must read API base URL from `import.meta.env.VITE_API_URL`. Do not hard-code `http://localhost:5000` in components or services.

### Testing Requirements

Backend Jest/Supertest tests:

- Rooms list returns seeded active rooms.
- Availability rejects weekends and invalid times.
- Booking creation succeeds for a valid slot.
- Booking creation rejects overlaps.
- Status lookup returns expected public data.
- Pending booking edit succeeds when conflict-free.
- Pending booking edit rejects conflicts.
- Approved/denied/cancelled booking cannot be edited by public route.
- Admin login rejects invalid credentials.
- Admin protected routes reject unauthenticated requests.
- Admin approve/deny/edit/delete works and enforces conflicts.

Frontend Vitest/React Testing Library tests:

- Home renders room selection and public status navigation only.
- Room page loads availability and disables invalid submit states.
- Booking form displays validation errors.
- Successful booking displays booking ID.
- Status lookup handles found, not found, loading, and pending-edit states.
- Admin dashboard renders bookings and action controls for authenticated admin state.

## States and Edge Cases

- Weekend date selected.
- Date outside allowed range if a future limit is introduced.
- Booking starts before 8:00 AM or ends after 5:00 PM.
- Back-to-back bookings where `existingEnd === newStart` are allowed.
- Partial overlaps, full containment overlaps, and exact-match overlaps are rejected.
- Room is inactive.
- Booking ID is invalid or not found.
- User tries to edit/cancel non-pending booking.
- Admin approves a booking after another booking has taken that slot.
- Network failure during booking creation or admin mutation.
- Duplicate form submission.
- Empty bookings list after filters.
- Missing environment variables.
- MongoDB connection failure.

## Technical Notes

- Install missing dependencies before implementation:
  - Client likely needs `react-router-dom`, `@tanstack/react-query`, `@reduxjs/toolkit`, `react-redux`, `axios`, `tailwindcss` tooling, `vitest`, and React Testing Library packages.
  - Server likely needs `jsonwebtoken` or secure cookie/session tooling, `jest`, `supertest`, and possibly validation middleware.
- Decide whether admin auth uses Bearer JWT or httpOnly cookie before coding. Prefer httpOnly cookie for browser admin sessions if CORS and deployment are configured correctly.
- Normalize dates and times consistently. Avoid comparing localized display strings.
- Store only canonical values in MongoDB; format human-readable times in the client.
- Use service modules for all frontend API calls:
  - `client/src/services/roomService.js`
  - `client/src/services/availabilityService.js`
  - `client/src/services/bookingService.js`
  - `client/src/services/adminService.js`
- Use reusable UI components for form fields, status badges, dialogs, buttons, skeletons, and error messages.
- Keep deployment assumptions unchanged: frontend to Namecheap via GitHub Actions, backend to Heroku.

## File Impact

### Files Confirmed To Exist

- `AGENTS.md`
- `package.json`
- `package-lock.json`
- `roomledger_project_brief.txt`
- `server/app.js`
- `server/server.js`
- `client/package.json`
- `client/package-lock.json`
- `client/vite.config.js`
- `client/eslint.config.js`
- `client/index.html`
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/App.css`
- `client/src/index.css`
- `client/src/assets/hero.png`
- `client/public/icons.svg`
- `client/public/favicon.svg`

### Files To Create

- `server/config/db.js`
- `server/config/env.js`
- `server/constants/booking.js`
- `server/constants/rooms.js`
- `server/controllers/roomController.js`
- `server/controllers/availabilityController.js`
- `server/controllers/bookingController.js`
- `server/controllers/adminAuthController.js`
- `server/controllers/adminBookingController.js`
- `server/middleware/authMiddleware.js`
- `server/middleware/errorMiddleware.js`
- `server/middleware/notFoundMiddleware.js`
- `server/models/Room.js`
- `server/models/Booking.js`
- `server/routes/roomRoutes.js`
- `server/routes/availabilityRoutes.js`
- `server/routes/bookingRoutes.js`
- `server/routes/adminRoutes.js`
- `server/utils/asyncHandler.js`
- `server/utils/bookingId.js`
- `server/utils/bookingValidation.js`
- `server/utils/overlap.js`
- `server/utils/seedRooms.js`
- `server/tests/*.test.js`
- `client/.env.example`
- `.env.example`
- `client/src/lib/api.js`
- `client/src/redux/store.js`
- `client/src/redux/providers.jsx`
- `client/src/redux/auth/`
- `client/src/redux/ui/`
- `client/src/routes/AppRouter.jsx`
- `client/src/routes/ProtectedAdminRoute.jsx`
- `client/src/services/*.js`
- `client/src/hooks/queries/*.js`
- `client/src/hooks/mutations/*.js`
- `client/src/components/`
- `client/src/pages/`
- `client/test/*.test.jsx`

### Files To Update

- `server/app.js`
- `server/server.js`
- `package.json`
- `client/package.json`
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/App.css`
- `client/src/index.css`
- `client/vite.config.js` if Vitest configuration is added there.

## Implementation Plan

1. Add backend environment validation, Mongo connection, error middleware, and health route.
2. Create Room and Booking models, constants, utilities, and seed logic for the two rooms.
3. Implement public rooms, availability, and booking routes with validation and overlap checks.
4. Implement admin authentication and protected admin booking routes.
5. Add backend Jest/Supertest setup and route tests.
6. Add frontend dependencies, Tailwind setup, React Router, Query provider, Redux provider, and shared API client.
7. Replace placeholder UI with public pages, room booking flow, status flow, and reusable components.
8. Add admin login/dashboard, protected route behavior, filters, dialogs, and mutation states.
9. Add frontend tests for public and admin flows.
10. Run lint, backend tests, frontend tests, and production build.

## Acceptance Criteria

- [ ] `npm run dev` starts both API and client successfully.
- [ ] Backend fails fast when required env vars are missing.
- [ ] Two active rooms are available through `GET /api/rooms`.
- [ ] Users can create a valid pending booking and receive a booking ID.
- [ ] Overlapping pending or approved bookings for the same room/date are rejected.
- [ ] Weekend and out-of-hours bookings are rejected.
- [ ] Users can look up a booking by ID.
- [ ] Users can edit or cancel only pending bookings.
- [ ] Admin can log in and access `/admin/dashboard`.
- [ ] Admin routes reject unauthenticated requests.
- [ ] Admin can approve, deny with note, edit, and delete bookings.
- [ ] Admin approval rechecks conflicts before changing status.
- [ ] Frontend uses `VITE_API_URL` through `client/src/lib/api.js`.
- [ ] TanStack Query hooks wrap all server-state operations.
- [ ] Loading, empty, error, success, and disabled-submit states are implemented.
- [ ] Backend and frontend tests cover the main flows and edge cases.
- [ ] Client lint and build pass.

## Open Questions

- Should admin authentication use httpOnly cookies or Bearer JWT for the MVP?
- Should pending bookings block availability for public users, or should only approved bookings block visible availability while pending still conflicts at submission? This spec assumes pending blocks availability.
- Should users be allowed to edit requester email from the public status page without extra verification? This spec allows it while pending because the brief specifies booking-ID-only access.
- What is the desired maximum bookable date range, if any?

## Assumptions

- Times are local to the deployment/business timezone.
- Slot granularity is 60 minutes.
- Valid duration choices include 1–9 hours.
- Admin credentials are configured through environment variables.
- The MVP uses MongoDB through Mongoose and does not require a separate user collection.

## Design Skill Pre-Flight

- [x] Global state is limited to auth/UI needs; server data stays in TanStack Query.
- [x] Mobile layouts are specified to collapse to a single column.
- [x] Full-height sections should use stable viewport units if implemented.
- [x] Loading, empty, and error states are required.
- [x] Cards are used only where they clarify booking/admin hierarchy.
- [x] Heavy animation is not required for this operational MVP.
