# QuantLab Frontend

Frontend application for **QuantLab** — a portfolio project for financial time-series analytics (prices, returns, volatility) with interactive charts and dashboards.

This repository contains the **frontend (UI)** part of the system, implemented with React + TypeScript. The backend is implemented separately using FastAPI.

---

## Related repositories

- Backend (FastAPI): https://github.com/hanna-malash/quantlab-backend

---

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- React Router (routing)
- Charts: Recharts (planned)

## Requirements

- Node.js (LTS recommended)
- npm

## Local development

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

Application will be available at:

http://localhost:5173

### Backend integration

During development the frontend uses a Vite proxy to communicate with the backend without CORS issues.

- Frontend requests: `/api/...`
- Proxy target: `http://127.0.0.1:8000`

### Run full stack locally

For full-stack setup and backend run instructions, see the backend repository README:

- Backend (FastAPI): https://github.com/hanna-malash/quantlab-backend

Start frontend (in this repository):

```bash
npm run dev
```

If the proxy is configured in `vite.config.ts`, requests to `/api` will be forwarded to the backend.

## Project structure

```
src/
  App.tsx
  main.tsx
  index.css
  components/
    ui/        # shadcn/ui components: button, card, input
  lib/        # utilities
  assets/     # static images
```

## Roadmap

- Frontend project setup (Vite + TS)
- Tailwind CSS
- shadcn/ui integration
- Application layout and routing
- Asset price chart
- Returns and volatility analytics
- Authentication
- Deployment

## Available scripts

(See `package.json` — typical scripts for Vite projects)

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run preview` — locally preview production build