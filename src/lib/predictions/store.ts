// =============================================================================
// Prediction store — localStorage-backed persistence for podium predictions
// =============================================================================

const STORAGE_KEY = "f1-2026-predictions";

/** A user's podium prediction for a single race round */
export interface Prediction {
  round: number;
  p1: string; // driverId
  p2: string;
  p3: string;
  timestamp: number;
  locked: boolean;
}

/** Scoring result for a single prediction */
export interface PredictionScore {
  round: number;
  p1Points: number;
  p2Points: number;
  p3Points: number;
  totalPoints: number;
}

/** Map of round number to prediction */
type PredictionMap = Record<number, Prediction>;

// =============================================================================
// Internal helpers
// =============================================================================

function loadAll(): PredictionMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PredictionMap;
  } catch {
    return {};
  }
}

function saveAll(map: PredictionMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// =============================================================================
// Public API
// =============================================================================

/** Save (or update) a podium prediction for a given round */
export function savePrediction(
  round: number,
  p1: string,
  p2: string,
  p3: string
): void {
  const map = loadAll();
  const existing = map[round];

  // Don't overwrite a locked prediction
  if (existing?.locked) return;

  map[round] = {
    round,
    p1,
    p2,
    p3,
    timestamp: Date.now(),
    locked: false,
  };
  saveAll(map);
}

/** Retrieve the prediction for a specific round (or null) */
export function getPrediction(round: number): Prediction | null {
  const map = loadAll();
  return map[round] ?? null;
}

/** Get all saved predictions keyed by round */
export function getAllPredictions(): Prediction[] {
  const map = loadAll();
  return Object.values(map).sort((a, b) => a.round - b.round);
}

/** Lock a prediction so it can no longer be edited */
export function lockPrediction(round: number): void {
  const map = loadAll();
  if (map[round]) {
    map[round].locked = true;
    saveAll(map);
  }
}

/** Check whether a round's prediction is locked */
export function isPredictionLocked(round: number): boolean {
  const map = loadAll();
  return map[round]?.locked === true;
}
