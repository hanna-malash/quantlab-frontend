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
import { getAssets, type AssetDto } from "@/shared/api/assets";
import { getPrices, type PricePoint } from "@/shared/api/prices";

type UiState = "idle" | "loading" | "success" | "error";

export default function PricesPage() {
  const [assetsState, setAssetsState] = useState<UiState>("idle");
  const [assets, setAssets] = useState<AssetDto[]>([]);
  const [assetsError, setAssetsError] = useState<string>("");

  const [symbol, setSymbol] = useState<string>("");
  const [timeframe, setTimeframe] = useState<string>("");
  const [limit, setLimit] = useState<number>(500);

  const [pricesState, setPricesState] = useState<UiState>("idle");
  const [points, setPoints] = useState<PricePoint[]>([]);
  const [pricesError, setPricesError] = useState<string>("");

  // Load assets list once.
  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets(): Promise<void> {
      setAssetsState("loading");
      setAssetsError("");

      try {
        const list = await getAssets(controller.signal);
        setAssets(list);

        if (list.length > 0) {
          const first = list[0];
          setSymbol(first.symbol);
          const firstTimeframe =
            first.timeframes && first.timeframes.length > 0
              ? first.timeframes[0]
              : "";
          setTimeframe(firstTimeframe);
        }

        setAssetsState("success");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setAssetsError(message);
        setAssetsState("error");
      }
    }

    loadAssets();

    return () => {
      controller.abort();
    };
  }, []);

  // Load prices when symbol/timeframe changes.
  useEffect(() => {
    if (symbol === "" || timeframe === "") {
      return;
    }

    let isCancelled = false;

    async function loadPrices(): Promise<void> {
      setPricesState("loading");
      setPricesError("");

      try {
        const result = await getPrices({ symbol, timeframe, limit });
        if (isCancelled) {
          return;
        }

        if (!result.points || result.points.length === 0) {
          setPoints([]);
          setPricesState("success");
          return;
        }

        setPoints(result.points);
        setPricesState("success");
      } catch (e) {
        if (isCancelled) {
          return;
        }

        const message = e instanceof Error ? e.message : "Unknown error";
        setPricesError(message);
        setPricesState("error");
      }
    }

    loadPrices();

    return () => {
      isCancelled = true;
    };
  }, [symbol, timeframe, limit]);

  const chartData = useMemo(() => points, [points]);

  const selectedAsset = useMemo(() => {
    for (const a of assets) {
      if (a.symbol === symbol) {
        return a;
      }
    }
    return null;
  }, [assets, symbol]);

  const availableTimeframes = selectedAsset
    ? selectedAsset.timeframes || []
    : [];

  return (
    <div>
      <h2>Prices</h2>

      {assetsState === "loading" && <div>Loading assets...</div>}
      {assetsState === "error" && (
        <div style={{ opacity: 0.9 }}>
          Failed to load assets. Backend may be offline.
          <div style={{ opacity: 0.8 }}>{assetsError}</div>
        </div>
      )}

      {assetsState === "success" && assets.length === 0 && (
        <div>No assets found. Add normalized CSV files on backend side.</div>
      )}

      {assetsState === "success" && assets.length > 0 && (
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
            <select
              value={symbol}
              onChange={(e) => {
                const newSymbol = e.target.value;
                setSymbol(newSymbol);

                // When symbol changes, pick first available timeframe.
                const found = assets.find((a) => a.symbol === newSymbol);
                const firstTimeframe =
                  found && found.timeframes && found.timeframes.length > 0
                    ? found.timeframes[0]
                    : "";
                setTimeframe(firstTimeframe);
              }}
              style={{ padding: "6px 8px" }}
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol}
                </option>
              ))}
            </select>
          </label>

          <label>
            Timeframe:&nbsp;
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              style={{ padding: "6px 8px" }}
              disabled={availableTimeframes.length === 0}
            >
              {availableTimeframes.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
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
      )}

      {pricesState === "loading" && <div>Loading prices...</div>}
      {pricesState === "error" && (
        <div style={{ opacity: 0.9 }}>
          Failed to load prices.
          <div style={{ opacity: 0.8 }}>{pricesError}</div>
        </div>
      )}

      {pricesState === "success" &&
        symbol !== "" &&
        timeframe !== "" &&
        points.length === 0 && (
          <div>No price points returned for this symbol/timeframe.</div>
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
