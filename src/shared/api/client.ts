import { env } from "@/shared/config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class HttpError extends Error {
  public status: number;
  public bodyText: string;

  public constructor(status: number, bodyText: string) {
    super(`HTTP ${status}`);
    this.status = status;
    this.bodyText = bodyText;
  }
}

function buildUrl(path: string): string {
  // English: Allow passing "/api/..." or just "/prices".
  if (path.startsWith("/api")) {
    return path;
  }

  if (env.apiBaseUrl.endsWith("/") && path.startsWith("/")) {
    return `${env.apiBaseUrl.slice(0, env.apiBaseUrl.length - 1)}${path}`;
  }

  if (!env.apiBaseUrl.endsWith("/") && !path.startsWith("/")) {
    return `${env.apiBaseUrl}/${path}`;
  }

  return `${env.apiBaseUrl}${path}`;
}

export async function requestJson<TResponse>(
  method: HttpMethod,
  path: string,
  init?: { body?: unknown; signal?: AbortSignal },
): Promise<TResponse> {
  const url = buildUrl(path);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  let body: string | undefined;
  if (init && init.body !== undefined) {
    // English: Send JSON body.
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.body);
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
    signal: init?.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new HttpError(response.status, text);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as unknown as TResponse;
  }

  return (await response.json()) as TResponse;
}
