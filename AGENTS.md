# Project instructions (express-mongoose)

These guidelines are for contributing to **irenakrakavetskaya/express-mongoose**, a Node.js + Express + Mongoose demo shop app using server-side rendered **EJS** views, MongoDB-backed sessions, CSRF protection, and basic authentication.

## Tech stack

- Runtime: Node.js
- Web framework: Express (`app.js`)
- Database: MongoDB via Mongoose (`models/*`)
- Views: EJS templates (`views/*`)
- Sessions: `express-session` + `connect-mongodb-session`
- Security: `csurf` for CSRF protection
- Auth: `bcryptjs` for password hashing
- UX: `connect-flash` for flash error messages

## Code style (match existing code)

- This codebase is **CommonJS JavaScript** (`require`, `module.exports`).
  - Do **not** introduce TypeScript or ESM unless you are explicitly migrating the project.
- Use 2-space indentation to match existing files.
- Prefer promise chains (`.then/.catch`) as currently used, unless you are refactoring the surrounding code to `async/await` consistently.
- Keep controllers thin and consistent with the current pattern:
  - Routes in `routes/*`
  - Route handlers in `controllers/*`
  - DB models in `models/*`

## Architecture / flow

- `app.js` wires middleware and mounts routes:
  - `/admin` -> `routes/admin.js`
  - shop routes -> `routes/shop.js`
  - auth routes -> `routes/auth.js`
- Authentication state is stored in session:
  - `req.session.isLoggedIn`
  - `req.session.user`
- The logged-in user document is loaded on each request (if session contains a user) and attached to `req.user`.
- CSRF tokens are generated per request and exposed to templates as `res.locals.csrfToken`.

## Safety / security requirements

- Never commit real credentials.
- Any HTML form that performs a POST must include the CSRF token.
- Be careful with authorization on admin routes.
  - Currently `middleware/is-auth.js` protects routes by checking `req.session.isLoggedIn`.

## When adding features

- Add routes in `routes/*`, handler logic in `controllers/*`.
- Use Mongoose models in `models/*`.
- Keep pages server-rendered (EJS) unless you are explicitly converting to an API + SPA.