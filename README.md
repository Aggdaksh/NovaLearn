# LMS (Learning Management System)

A full-stack Learning Management System with a React + Vite frontend and Node.js/Express backend.

## Project structure

- **`frontend/`** – React app (Vite, Tailwind, Redux, React Router)
- **`backend/`** – Express API (MongoDB, JWT, Razorpay, Nodemailer, Cloudinary)

## Prerequisites

- Node.js (v18+)
- MongoDB
- npm or yarn

## Run locally

Defaults are set for local development: backend on **http://localhost:8000**, frontend on **http://localhost:5173**.

### 1. Backend

```bash
cd backend
cp .env.example .env   # then set at least MONGODB_URL and JWT_SECRET
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
# Optional: cp .env.example .env (VITE_API_URL defaults to http://localhost:8000)
npm install
npm run dev
```

### 3. Open the app

Visit **http://localhost:5173**. Ensure MongoDB is running (e.g. `mongod` or a local MongoDB instance).

For production, set `FRONTEND_URL` / `CORS_ORIGIN` in the backend and `VITE_API_URL` in the frontend to your deployed URLs. Do not commit `.env` files.

## Deploy on Render

This repo includes a root-level [`render.yaml`](./render.yaml) so you can deploy both the frontend and backend from the same GitHub repo.

### Before you deploy

1. Push the latest code to GitHub.
2. Keep your real secrets in Render only. Do not commit `.env` files.
3. Use the examples in [`backend/.env.example`](./backend/.env.example) and [`frontend/.env.example`](./frontend/.env.example) when Render asks for values.

### Render deploy flow

1. Open [Render Blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance** and select this GitHub repo.
3. Render will detect `render.yaml` and prepare two services:
   - `aggdaksh-novalearn-api`
   - `aggdaksh-novalearn`
4. Fill the prompted environment variables:
   - Backend: `MONGODB_URL`, `GOOGLE_API_KEY` or `GEMINI_API_KEY`, `EMAIL`, `EMAIL_PASS`, `CLOUDINARY_*`, `RAZORPAY_*`
   - Frontend: `VITE_FIREBASE_*`, `VITE_RAZORPAY_KEY_ID`
5. Create the Blueprint and wait for both deploys to finish.

### After the first deploy

1. Open the frontend service and confirm routes load correctly.
2. Open the backend health endpoint: `/health`
3. If Render changes either generated subdomain, update these variables in Render and redeploy:
   - Backend: `FRONTEND_URL`, `CORS_ORIGIN`
   - Frontend: `VITE_API_URL`
4. In Firebase Authentication, add your deployed frontend URL to the authorized domains / continue URLs.

### Notes

- The frontend is configured as a static site with a rewrite from `/*` to `/index.html`, which is required for React Router.
- The backend exposes `/health`, which Render can use for health checks.
- Auth cookies are configured to work in local development and production.

## Scripts

| Location   | Command       | Description        |
|-----------|---------------|--------------------|
| backend   | `npm run dev` | Start API (nodemon)|
| frontend  | `npm run dev` | Start dev server   |
| frontend  | `npm run build` | Production build  |

## Pushing to GitHub

1. **Create a new repository** on [GitHub](https://github.com/new). Do not add a README, .gitignore, or license (this repo already has them).

2. **Add the remote and push** (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

   ```bash
   cd "/Users/dakshaggarwal/HTML TUTORIAL/LMS"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

   For SSH:

   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

## License

ISC
