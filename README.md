# QuantLab Frontend

Frontend for **QuantLab**, a backend-first analytics product focused on financial time-series exploration. The frontend is the presentation and orchestration layer for backend-powered analytics such as prices, returns, volatility, and drawdown.

## Related repositories

- Backend (FastAPI): https://github.com/hanna-malash/quantlab-backend

## Current capabilities

- assets overview dashboard and asset detail flows
- compare page with correlation matrix analysis
- asset price chart with range selection
- returns chart on `AssetPage`
- volatility chart on `AssetPage`
- drawdown chart on `AssetPage`
- backend health status in the main layout
- typed API layer for asset, price, returns, volatility, and drawdown endpoints
- typed overview client for `/api/v1/assets/overview`
- typed correlation client for `/api/v1/analytics/correlation`
- chart date labels normalized to UTC
- `MAX` range currently means the latest `5000` points, not unlimited history
- legacy standalone `Prices` page removed in favor of the asset analytics dashboard

## Tech stack

- Vite
- React 19
- TypeScript
- React Router
- Recharts
- Tailwind CSS
- ESLint
- Prettier
- Vitest

## Requirements

- Node.js LTS
- npm
- QuantLab backend running locally on `http://127.0.0.1:8000`

## Local development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The app is served at [http://localhost:5173](http://localhost:5173).

### Backend integration

During local development, Vite proxies frontend requests from `/api` to `http://127.0.0.1:8000`.

`AssetPage` currently derives the displayed timeframe from the first timeframe returned by the backend asset metadata.

`AssetsPage` now renders backend-provided summary metrics per asset using the overview endpoint.

`ComparePage` uses the correlation endpoint and restricts requests to shared timeframes across the selected assets.

## Quality checks

Run the full local check set before opening a PR:

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
npm run build
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks without emitting files
- `npm run test` — run the Vitest suite
- `npm run test:watch` — run Vitest in watch mode
- `npm run format` — format the repository with Prettier
- `npm run format:check` — verify formatting

## Project structure

```text
src/
  features/
    assets/
      components/   # asset-specific charts and controls
      lib/          # asset chart, date, and range helpers
  pages/            # route-level orchestration
  shared/
    api/            # typed HTTP clients
    config/         # environment configuration
    layout/         # app shell
  components/ui/    # reusable UI primitives
```

## CI

GitHub Actions runs the frontend check pipeline on pushes and pull requests:

- lint
- typecheck
- test
- format check
- production build
