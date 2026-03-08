"use client";

import { useState, useEffect } from "react";
import { getAllPredictions, type Prediction } from "@/lib/predictions/store";
import { getSeasonScore, type SeasonScore } from "@/lib/predictions/scoring";
import type { RaceResult } from "@/lib/api/types";
import { CALENDAR_2026 } from "@/lib/data/calendar-fallback";
import SeasonScoreCard from "@/components/predictions/SeasonScore";
import AccuracyStats from "@/components/predictions/AccuracyStats";
import ScoreGraph from "@/components/predictions/ScoreGraph";
import RaceBreakdown from "@/components/predictions/RaceBreakdown";

// =============================================================================
// Fetch race results for all completed rounds (client-side)
// =============================================================================

async function fetchResultsForRounds(
  rounds: number[]
): Promise<Record<number, RaceResult[]>> {
  const resultsByRound: Record<number, RaceResult[]> = {};

  // Fetch in parallel, but only for rounds whose race date has passed
  const now = new Date();
  const completedRounds = rounds.filter((round) => {
    const race = CALENDAR_2026.find((r) => r.round === round);
    if (!race) return false;
    const raceDate = new Date(race.date);
    // Add 4 hours buffer for race to finish
    raceDate.setHours(raceDate.getHours() + 4);
    return now > raceDate;
  });

  const fetches = completedRounds.map(async (round) => {
    try {
      const res = await fetch(`/api/race-results/${round}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.Results && data.Results.length > 0) {
        resultsByRound[round] = data.Results;
      }
    } catch {
      // Silently skip — results not available yet
    }
  });

  await Promise.all(fetches);
  return resultsByRound;
}

// =============================================================================
// Page component
// =============================================================================

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [resultsByRound, setResultsByRound] = useState<
    Record<number, RaceResult[]>
  >({});
  const [seasonScore, setSeasonScore] = useState<SeasonScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1. Load all predictions from localStorage
      const preds = getAllPredictions();
      setPredictions(preds);

      if (preds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Fetch race results for predicted rounds
      const rounds = preds.map((p) => p.round);
      const results = await fetchResultsForRounds(rounds);
      setResultsByRound(results);

      // 3. Calculate season scores
      const score = getSeasonScore(preds, results);
      setSeasonScore(score);

      setLoading(false);
    }

    load();
  }, []);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Predictions Hub</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-f1-surface border border-f1-border p-6 animate-pulse h-40"
            />
          ))}
        </div>
        <div className="rounded-xl bg-f1-surface border border-f1-border p-6 animate-pulse h-72" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (predictions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Predictions Hub</h1>
        <div className="rounded-xl bg-f1-surface border border-f1-border p-8 text-center">
          <p className="text-f1-muted text-lg mb-2">No predictions yet</p>
          <p className="text-f1-muted text-sm">
            Visit individual race pages to make your P1/P2/P3 podium predictions.
            Your scores, accuracy stats, and performance graph will appear here.
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main hub view
  // ---------------------------------------------------------------------------

  const raceScores = seasonScore?.raceScores ?? [];
  const totalPoints = seasonScore?.totalPoints ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Predictions Hub</h1>

      {/* Score summary + accuracy stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <SeasonScoreCard totalPoints={totalPoints} raceScores={raceScores} />
        </div>
        <div className="md:col-span-2">
          <AccuracyStats raceScores={raceScores} />
        </div>
      </div>

      {/* Score-over-time graph */}
      <ScoreGraph raceScores={raceScores} calendar={CALENDAR_2026} />

      {/* Race-by-race breakdown */}
      <RaceBreakdown
        predictions={predictions}
        raceScores={raceScores}
        calendar={CALENDAR_2026}
        resultsByRound={resultsByRound}
      />

      {/* Pending predictions notice */}
      {predictions.length > raceScores.length && (
        <div className="rounded-xl bg-f1-surface border border-f1-border p-4">
          <p className="text-f1-muted text-sm">
            {predictions.length - raceScores.length} prediction
            {predictions.length - raceScores.length !== 1 ? "s" : ""} awaiting
            race results.
          </p>
        </div>
      )}
    </div>
  );
}
