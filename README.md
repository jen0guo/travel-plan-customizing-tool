# Travel Plan Customizing Tool

A travel-planning web app where users share posts about places they've visited (city, state, hotel, restaurants, places) and build their own travel plan from what others have shared.

The original project proposal (target audience, planned features, initial architecture) is in [PROJECT_PROPOSAL.md](./PROJECT_PROPOSAL.md).

## Tech stack

- **Backend:** Node.js + Express (ES modules)
- **Database:** MongoDB, via Mongoose
- **Auth:** `express-session` (cookie-based sessions) with sign-in handled by Azure AD (Microsoft Entra ID) through `microsoft-identity-express`
- **API:** REST endpoints under `/api/v1` (`posts`, `users`, `plans`) — see `routes/api/v1/`
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

## Project layout

- `app.js` — Express app entry point (middleware, auth, routing)
- `models.js` — Mongoose connection and schemas (`Post`, `Plan`)
- `routes/api/v1/` — REST API routers and controllers
- `public/` — static frontend (HTML pages, CSS, client-side JS)
