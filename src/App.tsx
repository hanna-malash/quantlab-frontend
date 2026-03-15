import { BrowserRouter, Route, Routes } from "react-router-dom";

import AssetPage from "./pages/AssetPage";
import AssetsPage from "./pages/AssetsPage";
import ComparePage from "./pages/ComparePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ReturnsPage from "./pages/ReturnsPage";
import VolatilityPage from "./pages/VolatilityPage";
import AppLayout from "./shared/layout/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/volatility" element={<VolatilityPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/assets/:symbol" element={<AssetPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
