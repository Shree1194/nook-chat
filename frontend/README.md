# Nook frontend

The Nook client is a responsive React app built with Vite, Tailwind CSS, HeroUI, and Zustand. Its UI includes the sign-in gateway, inbox, real-time conversation view, media composer, theme controls, and wallpaper picker.

## Run locally

```bash
npm install
npm run dev
```

Create a `.env` file in this folder and set the required variable before signing in.

Set `VITE_CLERK_PUBLISHABLE_KEY` in `.env` to the publishable key for your Clerk application. During development, the API client points to `http://localhost:3000/api`; run the backend on port `3000` with a reachable MongoDB instance and the required backend environment variables.

## Available scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create the production frontend build in `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — check the source with ESLint
