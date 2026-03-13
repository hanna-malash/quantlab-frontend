import { useEffect, useState } from "react";
import { AssetOverviewCard } from "@/features/assets/components/AssetOverviewCard";
import { sortAssetsOverview } from "@/features/assets/lib/overview";

import {
  getAssetsOverview,
  type AssetOverviewDto,
} from "@/shared/api/assetsOverview";

type UiState = "idle" | "loading" | "success" | "error";

export default function AssetsPage() {
  const [state, setState] = useState<UiState>("idle");
  const [assets, setAssets] = useState<AssetOverviewDto[]>([]);
  const [errorText, setErrorText] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets(): Promise<void> {
      setState("loading");
      setErrorText("");

      try {
        const data = await getAssetsOverview(controller.signal);
        const sorted = sortAssetsOverview(data);
        setAssets(sorted);
        setState("success");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorText(message);
        setState("error");
      }
    }

    loadAssets();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h2>Assets</h2>
      <p style={{ marginTop: "0", marginBottom: "16px", opacity: 0.8 }}>
        Overview metrics for each asset, with the backend selecting the best
        available summary timeframe.
      </p>

      {state === "loading" && <div>Loading assets...</div>}

      {state === "error" && (
        <div>
          <div>Failed to load assets.</div>
          <div>{errorText}</div>
        </div>
      )}

      {state === "success" && assets.length === 0 && (
        <div>No assets found.</div>
      )}

      {state === "success" && assets.length > 0 && (
        <div style={{ display: "grid", gap: "12px" }}>
          {assets.map((asset) => (
            <AssetOverviewCard key={asset.symbol} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
