import { REVALIDATE_LIVE, REVALIDATE_RESULTS } from "./cache";
import type { LapTime, PitStop, OpenF1Session } from "./types";

// =============================================================================
// OpenF1 API client — supplementary live/historical data
// https://api.openf1.org/v1/
// =============================================================================

const BASE_URL = "https://api.openf1.org/v1";

// =============================================================================
// Generic fetch helper
// =============================================================================

async function openF1Fetch<T>(
  endpoint: string,
  params: Record<string, string | number>,
  revalidate: number
): Promise<T | null> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    query.set(key, String(value));
  }

  const url = `${BASE_URL}${endpoint}?${query.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate },
    });

    if (!res.ok) {
      console.error(
        `[openf1] HTTP ${res.status} for ${url}: ${res.statusText}`
      );
      return null;
    }

    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    console.error(`[openf1] Fetch error for ${url}:`, error);
    return null;
  }
}

// =============================================================================
// Public API functions
// =============================================================================

/** Fetch sessions for a given year (optionally filtered by country) */
export async function getSessions(
  year: number,
  countryName?: string
): Promise<OpenF1Session[]> {
  const params: Record<string, string | number> = { year };
  if (countryName) params.country_name = countryName;

  const data = await openF1Fetch<OpenF1Session[]>(
    "/sessions",
    params,
    REVALIDATE_RESULTS
  );
  return data ?? [];
}

/** Fetch lap times for a session */
export async function getLapTimes(
  sessionKey: number,
  driverNumber?: number
): Promise<LapTime[]> {
  const params: Record<string, string | number> = {
    session_key: sessionKey,
  };
  if (driverNumber !== undefined) params.driver_number = driverNumber;

  const data = await openF1Fetch<LapTime[]>(
    "/laps",
    params,
    REVALIDATE_LIVE
  );
  return data ?? [];
}

/** Fetch pit stops for a session */
export async function getPitStops(
  sessionKey: number,
  driverNumber?: number
): Promise<PitStop[]> {
  const params: Record<string, string | number> = {
    session_key: sessionKey,
  };
  if (driverNumber !== undefined) params.driver_number = driverNumber;

  const data = await openF1Fetch<PitStop[]>(
    "/pit",
    params,
    REVALIDATE_LIVE
  );
  return data ?? [];
}
