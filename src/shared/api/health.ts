import { requestJson } from "@/shared/api/client";

export type HealthResponse = {
  status: string;
};

export async function getHealth(): Promise<HealthResponse> {
  return await requestJson<HealthResponse>("GET", "/api/v1/health");
}
