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
