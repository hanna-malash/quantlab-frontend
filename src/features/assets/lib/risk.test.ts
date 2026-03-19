import { describe, expect, it } from "vitest";

import {
  formatNullablePercentMetric,
  formatNullableRatioMetric,
  formatRiskWindowLabel,
} from "@/features/assets/lib/risk";

describe("risk metric formatting", () => {
  it("formats nullable percent metrics", () => {
    expect(formatNullablePercentMetric(-0.125)).toBe("-12.50%");
    expect(formatNullablePercentMetric(null)).toBe("N/A");
  });

  it("formats nullable ratio metrics", () => {
    expect(formatNullableRatioMetric(1.234)).toBe("+1.23");
    expect(formatNullableRatioMetric(null)).toBe("N/A");
  });

  it("formats the risk summary window label", () => {
    expect(formatRiskWindowLabel(364, "1d")).toBe(
      "364 return observations on 1d",
    );
  });
});
