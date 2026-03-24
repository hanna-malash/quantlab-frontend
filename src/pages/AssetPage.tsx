import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AssetDrawdownChart } from "@/features/assets/components/AssetDrawdownChart";
import { AssetMeta } from "@/features/assets/components/AssetMeta";
import { AssetPriceChart } from "@/features/assets/components/AssetPriceChart";
import { AssetReturnsChart } from "@/features/assets/components/AssetReturnsChart";
import { AssetRangeSelector } from "@/features/assets/components/AssetRangeSelector";
import { AssetRiskSummary } from "@/features/assets/components/AssetRiskSummary";
import { AssetSectionCard } from "@/features/assets/components/AssetSectionCard";
import { AssetVolatilityChart } from "@/features/assets/components/AssetVolatilityChart";
import { DataStateMessage } from "@/features/assets/components/DataStateMessage";
import {
  getLimitByRange,
  getVolatilityWindow,
  type AssetRange,
} from "@/features/assets/lib/chart";
import { getAssets, type AssetDto } from "@/shared/api/assets";
import { getDrawdown, type DrawdownPoint } from "@/shared/api/drawdown";
import { getPrices, type PricePoint } from "@/shared/api/prices";
import { getRiskSummary, type RiskSummaryDto } from "@/shared/api/riskSummary";
import { getReturns, type SeriesPoint } from "@/shared/api/returns";
import { getVolatility, type VolatilityPoint } from "@/shared/api/volatility";
import { Button } from "@/components/ui/button";

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

  const [volatilityState, setVolatilityState] = useState<UiState>("idle");
  const [volatilityPoints, setVolatilityPoints] = useState<VolatilityPoint[]>(
    [],
  );
  const [volatilityErrorText, setVolatilityErrorText] = useState<string>("");
  const [drawdownState, setDrawdownState] = useState<UiState>("idle");
  const [drawdownPoints, setDrawdownPoints] = useState<DrawdownPoint[]>([]);
  const [drawdownErrorText, setDrawdownErrorText] = useState<string>("");
  const [riskState, setRiskState] = useState<UiState>("idle");
  const [riskSummary, setRiskSummary] = useState<RiskSummaryDto | null>(null);
  const [riskErrorText, setRiskErrorText] = useState<string>("");

  const [selectedRange, setSelectedRange] = useState<AssetRange>("1Y");

  const timeframe =
    asset && asset.timeframes.length > 0 ? asset.timeframes[0] : "";

  const limit = useMemo(() => {
    return getLimitByRange(selectedRange);
  }, [selectedRange]);

  const volatilityWindow = useMemo(() => {
    return getVolatilityWindow(timeframe);
  }, [timeframe]);

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

    async function loadRiskSummary(): Promise<void> {
      setRiskState("loading");
      setRiskErrorText("");

      try {
        const result = await getRiskSummary({
          symbol,
          timeframe,
          limit,
          signal: controller.signal,
        });

        setRiskSummary(result);
        setRiskState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setRiskErrorText(message);
        setRiskState("error");
      }
    }

    loadRiskSummary();

    return () => {
      controller.abort();
    };
  }, [symbol, timeframe, limit]);

  useEffect(() => {
    if (symbol === "" || timeframe === "") {
      return;
    }

    const controller = new AbortController();

    async function loadVolatility(): Promise<void> {
      setVolatilityState("loading");
      setVolatilityErrorText("");

      try {
        const result = await getVolatility({
          symbol,
          timeframe,
          window: volatilityWindow,
          limit,
          signal: controller.signal,
        });

        setVolatilityPoints(result.points || []);
        setVolatilityState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setVolatilityErrorText(message);
        setVolatilityState("error");
      }
    }

    loadVolatility();

    return () => {
      controller.abort();
    };
  }, [symbol, timeframe, limit, volatilityWindow]);

  useEffect(() => {
    if (symbol === "" || timeframe === "") {
      return;
    }

    const controller = new AbortController();

    async function loadDrawdown(): Promise<void> {
      setDrawdownState("loading");
      setDrawdownErrorText("");

      try {
        const result = await getDrawdown({
          symbol,
          timeframe,
          limit,
          signal: controller.signal,
        });

        setDrawdownPoints(result.points || []);
        setDrawdownState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setDrawdownErrorText(message);
        setDrawdownState("error");
      }
    }

    loadDrawdown();

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
        <Button asChild variant="outline" size="sm">
          <Link to="/assets">Back to assets</Link>
        </Button>
      </div>

      <h2 style={{ marginBottom: "8px" }}>{assetTitle}</h2>

      {assetState === "loading" && (
        <DataStateMessage title="Loading asset metadata..." />
      )}

      {assetState === "error" && (
        <DataStateMessage
          title="Failed to load asset metadata."
          detail={assetErrorText}
        />
      )}

      {assetState === "success" && asset && (
        <AssetMeta asset={asset} timeframe={timeframe} />
      )}

      <AssetRangeSelector
        value={selectedRange}
        onChange={(range) => {
          setSelectedRange(range);
        }}
      />

      <AssetSectionCard title="Price">
        {pricesState === "loading" && (
          <DataStateMessage title="Loading price data..." />
        )}

        {pricesState === "error" && (
          <DataStateMessage
            title="Failed to load prices."
            detail={pricesErrorText}
          />
        )}

        {pricesState === "success" && points.length === 0 && (
          <DataStateMessage title="No price points found for the selected range." />
        )}

        {pricesState === "success" && points.length > 0 && (
          <AssetPriceChart
            points={points}
            selectedRange={selectedRange}
            timeframe={timeframe}
          />
        )}
      </AssetSectionCard>

      <AssetSectionCard title="Risk summary">
        {riskState === "loading" && (
          <DataStateMessage title="Loading risk summary..." />
        )}

        {riskState === "error" && (
          <DataStateMessage
            title="Failed to load risk summary."
            detail={riskErrorText}
          />
        )}

        {riskState === "success" && riskSummary && (
          <AssetRiskSummary summary={riskSummary} />
        )}
      </AssetSectionCard>

      <AssetSectionCard title="Returns">
        {returnsState === "loading" && (
          <DataStateMessage title="Loading returns data..." />
        )}

        {returnsState === "error" && (
          <DataStateMessage
            title="Failed to load returns."
            detail={returnsErrorText}
          />
        )}

        {returnsState === "success" && returnsPoints.length === 0 && (
          <DataStateMessage title="No returns points found for the selected range." />
        )}

        {returnsState === "success" && returnsPoints.length > 0 && (
          <AssetReturnsChart
            points={returnsPoints}
            selectedRange={selectedRange}
            timeframe={timeframe}
          />
        )}
      </AssetSectionCard>

      <AssetSectionCard title="Volatility">
        {volatilityState === "loading" && (
          <DataStateMessage title="Loading volatility data..." />
        )}

        {volatilityState === "error" && (
          <DataStateMessage
            title="Failed to load volatility."
            detail={volatilityErrorText}
          />
        )}

        {volatilityState === "success" && volatilityPoints.length === 0 && (
          <DataStateMessage title="No volatility points found for the selected range." />
        )}

        {volatilityState === "success" && volatilityPoints.length > 0 && (
          <AssetVolatilityChart
            points={volatilityPoints}
            selectedRange={selectedRange}
            timeframe={timeframe}
          />
        )}
      </AssetSectionCard>

      <AssetSectionCard title="Drawdown">
        {drawdownState === "loading" && (
          <DataStateMessage title="Loading drawdown data..." />
        )}

        {drawdownState === "error" && (
          <DataStateMessage
            title="Failed to load drawdown."
            detail={drawdownErrorText}
          />
        )}

        {drawdownState === "success" && drawdownPoints.length === 0 && (
          <DataStateMessage title="No drawdown points found for the selected range." />
        )}

        {drawdownState === "success" && drawdownPoints.length > 0 && (
          <AssetDrawdownChart
            points={drawdownPoints}
            selectedRange={selectedRange}
            timeframe={timeframe}
          />
        )}
      </AssetSectionCard>
    </div>
  );
}
