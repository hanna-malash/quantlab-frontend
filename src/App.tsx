import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./shared/layout/AppLayout";
import PricesPage from "./pages/PricesPage";
import ReturnsPage from "./pages/ReturnsPage";
import VolatilityPage from "./pages/VolatilityPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/prices" replace />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/volatility" element={<VolatilityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
