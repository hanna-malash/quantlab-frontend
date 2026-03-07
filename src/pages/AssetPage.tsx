import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

export default function AssetPage() {
  const params = useParams<{ symbol: string }>();
  const symbol = (params.symbol || "").toUpperCase();

  const [assetState, setAssetState] = useState<UiState>("idle");
  const [asset, setAsset] = useState<AssetDto | null>(null);
  const [assetErrorText, setAssetErrorText] = useState<string>("");

  const [pricesState, setPricesState] = useState<UiState>("idle");
  const [points, setPoints] = useState<PricePoint[]>([]);
  const [pricesErrorText, setPricesErrorText] = useState<string>("");

  const limit = 1000;
  const timeframe =
    asset && asset.timeframes.length > 0 ? asset.timeframes[0] : "";

  useEffect(() => {
    if (symbol === "") {
      return;
    }

    const controller = new AbortController();

    async function loadAsset(): Promise<void> {
      setAssetState("loading");
      setAssetErrorText("");

      try {
        const assets = await getAssets(controller.signal);
        const found =
          assets.find((item) => item.symbol.toUpperCase() === symbol) || null;

        if (!found) {
          setAsset(null);
          setAssetErrorText(`Asset not found: ${symbol}`);
          setAssetState("error");
          return;
        }

        setAsset(found);
        setAssetState("success");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setAssetErrorText(message);
        setAssetState("error");
      }
    }

    loadAsset();

    return () => {
      controller.abort();
    };
  }, [symbol]);

  useEffect(() => {
    if (symbol === "" || timeframe === "") {
      return;
    }

    let isCancelled = false;

    async function loadPrices(): Promise<void> {
      setPricesState("loading");
      setPricesErrorText("");

      try {
        const result = await getPrices({ symbol, timeframe, limit });

        if (isCancelled) {
          return;
        }

        setPoints(result.points || []);
        setPricesState("success");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setPricesErrorText(message);
        setPricesState("error");
      }
    }

    loadPrices();

    return () => {
      isCancelled = true;
    };
  }, [symbol, timeframe]);

  const chartData = useMemo(() => points, [points]);

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <Link to="/assets">Back to assets</Link>
      </div>

      <h2>Asset: {symbol}</h2>

      {assetState === "loading" && <div>Loading asset metadata...</div>}

      {assetState === "error" && (
        <div>
          <div>Failed to load asset metadata.</div>
          <div>{assetErrorText}</div>
        </div>
      )}

      {assetState === "success" && asset && (
        <div style={{ marginBottom: "12px", opacity: 0.8 }}>
          Timeframe: {timeframe}
        </div>
      )}

      {pricesState === "loading" && <div>Loading asset data...</div>}

      {pricesState === "error" && (
        <div>
          <div>Failed to load prices.</div>
          <div>{pricesErrorText}</div>
        </div>
      )}

      {pricesState === "success" && points.length === 0 && (
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
