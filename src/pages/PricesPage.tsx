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

const demoData: PricePoint[] = [
  { timestamp_utc: "2024-01-01T00:00:00Z", close: 42050 },
  { timestamp_utc: "2024-01-01T01:00:00Z", close: 42150 },
  { timestamp_utc: "2024-01-01T02:00:00Z", close: 41980 },
  { timestamp_utc: "2024-01-01T03:00:00Z", close: 42220 },
  { timestamp_utc: "2024-01-01T04:00:00Z", close: 42110 },
];

export default function PricesPage() {
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [timeframe, setTimeframe] = useState<string>("1h");
  const [limit, setLimit] = useState<number>(500);

  const [state, setState] = useState<UiState>("idle");
  const [points, setPoints] = useState<PricePoint[]>(demoData);
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

        if (!result.points || result.points.length === 0) {
          setPoints(demoData);
          setInfoText("No data from backend, showing demo data.");
          setState("success");
          return;
        }

        setPoints(result.points);
        setInfoText(`Live data from backend (${result.points.length} points).`);
        setState("success");
      } catch {
        if (isCancelled) {
          return;
        }

        setPoints(demoData);
        setInfoText("Backend not reachable, showing demo data.");
        setState("success");
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [symbol, timeframe, limit]);

  const chartData = useMemo(() => points, [points]);

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
            style={{ padding: "6px 8px", width: "80px" }}
          />
        </label>

        <label>
          Limit:&nbsp;
          <input
            type="number"
            value={limit}
            min={2}
            max={5000}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{ padding: "6px 8px", width: "110px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "12px", opacity: 0.8 }}>{infoText}</div>

      {state === "loading" && <div>Loading...</div>}

      <div style={{ width: "100%", height: 420, minHeight: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp_utc"
              tickFormatter={(v) =>
                String(v).replace("T", " ").replace("Z", "").slice(0, 16)
              }
              minTickGap={30}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(v) => String(v)}
              formatter={(value) => [value, "close"]}
            />
            <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
