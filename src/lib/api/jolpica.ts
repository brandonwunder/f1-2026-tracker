import { REVALIDATE_RESULTS, REVALIDATE_STATIC } from "./cache";
import type {
  JolpicaResponse,
  RaceTableData,
  RaceResultsTableData,
  DriverTableData,
  ConstructorTableData,
  DriverStandingsData,
  ConstructorStandingsData,
  Race,
  RaceWithResults,
  Driver,
  Constructor,
  DriverStanding,
  ConstructorStanding,
} from "./types";

// =============================================================================
// Jolpica F1 API client
// https://api.jolpi.ca/ergast/f1/ — drop-in Ergast replacement
// =============================================================================

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

// =============================================================================
// Rate limiter — simple token bucket (server-side only)
// Max 4 requests/second burst, refills at 4 tokens/sec
// =============================================================================

const BUCKET_MAX = 4;
const REFILL_RATE = 4; // tokens per second

let tokenCount = BUCKET_MAX;
let lastRefillTime = Date.now();
let hourlyCount = 0;
let hourlyResetTime = Date.now();

const HOURLY_LIMIT = 500;

async function waitForToken(): Promise<void> {
  // Reset hourly counter if needed
  const now = Date.now();
  if (now - hourlyResetTime >= 3_600_000) {
    hourlyCount = 0;
    hourlyResetTime = now;
  }

  // Check hourly limit
  if (hourlyCount >= HOURLY_LIMIT) {
    const waitMs = 3_600_000 - (now - hourlyResetTime);
    console.warn(
      `[jolpica] Hourly rate limit reached (${HOURLY_LIMIT}/hr). Waiting ${Math.ceil(waitMs / 1000)}s.`
    );
    await sleep(waitMs);
    hourlyCount = 0;
    hourlyResetTime = Date.now();
  }

  // Refill tokens based on elapsed time
  const elapsed = (Date.now() - lastRefillTime) / 1000;
  tokenCount = Math.min(BUCKET_MAX, tokenCount + elapsed * REFILL_RATE);
  lastRefillTime = Date.now();

  // Wait if no tokens available
  if (tokenCount < 1) {
    const waitMs = ((1 - tokenCount) / REFILL_RATE) * 1000;
    await sleep(waitMs);
    tokenCount = 1;
    lastRefillTime = Date.now();
  }

  tokenCount -= 1;
  hourlyCount += 1;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// Generic fetch helper
// =============================================================================

async function jolpicaFetch<T>(
  endpoint: string,
  revalidate: number
): Promise<T | null> {
  await waitForToken();

  const url = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      next: { revalidate },
    });

    if (!res.ok) {
      console.error(
        `[jolpica] HTTP ${res.status} for ${url}: ${res.statusText}`
      );
      return null;
    }

    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    console.error(`[jolpica] Fetch error for ${url}:`, error);
    return null;
  }
}

// =============================================================================
// Public API functions
// =============================================================================

/** Fetch the current season calendar (all races) */
export async function getSeasonCalendar(): Promise<Race[]> {
  const data = await jolpicaFetch<JolpicaResponse<RaceTableData>>(
    "/current.json",
    REVALIDATE_STATIC
  );
  return data?.MRData?.RaceTable?.Races ?? [];
}

/** Fetch all drivers for the current season */
export async function getDrivers(): Promise<Driver[]> {
  const data = await jolpicaFetch<JolpicaResponse<DriverTableData>>(
    "/current/drivers.json",
    REVALIDATE_STATIC
  );
  return data?.MRData?.DriverTable?.Drivers ?? [];
}

/** Fetch all constructors for the current season */
export async function getConstructors(): Promise<Constructor[]> {
  const data = await jolpicaFetch<JolpicaResponse<ConstructorTableData>>(
    "/current/constructors.json",
    REVALIDATE_STATIC
  );
  return data?.MRData?.ConstructorTable?.Constructors ?? [];
}

/** Fetch driver championship standings */
export async function getDriverStandings(): Promise<DriverStanding[]> {
  const data = await jolpicaFetch<JolpicaResponse<DriverStandingsData>>(
    "/current/driverStandings.json",
    REVALIDATE_RESULTS
  );
  const lists = data?.MRData?.StandingsTable?.StandingsLists;
  if (!lists || lists.length === 0) return [];
  return lists[0].DriverStandings ?? [];
}

/** Fetch constructor championship standings */
export async function getConstructorStandings(): Promise<
  ConstructorStanding[]
> {
  const data = await jolpicaFetch<JolpicaResponse<ConstructorStandingsData>>(
    "/current/constructorStandings.json",
    REVALIDATE_RESULTS
  );
  const lists = data?.MRData?.StandingsTable?.StandingsLists;
  if (!lists || lists.length === 0) return [];
  return lists[0].ConstructorStandings ?? [];
}

/** Fetch race results for a specific round */
export async function getRaceResults(
  round: number | string
): Promise<RaceWithResults | null> {
  const data = await jolpicaFetch<JolpicaResponse<RaceResultsTableData>>(
    `/current/${round}/results.json`,
    REVALIDATE_RESULTS
  );
  const races = data?.MRData?.RaceTable?.Races;
  if (!races || races.length === 0) return null;
  return races[0];
}

/** Fetch qualifying results for a specific round */
export async function getQualifyingResults(
  round: number | string
): Promise<RaceWithResults | null> {
  const data = await jolpicaFetch<JolpicaResponse<RaceResultsTableData>>(
    `/current/${round}/qualifying.json`,
    REVALIDATE_RESULTS
  );
  const races = data?.MRData?.RaceTable?.Races;
  if (!races || races.length === 0) return null;
  return races[0];
}
