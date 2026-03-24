import {
  formatNullablePercentMetric,
  formatNullableRatioMetric,
  formatRiskWindowLabel,
} from "@/features/assets/lib/risk";
import type { RiskSummaryDto } from "@/shared/api/riskSummary";

type AssetRiskSummaryProps = {
  summary: RiskSummaryDto;
};

const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
  marginTop: "14px",
};

const metricLabelStyle = {
  fontSize: "12px",
  opacity: 0.7,
  marginBottom: "4px",
};

const metricValueStyle = {
  fontSize: "16px",
  fontWeight: 600,
};

export function AssetRiskSummary(props: AssetRiskSummaryProps) {
  const { summary } = props;

  return (
    <div>
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
          <div style={{ fontSize: "14px", opacity: 0.8 }}>
            Snapshot of return and downside metrics for the selected asset
            window.
          </div>
        </div>

        <div style={{ fontSize: "13px", opacity: 0.75 }}>
          {formatRiskWindowLabel(summary.observations, summary.timeframe)}
        </div>
      </div>

      <div style={metricGridStyle}>
        <div>
          <div style={metricLabelStyle}>Mean return</div>
          <div style={metricValueStyle}>
            {formatNullablePercentMetric(summary.mean_return)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Volatility</div>
          <div style={metricValueStyle}>
            {formatNullablePercentMetric(summary.volatility)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Downside volatility</div>
          <div style={metricValueStyle}>
            {formatNullablePercentMetric(summary.downside_volatility)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Sharpe ratio</div>
          <div style={metricValueStyle}>
            {formatNullableRatioMetric(summary.sharpe_ratio)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Sortino ratio</div>
          <div style={metricValueStyle}>
            {formatNullableRatioMetric(summary.sortino_ratio)}
          </div>
        </div>
        <div>
          <div style={metricLabelStyle}>Max drawdown</div>
          <div style={metricValueStyle}>
            {formatNullablePercentMetric(summary.max_drawdown)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "14px", fontSize: "13px", opacity: 0.75 }}>
        Return type: {summary.return_type}. Risk-free rate:{" "}
        {formatNullablePercentMetric(summary.risk_free_rate)}. Downside target:{" "}
        {formatNullablePercentMetric(summary.downside_target)}.
      </div>
    </div>
  );
}
