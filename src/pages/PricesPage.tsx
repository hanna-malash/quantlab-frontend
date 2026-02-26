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
  { timestamp_utc: "2024-01-01T00:00:00Z", close: 42050 },
  { timestamp_utc: "2024-01-01T01:00:00Z", close: 42150 },
  { timestamp_utc: "2024-01-01T02:00:00Z", close: 41900 },
  { timestamp_utc: "2024-01-01T03:00:00Z", close: 42300 },
];

export default function PricesPage() {
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [timeframe, setTimeframe] = useState<string>("1h");
  const [limit, setLimit] = useState<number>(500);

  const [state, setState] = useState<UiState>("idle");
  const [points, setPoints] = useState<PricePoint[]>(mockData);
  const [infoText, setInfoText] = useState<string>("Demo data.");

  useEffect(() => {
    let isCancelled = false;

    async function load(): Promise<void> {
      setState("loading");

      try {
        const result = await getPrices({ symbol, timeframe, limit });
        if (isCancelled) {
          return;
        }

        if (result.points.length === 0) {
          setPoints(mockData);
          setInfoText("Backend returned 0 points, showing demo data.");
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
        setInfoText("Backend not reachable, showing demo data.");
        setState("success");
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [symbol, timeframe, limit]);

  const chartData = useMemo(() => {
    return points;
  }, [points]);

  return (
    <div>
      <h2>Prices</h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <label>
          Symbol:&nbsp;
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={{ padding: "6px 8px" }}
          />
        </label>

        <label>
          Timeframe:&nbsp;
          <input
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ padding: "6px 8px", width: "70px" }}
          />
        </label>

        <label>
          Limit:&nbsp;
          <input
            value={String(limit)}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!Number.isFinite(value)) {
                return;
              }
              setLimit(value);
            }}
            style={{ padding: "6px 8px", width: "90px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "12px", opacity: 0.8 }}>{infoText}</div>

      {state === "loading" && <div>Loading...</div>}

      <div style={{ width: "100%", height: 400, minHeight: 400, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp_utc" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
