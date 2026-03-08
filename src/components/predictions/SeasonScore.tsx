"use client";

import type { PredictionScore } from "@/lib/predictions/store";

interface SeasonScoreProps {
  totalPoints: number;
  raceScores: PredictionScore[];
}

export default function SeasonScore({ totalPoints, raceScores }: SeasonScoreProps) {
  const racesScored = raceScores.length;
  const avgPerRace = racesScored > 0 ? (totalPoints / racesScored).toFixed(1) : "0.0";

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-6">
      <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-4 font-medium">
        Season Score
      </h2>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-5xl font-bold text-f1-red leading-none">
          {totalPoints}
        </span>
        <span className="text-lg text-f1-muted mb-1">pts</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-f1-dark border border-f1-border p-3">
          <p className="text-xs text-f1-muted mb-1">Races Predicted</p>
          <p className="text-xl font-bold">{racesScored}</p>
        </div>
        <div className="rounded-lg bg-f1-dark border border-f1-border p-3">
          <p className="text-xs text-f1-muted mb-1">Avg per Race</p>
          <p className="text-xl font-bold">{avgPerRace}</p>
        </div>
      </div>
    </div>
  );
}
