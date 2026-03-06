import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getPrices, type PricePoint } from "@/shared/api/prices";

type UiState = "idle" | "loading" | "success" | "error";

export default function AssetPage() {
  const params = useParams<{ symbol: string }>();

  const [state, setState] = useState<UiState>("idle");
  const [points, setPoints] = useState<PricePoint[]>([]);
  const [errorText, setErrorText] = useState<string>("");

  const symbol = (params.symbol || "").toUpperCase();
  const timeframe = "1d";
  const limit = 1000;

  useEffect(() => {
    if (symbol === "") {
      return;
    }

    let isCancelled = false;

    async function loadPrices(): Promise<void> {
      setState("loading");
      setErrorText("");

      try {
        const result = await getPrices({ symbol, timeframe, limit });

        if (isCancelled) {
          return;
        }

        setPoints(result.points || []);
        setState("success");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorText(message);
        setState("error");
      }
    }

    loadPrices();

    return () => {
      isCancelled = true;
    };
  }, [symbol]);

  const chartData = useMemo(() => points, [points]);

  return (
    <div>
      <h2>Asset: {symbol}</h2>
      <div style={{ marginBottom: "12px", opacity: 0.8 }}>
        Timeframe: {timeframe}
      </div>

      {state === "loading" && <div>Loading asset data...</div>}

      {state === "error" && (
        <div>
          <div>Failed to load prices.</div>
          <div>{errorText}</div>
        </div>
      )}

      {state === "success" && points.length === 0 && (
        <div>No price points found.</div>
      )}

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
