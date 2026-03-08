// =============================================================================
// Prediction scoring engine
// =============================================================================

import type { RaceResult } from "@/lib/api/types";
import type { Prediction, PredictionScore } from "./store";

// Points awarded per pick
const EXACT_POSITION = 25; // Correct driver in correct podium position
const RIGHT_DRIVER_WRONG_POS = 10; // Driver on podium but different position
const DRIVER_IN_TOP_5 = 5; // Driver finished top 5 but not on podium

// =============================================================================
// Score a single prediction against actual race results
// =============================================================================

/**
 * Score a single prediction.
 *
 * For each pick (P1, P2, P3):
 * - 25 pts if the driver finished in exactly that position
 * - 10 pts if the driver finished on the podium (P1-P3) but in a different slot
 * -  5 pts if the driver finished in the top 5 but not on the podium
 * -  0 pts otherwise
 */
export function scorePrediction(
  prediction: Prediction,
  raceResults: RaceResult[]
): PredictionScore {
  if (raceResults.length === 0) {
    return {
      round: prediction.round,
      p1Points: 0,
      p2Points: 0,
      p3Points: 0,
      totalPoints: 0,
    };
  }

  // Build lookup: driverId -> finishing position (1-indexed)
  const positionOf: Record<string, number> = {};
  for (const r of raceResults) {
    positionOf[r.Driver.driverId] = parseInt(r.position, 10);
  }

  // Actual podium driver IDs (positions 1, 2, 3)
  const podiumIds = new Set(
    raceResults
      .filter((r) => parseInt(r.position, 10) <= 3)
      .map((r) => r.Driver.driverId)
  );

  const scoreForPick = (driverId: string, predictedPos: number): number => {
    const actual = positionOf[driverId];
    if (actual === undefined) return 0; // driver didn't finish / not in results
    if (actual === predictedPos) return EXACT_POSITION;
    if (podiumIds.has(driverId)) return RIGHT_DRIVER_WRONG_POS;
    if (actual <= 5) return DRIVER_IN_TOP_5;
    return 0;
  };

  const p1Points = scoreForPick(prediction.p1, 1);
  const p2Points = scoreForPick(prediction.p2, 2);
  const p3Points = scoreForPick(prediction.p3, 3);

  return {
    round: prediction.round,
    p1Points,
    p2Points,
    p3Points,
    totalPoints: p1Points + p2Points + p3Points,
  };
}

// =============================================================================
// Season-level aggregation
// =============================================================================

export interface SeasonScore {
  totalPoints: number;
  raceScores: PredictionScore[];
}

/**
 * Calculate the aggregate season score across all predictions that have
 * corresponding race results.
 *
 * @param predictions  All saved predictions
 * @param resultsByRound  Map of round number -> RaceResult[]
 */
export function getSeasonScore(
  predictions: Prediction[],
  resultsByRound: Record<number, RaceResult[]>
): SeasonScore {
  const raceScores: PredictionScore[] = [];

  for (const pred of predictions) {
    const results = resultsByRound[pred.round];
    if (!results || results.length === 0) continue;
    raceScores.push(scorePrediction(pred, results));
  }

  return {
    totalPoints: raceScores.reduce((sum, s) => sum + s.totalPoints, 0),
    raceScores,
  };
}

// =============================================================================
// Helpers
// =============================================================================

/** Check whether race results are available for a given round */
export function hasRaceResults(results: RaceResult[] | undefined | null): boolean {
  return !!results && results.length > 0;
}
