# Travel Plan Customizing Tool

A travel-planning web app where users share posts about places they've visited (city, state, hotel, restaurants, places) and build their own travel plan from what others have shared.

The original project proposal (target audience, planned features, initial architecture) is in [PROJECT_PROPOSAL.md](./PROJECT_PROPOSAL.md).

## Tech stack

- **Backend:** Node.js + Express (ES modules)
- **Database:** MongoDB, via Mongoose — indexed on `Post.state`, `Post.city`, `Post.username` (matching the queries in `routes/api/v1/controllers/posts.js`) and a unique compound index on `Plan(username, state)`
- **Auth:** `express-session` (cookie-based sessions) with sign-in handled by Azure AD (Microsoft Entra ID) through `microsoft-identity-express`
- **API:** REST endpoints under `/api/v1` (`posts`, `users`, `plans`) — see `routes/api/v1/`
- **Search & ranking:** multi-criteria filtering across state/city/hotel/restaurant/places, with results ranked by a priority-weighted relevance score — see `GET /api/v1/posts/search`
- **Validation:** `express-validator` on post/plan creation — malformed requests are rejected with `400` instead of being saved as-is or crashing
- **Real-time updates:** `Socket.io`, attached to the same HTTP server as Express (`app.js`) — new posts broadcast live to every connected client instead of requiring a manual refresh
- **Frontend:** server-served static HTML/CSS + vanilla JavaScript (Bootstrap for styling) — no frontend framework, no build step. Pages live in `public/`, client-side logic in `public/javascripts/`.

## Running locally

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root (see `.env.example` for the template) with your Azure AD app registration values, a session secret, and the MongoDB connection string:
   ```
   clientId=<Azure AD application (client) ID>
   tenantId=<Azure AD tenant ID>
   clientSecret=<Azure AD client secret>
   secret=<any random string, used to sign session cookies>
   mongoUri=<MongoDB connection string, e.g. mongodb+srv://user:pass@cluster-host/dbname>
   ```
3. Start the server:
   ```
   npm start
   ```
4. The app listens on [http://localhost:3000](http://localhost:3000) by default (override with the `PORT` env var).
5. Optional: populate the database with a few sample posts (see `seed/samplePosts.js`) with `npm run seed`. Safe to re-run — existing sample posts are skipped, not duplicated.

## Project layout

- `app.js` — Express app entry point (middleware, auth, routing)
- `models.js` — Mongoose connection and schemas (`Post`, `Plan`)
- `routes/api/v1/` — REST API routers and controllers
- `public/` — static frontend (HTML pages, CSS, client-side JS)
- `seed/` — sample post data and the `npm run seed` script
