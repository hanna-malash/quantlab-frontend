import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AssetPriceChart } from "@/features/assets/components/AssetPriceChart";
import { AssetReturnsChart } from "@/features/assets/components/AssetReturnsChart";
import { AssetRangeSelector } from "@/features/assets/components/AssetRangeSelector";
import { getLimitByRange, type AssetRange } from "@/features/assets/lib/chart";
import { getAssets, type AssetDto } from "@/shared/api/assets";
import { getPrices, type PricePoint } from "@/shared/api/prices";
import { getReturns, type SeriesPoint } from "@/shared/api/returns";

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

  const [returnsState, setReturnsState] = useState<UiState>("idle");
  const [returnsPoints, setReturnsPoints] = useState<SeriesPoint[]>([]);
  const [returnsErrorText, setReturnsErrorText] = useState<string>("");

  const [selectedRange, setSelectedRange] = useState<AssetRange>("1Y");

  const timeframe =
    asset && asset.timeframes.length > 0 ? asset.timeframes[0] : "";

  const limit = useMemo(() => {
    return getLimitByRange(selectedRange);
  }, [selectedRange]);

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

    const controller = new AbortController();

    async function loadPrices(): Promise<void> {
      setPricesState("loading");
      setPricesErrorText("");

      try {
        const result = await getPrices({
          symbol,
          timeframe,
          limit,
          signal: controller.signal,
        });

        setPoints(result.points || []);
        setPricesState("success");
      } catch (error) {
        if (controller.signal.aborted) {
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
      controller.abort();
    };
  }, [symbol, timeframe, limit]);

  useEffect(() => {
    if (symbol === "" || timeframe === "") {
      return;
    }

    const controller = new AbortController();

    async function loadReturns(): Promise<void> {
      setReturnsState("loading");
      setReturnsErrorText("");

      try {
        const result = await getReturns({
          symbol,
          timeframe,
          limit,
          signal: controller.signal,
        });

        setReturnsPoints(result.points || []);
        setReturnsState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setReturnsErrorText(message);
        setReturnsState("error");
      }
    }

    loadReturns();

    return () => {
      controller.abort();
    };
  }, [symbol, timeframe, limit]);

  const assetTitle = asset ? `${asset.name} (${asset.symbol})` : symbol;

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <Link to="/assets">Back to assets</Link>
      </div>

      <h2 style={{ marginBottom: "8px" }}>{assetTitle}</h2>

      {assetState === "loading" && <div>Loading asset metadata...</div>}

      {assetState === "error" && (
        <div>
          <div>Failed to load asset metadata.</div>
          <div>{assetErrorText}</div>
        </div>
      )}

      {assetState === "success" && asset && (
        <div style={{ marginBottom: "16px", opacity: 0.8 }}>
          <div>Class: {asset.asset_class}</div>
          <div>Currency: {asset.currency}</div>
          <div>Timeframe: {timeframe}</div>
        </div>
      )}

      <AssetRangeSelector
        value={selectedRange}
        onChange={(range) => {
          setSelectedRange(range);
        }}
      />

      {pricesState === "loading" && <div>Loading price data...</div>}

      {pricesState === "error" && (
        <div>
          <div>Failed to load prices.</div>
          <div>{pricesErrorText}</div>
        </div>
      )}

      {pricesState === "success" && points.length === 0 && (
        <div>No price points found for the selected range.</div>
      )}

      {pricesState === "success" && points.length > 0 && (
        <AssetPriceChart points={points} selectedRange={selectedRange} />
      )}

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "12px" }}>Returns</h3>

        {returnsState === "loading" && <div>Loading returns data...</div>}

        {returnsState === "error" && (
          <div>
            <div>Failed to load returns.</div>
            <div>{returnsErrorText}</div>
          </div>
        )}

        {returnsState === "success" && returnsPoints.length === 0 && (
          <div>No returns points found for the selected range.</div>
        )}

        {returnsState === "success" && returnsPoints.length > 0 && (
          <AssetReturnsChart
            points={returnsPoints}
            selectedRange={selectedRange}
          />
        )}
      </div>
    </div>
  );
}
