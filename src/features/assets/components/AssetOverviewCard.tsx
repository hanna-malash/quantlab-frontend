import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import {
  formatNullablePercent,
  formatNullablePrice,
  formatSummaryWindowLabel,
} from "@/features/assets/lib/overview";
import type { AssetOverviewDto } from "@/shared/api/assetsOverview";

type AssetOverviewCardProps = {
  asset: AssetOverviewDto;
};

const cardStyle: CSSProperties = {
  border: "1px solid #d4d4d8",
  borderRadius: "12px",
  padding: "14px 16px",
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "12px",
  marginTop: "14px",
};

const metricLabelStyle: CSSProperties = {
  fontSize: "12px",
  opacity: 0.7,
  marginBottom: "4px",
};

const metricValueStyle: CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
};

export function AssetOverviewCard(props: AssetOverviewCardProps) {
  const { asset } = props;

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ marginBottom: "4px" }}>
            <Link
              to={`/assets/${asset.symbol}`}
              style={{
                color: "inherit",
                textDecoration: "underline",
                fontWeight: 700,
              }}
            >
              {asset.symbol}
            </Link>
          </div>
          {asset.name !== asset.symbol && (
            <div style={{ fontSize: "14px", opacity: 0.85 }}>{asset.name}</div>
          )}
        </div>

        <div style={{ fontSize: "13px", opacity: 0.75 }}>
          {formatSummaryWindowLabel(
            asset.summary_window,
            asset.summary_timeframe,
          )}
        </div>
      </div>

      <div style={metricGridStyle}>
        <div>
          <div style={metricLabelStyle}>Last close</div>
          <div style={metricValueStyle}>
            {formatNullablePrice(asset.last_close)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Return</div>
          <div style={metricValueStyle}>
            {formatNullablePercent(asset.return_30)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Volatility</div>
          <div style={metricValueStyle}>
            {formatNullablePercent(asset.volatility_30)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Max drawdown</div>
          <div style={metricValueStyle}>
            {formatNullablePercent(asset.max_drawdown)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "14px", fontSize: "13px", opacity: 0.75 }}>
        Timeframes: {asset.available_timeframes.join(", ")}
      </div>
    </div>
  );
}
