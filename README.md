# Nook — Real-time Chat App

Nook is a full-stack messaging app with a custom visual identity and a responsive chat workspace. It supports Clerk authentication, private text conversations, live message updates, online presence, image/video attachments, theme colors, and selectable wallpapers.

## Architecture

- React 19 + Vite frontend, served as static files in production.
- Express 5 API with MongoDB/Mongoose persistence.
- Clerk handles sign-in and session verification. A Clerk webhook syncs user profiles into MongoDB.
- Socket.IO carries online presence and real-time message updates on the Express server. Connections verify Clerk session tokens and resolve the caller's MongoDB profile server-side.
- ImageKit stores image and video attachments.
- Docker builds the frontend and backend into one persistent web service so API requests and WebSocket connections share the same origin.

## Local setup (Windows PowerShell)

Install the locked dependencies and create local environment files:

```powershell
cd backend
npm ci
Copy-Item .env.example .env

cd ..\frontend
npm ci
Copy-Item .env.example .env
```

Fill in the environment variables below. Never commit `.env` files. The `.env.example` files contain placeholders only.

### Environment variables

| Variable | Location | Required for |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | `frontend/.env` | Clerk sign-in UI; public key embedded in the frontend build |
| `CLERK_PUBLISHABLE_KEY` | `backend/.env` | Clerk backend configuration |
| `CLERK_SECRET_KEY` | `backend/.env` | Verifying Clerk sessions on API routes; keep secret |
| `MONGO_URI` | `backend/.env` | User profiles, conversations, and message persistence |
| `PORT` | `backend/.env` | API port; defaults to 3001 locally |
| `FRONTEND_URL` | `backend/.env` | Allowed browser origin; defaults to `http://localhost:5173` |
| `CLERK_WEBHOOK_SIGNING_SECRET` | `backend/.env` | Clerk user profile synchronization webhook |
| `IMAGEKIT_PRIVATE_KEY` | `backend/.env` | Optional image/video uploads; keep secret |
| `VITE_API_URL` | `frontend/.env` | Optional API base URL; same-origin `/api` is the default |
| `VITE_DEV_PROXY_TARGET` | `frontend/.env` | Optional Vite dev proxy destination; defaults to `http://localhost:3001` |

Use development Clerk keys locally. Run MongoDB locally on port 27017, or set `MONGO_URI` to your MongoDB Atlas connection string. Configure the Clerk webhook to send `user.created`, `user.updated`, and `user.deleted` events to `https://<your-api-host>/api/webhooks/clerk`; use its signing secret as `CLERK_WEBHOOK_SIGNING_SECRET`.

Start the API and web app in separate terminals:

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run dev
```

Open <http://localhost:5173/>. The Vite development server proxies `/api` and `/socket.io` to the backend on port 3001. The API health endpoint is <http://localhost:3001/health>; it returns 503 until MongoDB is connected.

## Production deployment

- GitHub repository: <https://github.com/Shree1194/nook-chat>
- Live application: pending production credentials and Render Blueprint setup.

The Express process owns persistent Socket.IO connections, so deploy the application as a Docker web service rather than a static-only site or serverless function. [`render.yaml`](./render.yaml) defines a Render Blueprint using the existing root Dockerfile, `/health` check, and a free service plan. Review current provider limits before relying on free-tier availability or uptime.

To deploy:

1. Push this repository to GitHub and import it into Render as a Blueprint using `render.yaml`.
2. Provide `MONGO_URI`, production Clerk publishable and secret keys, and `CLERK_WEBHOOK_SIGNING_SECRET` in Render's private environment-variable setup. The public publishable key is also needed at Docker build time as `VITE_CLERK_PUBLISHABLE_KEY`.
3. Configure the Clerk production instance and webhook for the Render URL. Add the deployed app domain in Clerk's production settings.
4. Set up ImageKit separately if production media uploads are required.
5. Verify the public URL, sign-up/sign-in, authenticated API responses, database-backed profiles, and real-time messaging before sharing it.

No live URL is configured in this repository yet. The production deployment requires a MongoDB URI and production Clerk credentials; do not use development keys for a public production release. Custom domains and paid services are not required by the included Blueprint.

## Checks

```powershell
cd frontend
npm run lint
npm run build

cd ..\backend
npm run build
```

There is no configured automated test or type-check script at this time.
