import type { CSSProperties } from "react";

import { formatNullablePercentMetric } from "@/features/assets/lib/risk";
import type { PortfolioAnalyticsDto } from "@/shared/api/portfolio";

type PortfolioSummaryProps = {
  portfolio: PortfolioAnalyticsDto;
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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

export function PortfolioSummary(props: PortfolioSummaryProps) {
  const { portfolio } = props;

  return (
    <div>
      <p style={{ marginTop: "0", marginBottom: "12px", opacity: 0.8 }}>
        Weighted portfolio summary on the selected shared timeframe.
      </p>
      <div style={metricGridStyle}>
        <div>
          <div style={metricLabelStyle}>Total return</div>
          <div style={metricValueStyle}>
            {formatNullablePercentMetric(portfolio.summary.total_return)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Volatility</div>
          <div style={metricValueStyle}>
            {formatNullablePercentMetric(portfolio.summary.volatility)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Max drawdown</div>
          <div style={metricValueStyle}>
            {formatNullablePercentMetric(portfolio.summary.max_drawdown)}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "14px", fontSize: "13px", opacity: 0.75 }}>
        Observations: {portfolio.observations}. Base value:{" "}
        {portfolio.base_value}. Return type: {portfolio.return_type}.
      </div>
    </div>
  );
}
