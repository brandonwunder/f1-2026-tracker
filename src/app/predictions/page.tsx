"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getAllPredictions,
  getPlayers,
  getCurrentPlayer,
  getPlayerPredictions,
  type Prediction,
  type Player,
} from "@/lib/predictions/store";
import { getSeasonScore, type SeasonScore } from "@/lib/predictions/scoring";
import type { RaceResult } from "@/lib/api/types";
import { CALENDAR_2026 } from "@/lib/data/calendar-fallback";
import { PageTransition } from "@/components/ui/MotionWrappers";
import SeasonScoreCard from "@/components/predictions/SeasonScore";
import AccuracyStats from "@/components/predictions/AccuracyStats";
import ScoreGraph from "@/components/predictions/ScoreGraph";
import RaceBreakdown from "@/components/predictions/RaceBreakdown";
import PlayerSwitcher from "@/components/predictions/PlayerSwitcher";
import PageBackground from "@/components/ui/PageBackground";

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
      // Silently skip -- results not available yet
    }
  });

  await Promise.all(fetches);
  return resultsByRound;
}

// =============================================================================
// Mini leaderboard data
// =============================================================================

interface MiniLeaderEntry {
  player: Player;
  totalPoints: number;
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
  const [currentPlayer, setCurrentPlayerState] = useState<Player | null>(null);
  const [miniLeaderboard, setMiniLeaderboard] = useState<MiniLeaderEntry[]>([]);

  const loadData = useCallback(async () => {
    const player = getCurrentPlayer();
    setCurrentPlayerState(player);

    // 1. Load predictions for current player
    const preds = getAllPredictions();
    setPredictions(preds);

    // Gather all rounds across all players for results fetch
    const players = getPlayers();
    const allRounds = new Set<number>();
    preds.forEach((p) => allRounds.add(p.round));
    players.forEach((pl) => {
      getPlayerPredictions(pl.id).forEach((p) => allRounds.add(p.round));
    });

    // 2. Fetch race results
    const results = await fetchResultsForRounds(Array.from(allRounds));
    setResultsByRound(results);

    // 3. Calculate season scores for current player
    if (preds.length > 0) {
      const score = getSeasonScore(preds, results);
      setSeasonScore(score);
    } else {
      setSeasonScore(null);
    }

    // 4. Calculate mini leaderboard
    const leaderEntries: MiniLeaderEntry[] = players.map((pl) => {
      const plPreds = getPlayerPredictions(pl.id);
      const plScore = getSeasonScore(plPreds, results);
      return { player: pl, totalPoints: plScore.totalPoints };
    });
    leaderEntries.sort((a, b) => b.totalPoints - a.totalPoints);
    setMiniLeaderboard(leaderEntries.slice(0, 3));

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlayerChange = () => {
    setLoading(true);
    loadData();
  };

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <>
      <PageBackground page="predictions" />
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">Predictions Hub</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-f1-surface border border-f1-border p-6 skeleton-shimmer h-40"
              />
            ))}
          </div>
          <div className="rounded-xl bg-f1-surface border border-f1-border p-6 skeleton-shimmer h-72" />
        </div>
      </PageTransition>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (predictions.length === 0) {
    return (
      <>
      <PageBackground page="predictions" />
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">Predictions Hub</h1>
            <PlayerSwitcher onPlayerChange={handlePlayerChange} compact />
          </div>

          {/* Mini Leaderboard + Leaderboard Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MiniLeaderboardCard entries={miniLeaderboard} />
            <LeaderboardLinkCard />
          </div>

          <div className="rounded-xl bg-f1-surface border border-f1-border p-8 text-center">
            <p className="text-f1-muted text-lg mb-2">No predictions yet</p>
            <p className="text-f1-muted text-sm">
              Visit individual race pages to make {currentPlayer?.name ? `${currentPlayer.name}'s` : "your"} P1/P2/P3 podium predictions.
              Scores, accuracy stats, and performance graph will appear here.
            </p>
          </div>
        </div>
      </PageTransition>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Main hub view
  // ---------------------------------------------------------------------------

  const raceScores = seasonScore?.raceScores ?? [];
  const totalPoints = seasonScore?.totalPoints ?? 0;

  return (
    <>
    <PageBackground page="predictions" />
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">
            {currentPlayer?.name ? `${currentPlayer.name}'s` : ""} Predictions Hub
          </h1>
          <PlayerSwitcher onPlayerChange={handlePlayerChange} compact />
        </div>

        {/* Mini Leaderboard + Leaderboard Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MiniLeaderboardCard entries={miniLeaderboard} />
          <LeaderboardLinkCard />
        </div>

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
    </PageTransition>
    </>
  );
}

// =============================================================================
// Mini Leaderboard Card
// =============================================================================

function MiniLeaderboardCard({ entries }: { entries: MiniLeaderEntry[] }) {
  const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card rounded-xl p-4"
    >
      <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-3 font-medium">
        Top 3
      </h2>
      {entries.length === 0 ? (
        <p className="text-f1-muted text-sm">No players yet</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div
              key={entry.player.id}
              className="flex items-center gap-3 rounded-lg bg-f1-dark border border-f1-border p-2.5"
            >
              <span className="text-lg">{medals[idx] ?? ""}</span>
              <span className="text-lg">{entry.player.emoji}</span>
              <span className="text-sm font-medium flex-1 truncate">
                {entry.player.name}
              </span>
              <span className="text-sm font-bold font-orbitron text-f1-red">
                {entry.totalPoints}
              </span>
              <span className="text-[10px] text-f1-muted">pts</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// =============================================================================
// Leaderboard Link Card
// =============================================================================

function LeaderboardLinkCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Link
        href="/predictions/leaderboard"
        className="block glass-card rounded-xl p-4 h-full border border-f1-border hover:border-f1-red/40 transition-all group"
      >
        <div className="flex items-center gap-3 h-full">
          <span className="text-3xl">{"\u{1F3C6}"}</span>
          <div className="flex-1">
            <h2 className="text-sm font-bold group-hover:text-f1-red transition-colors">
              Family Leaderboard
            </h2>
            <p className="text-xs text-f1-muted mt-1">
              Full standings, podium view, and head-to-head comparisons
            </p>
          </div>
          <svg
            className="w-5 h-5 text-f1-muted group-hover:text-f1-red transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
