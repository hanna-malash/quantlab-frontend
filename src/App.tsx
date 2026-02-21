import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./shared/layout/AppLayout";
import HomePage from "./pages/HomePage";
import PricesPage from "./pages/PricesPage";
import ReturnsPage from "./pages/ReturnsPage";
import VolatilityPage from "./pages/VolatilityPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/volatility" element={<VolatilityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
