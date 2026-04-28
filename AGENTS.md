# Repository Guidelines

## Project Structure & Module Organization

This repository is a split React and Node application. The Vite client lives in `client/`, with source in `client/src/` and assets in `client/src/assets/`. Current entry points are `client/src/main.jsx` and `client/src/App.jsx`. The Express backend lives in `server/`, with `server/app.js` defining the app and `server/server.js` starting it.

New frontend code should follow `client/src/`: `components/`, `pages/`, `routes/`, `services/`, `hooks/`, `lib/`, `redux/`, `utils/`, and `constants/`. New backend code should stay flat under `server/` using `controllers/`, `routes/`, `models/`, `middleware/`, `config/`, `utils/`, and `tests/`.

## Build, Test, and Development Commands

- `npm run dev` starts Nodemon and the Vite client together.
- `npm run server` starts `server/server.js` with Nodemon.
- `npm run client` starts the Vite dev server from `client/`.
- `npm start` runs the backend with Node.
- `npm run build --prefix client` builds the frontend into `client/dist/`.
- `npm run lint --prefix client` runs ESLint.
- `npm run preview --prefix client` previews the built Vite app.

The root `npm test` script is a placeholder. Add real test scripts with test suites.

## Coding Style & Naming Conventions

Use JavaScript throughout. Client files use ES modules and JSX; server files use CommonJS. Match surrounding style unless intentionally migrating. Prefer two-space indentation, clear names, and focused modules.

Use Tailwind CSS for new frontend styling unless working inside existing local CSS. Keep API logic out of components. Frontend API calls must go through `client/src/lib/api.js`, and services should consume that shared client.

## Testing Guidelines

Frontend tests should use Vitest and React Testing Library under `client/test/`. Backend tests should use Jest and Supertest under `server/tests/`. Name tests after the behavior or module, for example `authRoutes.test.js` or `Dashboard.test.jsx`. Prioritize API contracts, auth, validation, and user flows.

## Commit & Pull Request Guidelines

This checkout has no Git history, so no local convention can be inferred. Use concise, imperative commits such as `Add shared API client` or `Validate room creation input`.

Pull requests should include a summary, test results, linked issues when relevant, and screenshots for UI changes. Note environment variable changes and update `.env.example` files.

## Security & Configuration

Backend environment variables belong in the root `.env`; frontend variables belong in `client/.env` and must use the `VITE_` prefix. Never hard-code secrets or frontend API URLs. Do not expose `passwordHash` or sensitive user data from backend responses. Backend validation and authorization remain the source of truth.
