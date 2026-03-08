"use client";

import type { PredictionScore } from "@/lib/predictions/store";
import { StaggeredGrid, StaggeredItem } from "@/components/ui/MotionWrappers";

/** Calculate accuracy metrics from scored predictions */
function computeStats(raceScores: PredictionScore[]) {
  if (raceScores.length === 0) {
    return {
      scoringPct: 0,
      bestRaceScore: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  // Percentage of individual picks (p1, p2, p3) that scored any points
  let totalPicks = 0;
  let scoringPicks = 0;
  let bestRaceScore = 0;

  for (const rs of raceScores) {
    totalPicks += 3;
    if (rs.p1Points > 0) scoringPicks++;
    if (rs.p2Points > 0) scoringPicks++;
    if (rs.p3Points > 0) scoringPicks++;
    if (rs.totalPoints > bestRaceScore) bestRaceScore = rs.totalPoints;
  }

  const scoringPct = totalPicks > 0 ? Math.round((scoringPicks / totalPicks) * 100) : 0;

  // Streak: consecutive races with at least 1 correct pick (totalPoints > 0)
  // Sorted by round ascending
  const sorted = [...raceScores].sort((a, b) => a.round - b.round);
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (const rs of sorted) {
    if (rs.totalPoints > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Current streak: count from the end backwards
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].totalPoints > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { scoringPct, bestRaceScore, currentStreak, longestStreak };
}

interface AccuracyStatsProps {
  raceScores: PredictionScore[];
}

export default function AccuracyStats({ raceScores }: AccuracyStatsProps) {
  const { scoringPct, bestRaceScore, currentStreak, longestStreak } =
    computeStats(raceScores);

  const stats = [
    {
      label: "Picks Scoring",
      value: `${scoringPct}%`,
      sub: "of individual picks scored points",
    },
    {
      label: "Best Race",
      value: `${bestRaceScore}`,
      sub: "pts in a single race",
    },
    {
      label: "Current Streak",
      value: `${currentStreak}`,
      sub: "races with at least 1 correct pick",
    },
    {
      label: "Longest Streak",
      value: `${longestStreak}`,
      sub: "best consecutive scoring run",
    },
  ];

  return (
    <div>
      <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-3 font-medium">
        Accuracy Stats
      </h2>
      <StaggeredGrid className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <StaggeredItem key={s.label}>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-f1-muted mb-1">{s.label}</p>
              <p className="text-2xl font-bold font-orbitron">{s.value}</p>
              <p className="text-[11px] text-f1-muted mt-1 leading-tight">{s.sub}</p>
            </div>
          </StaggeredItem>
        ))}
      </StaggeredGrid>
    </div>
  );
}
