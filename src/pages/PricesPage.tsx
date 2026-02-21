import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getPrices } from "@/shared/api/prices";
import type { PricePoint } from "@/shared/api/prices";

type UiState = "idle" | "loading" | "success";

const mockData: PricePoint[] = [
  { date: "01", close: 100 },
  { date: "02", close: 105 },
  { date: "03", close: 102 },
  { date: "04", close: 110 },
  { date: "05", close: 108 },
];

export default function PricesPage() {
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [state, setState] = useState<UiState>("idle");
  const [points, setPoints] = useState<PricePoint[]>(mockData);
  const [infoText, setInfoText] = useState<string>(
    "Demo data (backend not connected).",
  );

  useEffect(() => {
    let isCancelled = false;

    async function load(): Promise<void> {
      setState("loading");

      try {
        const result = await getPrices(symbol);
        if (isCancelled) {
          return;
        }

        if (result.points.length === 0) {
          setPoints(mockData);
          setInfoText("No data from backend, showing demo data.");
          setState("success");
          return;
        }

        setPoints(result.points);
        setInfoText("Live data from backend.");
        setState("success");
      } catch {
        if (isCancelled) {
          return;
        }

        setPoints(mockData);
        setInfoText("Backend not running, showing demo data.");
        setState("success");
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [symbol]);

  const chartData = useMemo(() => {
    return points;
  }, [points]);

  return (
    <div>
      <h2>Prices</h2>

      <div style={{ marginBottom: "12px" }}>
        <label>
          Symbol:&nbsp;
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={{ padding: "6px 8px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "12px", opacity: 0.8 }}>{infoText}</div>

      {state === "loading" && <div>Loading...</div>}

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
