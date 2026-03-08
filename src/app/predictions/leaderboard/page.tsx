"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  getPlayers,
  getPlayerPredictions,
  type Player,
  type Prediction,
} from "@/lib/predictions/store";
import {
  getSeasonScore,
  type SeasonScore,
} from "@/lib/predictions/scoring";
import type { RaceResult } from "@/lib/api/types";
import { CALENDAR_2026 } from "@/lib/data/calendar-fallback";
import { PageTransition } from "@/components/ui/MotionWrappers";
import PlayerSwitcher from "@/components/predictions/PlayerSwitcher";

// =============================================================================
// Types
// =============================================================================

interface PlayerStats {
  player: Player;
  predictions: Prediction[];
  seasonScore: SeasonScore;
  totalPoints: number;
  racesPredicted: number;
  racesScored: number;
  accuracy: number; // percentage
}

// =============================================================================
// Fetch results
// =============================================================================

async function fetchResultsForRounds(
  rounds: number[]
): Promise<Record<number, RaceResult[]>> {
  const resultsByRound: Record<number, RaceResult[]> = {};
  const now = new Date();
  const completedRounds = rounds.filter((round) => {
    const race = CALENDAR_2026.find((r) => r.round === round);
    if (!race) return false;
    const raceDate = new Date(race.date);
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
      // skip
    }
  });

  await Promise.all(fetches);
  return resultsByRound;
}

// =============================================================================
// Podium colors
// =============================================================================

const PODIUM_COLORS = {
  1: { bg: "from-yellow-500/20 to-yellow-600/5", border: "border-yellow-500/40", text: "text-yellow-400", label: "1ST", shadow: "shadow-yellow-500/20" },
  2: { bg: "from-gray-300/20 to-gray-400/5", border: "border-gray-400/40", text: "text-gray-300", label: "2ND", shadow: "shadow-gray-400/20" },
  3: { bg: "from-amber-700/20 to-amber-800/5", border: "border-amber-600/40", text: "text-amber-500", label: "3RD", shadow: "shadow-amber-600/20" },
} as const;

// =============================================================================
// Component
// =============================================================================

