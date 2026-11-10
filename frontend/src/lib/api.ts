/**
 * The ONLY place that knows where the backend lives and how to call it.
 * Every page and component goes through this file, so changing the server
 * address later means editing one line (in .env.local), not hunting through code.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const API_PREFIX = "/api/v1";

/** Shape of the JSON returned by GET /api/v1/health (see backend health.py). */
export type HealthResponse = {
  status: string;
  service: string;
  version: string;
  environment: string;
  server_time_utc: string;
  tools: {
    ffmpeg: string | null;
    ffprobe: string | null;
  };
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/health`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Backend answered with HTTP ${response.status}`);
  }
  return (await response.json()) as HealthResponse;
}
