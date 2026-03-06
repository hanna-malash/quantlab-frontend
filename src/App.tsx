import { BrowserRouter, Route, Routes } from "react-router-dom";

import AssetPage from "./pages/AssetPage";
import AssetsPage from "./pages/AssetsPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PricesPage from "./pages/PricesPage";
import ReturnsPage from "./pages/ReturnsPage";
import VolatilityPage from "./pages/VolatilityPage";
import AppLayout from "./shared/layout/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/volatility" element={<VolatilityPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/assets/:symbol" element={<AssetPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