export default function LeaderboardPage() {
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [h2hPlayer1, setH2hPlayer1] = useState<string>("");
  const [h2hPlayer2, setH2hPlayer2] = useState<string>("");
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    async function load() {
      const players = getPlayers();

      // Gather all unique rounds across all players
      const allRounds = new Set<number>();
      const playerPreds: Record<string, Prediction[]> = {};
      for (const p of players) {
        const preds = getPlayerPredictions(p.id);
        playerPreds[p.id] = preds;
        preds.forEach((pred) => allRounds.add(pred.round));
      }

      // Fetch results
      const results = await fetchResultsForRounds(Array.from(allRounds));

      // Calculate stats for each player
      const stats: PlayerStats[] = players.map((player) => {
        const preds = playerPreds[player.id] || [];
        const score = getSeasonScore(preds, results);
        const maxPossible = score.raceScores.length * 75;
        const accuracy = maxPossible > 0 ? Math.round((score.totalPoints / maxPossible) * 100) : 0;

        return {
          player,
          predictions: preds,
          seasonScore: score,
          totalPoints: score.totalPoints,
          racesPredicted: preds.length,
          racesScored: score.raceScores.length,
          accuracy,
        };
      });

      // Sort by total points descending
      stats.sort((a, b) => b.totalPoints - a.totalPoints);
      setPlayerStats(stats);

      // Set default h2h players
      if (stats.length >= 2) {
        setH2hPlayer1(stats[0].player.id);
        setH2hPlayer2(stats[1].player.id);
      }

      setLoading(false);
    }

    load();
  }, []);

  // Fire confetti for the leader once
  useEffect(() => {
    if (!loading && playerStats.length > 0 && !confettiFired) {
      setConfettiFired(true);
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.3, x: 0.5 },
          colors: ["#FFD700", "#E10600", "#FFFFFF", "#FFA500"],
          startVelocity: 30,
        });
      }, 600);
    }
  }, [loading, playerStats, confettiFired]);

  // H2H data
  const h2hData = useMemo(() => {
    if (!h2hPlayer1 || !h2hPlayer2) return [];
    const p1 = playerStats.find((s) => s.player.id === h2hPlayer1);
    const p2 = playerStats.find((s) => s.player.id === h2hPlayer2);
    if (!p1 || !p2) return [];

    const allRounds = new Set<number>();
    p1.seasonScore.raceScores.forEach((s) => allRounds.add(s.round));
    p2.seasonScore.raceScores.forEach((s) => allRounds.add(s.round));

    const p1ScoreMap = new Map(p1.seasonScore.raceScores.map((s) => [s.round, s.totalPoints]));
    const p2ScoreMap = new Map(p2.seasonScore.raceScores.map((s) => [s.round, s.totalPoints]));

    const calendarMap = new Map(CALENDAR_2026.map((r) => [r.round, r.raceName]));

    return Array.from(allRounds)
      .sort((a, b) => a - b)
      .map((round) => ({
        round,
        raceName: calendarMap.get(round) ?? `Round ${round}`,
        p1Score: p1ScoreMap.get(round) ?? null,
        p2Score: p2ScoreMap.get(round) ?? null,
      }));
  }, [h2hPlayer1, h2hPlayer2, playerStats]);

  // Loading
  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">Family Leaderboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-f1-surface border border-f1-border p-6 skeleton-shimmer h-48"
              />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  const top3 = playerStats.slice(0, 3);
  // Podium order: P2 (left), P1 (center), P3 (right)
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3.length === 2
    ? [top3[1], top3[0]]
    : top3;
  const podiumPositions = top3.length >= 3
    ? [2, 1, 3]
    : top3.length === 2
    ? [2, 1]
    : [1];

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{"\u{1F3C6}"}</span>
            <h1 className="text-3xl md:text-4xl font-bold font-orbitron bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              Family Leaderboard
            </h1>
            <span className="text-4xl">{"\u{1F3C6}"}</span>
          </div>
          <p className="text-f1-muted text-sm">
            Who has the best F1 predictions? The race is on!
          </p>
          <div className="mt-3">
            <Link
              href="/predictions"
              className="text-xs text-f1-red hover:text-red-400 transition-colors"
            >
              {"\u2190"} Back to Predictions Hub
            </Link>
          </div>
        </motion.div>

        {/* ============================================================= */}
        {/* PODIUM */}
        {/* ============================================================= */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-3 md:gap-6 px-4">
            {podiumOrder.map((stats, i) => {
              const pos = podiumPositions[i] as 1 | 2 | 3;
              const colors = PODIUM_COLORS[pos];
              const heights: Record<number, string> = { 1: "h-52 md:h-64", 2: "h-40 md:h-48", 3: "h-36 md:h-44" };

              return (
                <motion.div
                  key={stats.player.id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: pos === 1 ? 0.3 : pos === 2 ? 0.1 : 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className={`relative flex flex-col items-center ${pos === 1 ? "w-32 md:w-40" : "w-28 md:w-36"}`}
                >
                  {/* Player card */}
                  <div className={`w-full glass-card rounded-xl border ${colors.border} p-4 text-center mb-0 ${colors.shadow} shadow-lg`}>
                    {/* Sparkle for leader */}
                    {pos === 1 && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-3 -right-3 text-2xl"
                      >
                        {"\u2728"}
                      </motion.div>
                    )}

                    <motion.div
                      animate={pos === 1 ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`text-3xl md:text-4xl mb-2 ${pos === 1 ? "drop-shadow-lg" : ""}`}
                    >
                      {stats.player.emoji}
                    </motion.div>
                    <p className={`text-sm md:text-base font-bold truncate ${pos === 1 ? "text-yellow-400" : ""}`}>
                      {stats.player.name}
                    </p>
                    <p className={`text-xl md:text-2xl font-bold font-orbitron ${colors.text} mt-1`}>
                      {stats.totalPoints}
                    </p>
                    <p className="text-[10px] text-f1-muted">pts</p>
                    {stats.racesScored > 0 && (
                      <p className="text-[10px] text-f1-muted mt-1">
                        {stats.accuracy}% accuracy
                      </p>
                    )}
                  </div>

                  {/* Podium block */}
                  <div
                    className={`w-full ${heights[pos]} rounded-t-lg bg-gradient-to-t ${colors.bg} border-x border-t ${colors.border} flex items-start justify-center pt-3`}
                  >
                    <span className={`text-lg md:text-xl font-bold font-orbitron ${colors.text}`}>
                      {colors.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ============================================================= */}
        {/* FULL RANKINGS TABLE */}
        {/* ============================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-f1-border">
            <h2 className="text-xs uppercase tracking-wider text-f1-muted font-medium">
              Full Standings
            </h2>
          </div>
          <div className="divide-y divide-f1-border">
            {playerStats.map((stats, idx) => (
              <motion.div
                key={stats.player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.05, duration: 0.3 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-f1-surface-hover transition-colors"
              >
                {/* Position */}
                <span
                  className={`text-lg font-bold font-orbitron w-8 text-center ${
                    idx === 0 ? "text-yellow-400" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-amber-500" : "text-f1-muted"
                  }`}
                >
                  {idx + 1}
                </span>

                {/* Player info */}
                <span className="text-2xl">{stats.player.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{stats.player.name}</p>
                  <p className="text-xs text-f1-muted">
                    {stats.racesPredicted} race{stats.racesPredicted !== 1 ? "s" : ""} predicted
                    {stats.racesScored > 0 && ` \u00B7 ${stats.accuracy}% accuracy`}
                  </p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="text-xl font-bold font-orbitron text-f1-red">
                    {stats.totalPoints}
                  </span>
                  <span className="text-xs text-f1-muted ml-1">pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============================================================= */}
        {/* HEAD-TO-HEAD COMPARISON */}
        {/* ============================================================= */}
        {playerStats.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="glass-card rounded-xl p-6"
          >
            <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-4 font-medium">
              Head-to-Head
            </h2>

            {/* Player pickers */}
            <div className="flex items-center gap-4 mb-6">
              <select
                value={h2hPlayer1}
                onChange={(e) => setH2hPlayer1(e.target.value)}
                className="flex-1 rounded-lg border border-f1-border bg-f1-dark text-white text-sm py-2 px-3 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-f1-red"
              >
                {playerStats.map((s) => (
                  <option key={s.player.id} value={s.player.id}>
                    {s.player.emoji} {s.player.name}
                  </option>
                ))}
              </select>

              <span className="text-f1-muted font-bold text-sm">VS</span>

              <select
                value={h2hPlayer2}
                onChange={(e) => setH2hPlayer2(e.target.value)}
                className="flex-1 rounded-lg border border-f1-border bg-f1-dark text-white text-sm py-2 px-3 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-f1-red"
              >
                {playerStats.map((s) => (
                  <option key={s.player.id} value={s.player.id}>
                    {s.player.emoji} {s.player.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Comparison summary */}
            {h2hPlayer1 && h2hPlayer2 && (() => {
              const p1Stats = playerStats.find((s) => s.player.id === h2hPlayer1);
              const p2Stats = playerStats.find((s) => s.player.id === h2hPlayer2);
              if (!p1Stats || !p2Stats) return null;

              let p1Wins = 0;
              let p2Wins = 0;
              let draws = 0;
              h2hData.forEach((r) => {
                if (r.p1Score !== null && r.p2Score !== null) {
                  if (r.p1Score > r.p2Score) p1Wins++;
                  else if (r.p2Score > r.p1Score) p2Wins++;
                  else draws++;
                }
              });

              return (
                <>
                  {/* Summary bars */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold font-orbitron text-green-400">{p1Wins}</p>
                      <p className="text-xs text-f1-muted">{p1Stats.player.name} wins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold font-orbitron text-f1-muted">{draws}</p>
                      <p className="text-xs text-f1-muted">Draws</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold font-orbitron text-blue-400">{p2Wins}</p>
                      <p className="text-xs text-f1-muted">{p2Stats.player.name} wins</p>
                    </div>
                  </div>

                  {/* Race-by-race table */}
                  {h2hData.length > 0 ? (
                    <div className="space-y-2">
                      {h2hData.map((r) => {
                        const p1Higher = (r.p1Score ?? 0) > (r.p2Score ?? 0);
                        const p2Higher = (r.p2Score ?? 0) > (r.p1Score ?? 0);
                        return (
                          <div
                            key={r.round}
                            className="flex items-center gap-3 rounded-lg bg-f1-dark border border-f1-border p-3"
                          >
                            <span className="text-xs text-f1-muted w-6 font-mono">R{r.round}</span>
                            <span className="text-xs text-f1-muted flex-1 truncate">{r.raceName}</span>
                            <span
                              className={`text-sm font-bold font-orbitron w-10 text-right ${
                                p1Higher ? "text-green-400" : "text-f1-muted"
                              }`}
                            >
                              {r.p1Score ?? "-"}
                            </span>
                            <span className="text-xs text-f1-muted">vs</span>
                            <span
                              className={`text-sm font-bold font-orbitron w-10 ${
                                p2Higher ? "text-blue-400" : "text-f1-muted"
                              }`}
                            >
                              {r.p2Score ?? "-"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-f1-muted text-sm text-center">
                      No scored races to compare yet.
                    </p>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}

        {/* ============================================================= */}
        {/* INVITE SECTION */}
        {/* ============================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="glass-card rounded-xl p-6 text-center border border-dashed border-f1-border"
        >
          <span className="text-3xl mb-3 block">{"\u{1F3CE}\u{FE0F}"}</span>
          <h3 className="text-lg font-bold mb-2">
            Add a Friend or Family Member!
          </h3>
          <p className="text-f1-muted text-sm mb-4">
            The more players, the more fun. Add someone to the competition and see who really knows F1 best.
          </p>
          <div className="flex justify-center">
            <PlayerSwitcher />
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
