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
import { getCountryFlag } from "@/lib/utils/dates";
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
      // Silently skip
    }
  });

  await Promise.all(fetches);
  return resultsByRound;
}

// =============================================================================
// Types
// =============================================================================

interface MiniLeaderEntry {
  player: Player;
  totalPoints: number;
  predictionCount: number;
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

    const preds = getAllPredictions();
    setPredictions(preds);

    const players = getPlayers();
    const allRounds = new Set<number>();
    preds.forEach((p) => allRounds.add(p.round));
    players.forEach((pl) => {
      getPlayerPredictions(pl.id).forEach((p) => allRounds.add(p.round));
    });

    const results = await fetchResultsForRounds(Array.from(allRounds));
    setResultsByRound(results);

    if (preds.length > 0) {
      const score = getSeasonScore(preds, results);
      setSeasonScore(score);
    } else {
      setSeasonScore(null);
    }

    const leaderEntries: MiniLeaderEntry[] = players.map((pl) => {
      const plPreds = getPlayerPredictions(pl.id);
      const plScore = getSeasonScore(plPreds, results);
      return {
        player: pl,
        totalPoints: plScore.totalPoints,
        predictionCount: plPreds.length,
      };
    });
    leaderEntries.sort((a, b) => b.totalPoints - a.totalPoints);
    setMiniLeaderboard(leaderEntries);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlayerChange = () => {
    setLoading(true);
    loadData();
  };

  // Find upcoming races without predictions
  const predictedRounds = new Set(predictions.map((p) => p.round));
  const now = new Date();
  const upcomingRaces = CALENDAR_2026.filter((race) => {
    const raceDate = new Date(race.date);
    return raceDate > now;
  }).slice(0, 5);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <>
        <PageBackground page="predictions" />
        <PageTransition>
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-f1-red rounded-full shadow-[0_0_12px_rgba(225,6,0,0.4)]" />
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="text-f1-red">PREDICTIONS</span> HUB
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl glass-card border border-f1-border p-6 skeleton-shimmer h-40"
                />
              ))}
            </div>
            <div className="rounded-xl glass-card border border-f1-border p-6 skeleton-shimmer h-72" />
          </div>
        </PageTransition>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const raceScores = seasonScore?.raceScores ?? [];
  const totalPoints = seasonScore?.totalPoints ?? 0;

  return (
    <>
      <PageBackground page="predictions" />
      <PageTransition>
        <div className="space-y-6">
          {/* Header — broadcast style */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-f1-red rounded-full shadow-[0_0_12px_rgba(225,6,0,0.4)]" />
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="text-f1-red">PREDICTIONS</span> HUB
              </h1>
              <p className="text-f1-muted text-sm mt-1 font-medium tracking-wide uppercase">
                {currentPlayer?.name
                  ? `${currentPlayer.name}'s Dashboard`
                  : "Family Prediction Game"}
              </p>
            </div>
            <PlayerSwitcher onPlayerChange={handlePlayerChange} compact />
          </div>
          <div className="broadcast-divider" />

          {/* How it works — top of page so everyone understands */}
          <HowItWorks />

          {/* Quick actions — upcoming races to predict */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-f1-muted font-bold mb-3">
              Upcoming Races — Make Your Picks
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {upcomingRaces.map((race) => {
                const hasPrediction = predictedRounds.has(race.round);
                const flag = getCountryFlag(race.country);
                return (
                  <motion.div
                    key={race.round}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: race.round * 0.03 }}
                  >
                    <Link
                      href={`/race/${race.round}`}
                      className={`group block rounded-xl glass-card border p-3 transition-all hover:-translate-y-1 ${
                        hasPrediction
                          ? "border-green-500/30"
                          : "border-f1-red/30 hover:border-f1-red/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{flag}</span>
                        <span className="text-[10px] font-bold text-f1-muted uppercase tracking-widest">
                          R{race.round}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate group-hover:text-f1-red transition-colors">
                        {race.raceName.replace(" Grand Prix", " GP")}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        {hasPrediction ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-[10px] text-green-400 font-medium">
                              Locked In
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-f1-red animate-pulse" />
                            <span className="text-[10px] text-f1-red font-medium">
                              Predict Now
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Family Leaderboard + Quick Link */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FamilyLeaderboard
                entries={miniLeaderboard}
                currentPlayerId={currentPlayer?.id}
              />
            </div>
            <LeaderboardLinkCard />
          </div>

          {/* Score & accuracy section */}
          {predictions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <SeasonScoreCard
                    totalPoints={totalPoints}
                    raceScores={raceScores}
                  />
                </div>
                <div className="md:col-span-2">
                  <AccuracyStats raceScores={raceScores} />
                </div>
              </div>

              <ScoreGraph raceScores={raceScores} calendar={CALENDAR_2026} />

              <RaceBreakdown
                predictions={predictions}
                raceScores={raceScores}
                calendar={CALENDAR_2026}
                resultsByRound={resultsByRound}
              />

              {predictions.length > raceScores.length && (
                <div className="rounded-xl glass-card border border-f1-border p-4">
                  <p className="text-f1-muted text-sm">
                    &#x23F3;{" "}
                    {predictions.length - raceScores.length} prediction
                    {predictions.length - raceScores.length !== 1 ? "s" : ""}{" "}
                    awaiting race results.
                  </p>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-xl glass-card border border-f1-border overflow-hidden p-8 text-center"
            >
              <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
              <div className="relative">
                <span className="text-4xl mb-3 block">&#x1F3CE;&#xFE0F;</span>
                <p className="text-white text-lg font-bold mb-2">
                  No Predictions Yet
                </p>
                <p className="text-f1-muted text-sm max-w-md mx-auto">
                  Click on any upcoming race above to make{" "}
                  {currentPlayer?.name
                    ? `${currentPlayer.name}'s`
                    : "your"}{" "}
                  P1/P2/P3 podium predictions. Scores, accuracy stats, and
                  performance graphs will appear here once you start predicting.
                </p>
                <Link
                  href={`/race/${upcomingRaces[0]?.round ?? 1}`}
                  className="inline-block mt-4 px-6 py-2.5 bg-f1-red hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Make Your First Prediction
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </PageTransition>
    </>
  );
}

// =============================================================================
// Family Leaderboard — full version with all players
// =============================================================================

function FamilyLeaderboard({
  entries,
  currentPlayerId,
}: {
  entries: MiniLeaderEntry[];
  currentPlayerId?: string;
}) {
  const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative glass-card rounded-xl p-5 overflow-hidden"
    >
      <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
      <div className="relative">
        <h2 className="text-xs uppercase tracking-widest text-f1-muted font-bold mb-4">
          &#x1F3C6; Family Standings
        </h2>
        {entries.length === 0 ? (
          <p className="text-f1-muted text-sm">No players yet</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, idx) => {
              const isCurrentPlayer = entry.player.id === currentPlayerId;
              return (
                <div
                  key={entry.player.id}
                  className={`flex items-center gap-3 rounded-lg p-3 border transition-all ${
                    isCurrentPlayer
                      ? "bg-f1-red/5 border-f1-red/30"
                      : "bg-f1-dark/50 border-f1-border/50"
                  }`}
                >
                  <span className="text-lg w-7 text-center">
                    {medals[idx] ?? (
                      <span className="text-sm font-orbitron text-f1-muted">
                        {idx + 1}
                      </span>
                    )}
                  </span>
                  <span className="text-xl">{entry.player.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-bold truncate block ${
                        isCurrentPlayer ? "text-white" : "text-white/80"
                      }`}
                    >
                      {entry.player.name}
                      {isCurrentPlayer && (
                        <span className="text-[10px] text-f1-red ml-2 font-medium">
                          (You)
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-f1-muted">
                      {entry.predictionCount} prediction
                      {entry.predictionCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-orbitron text-f1-red">
                      {entry.totalPoints}
                    </span>
                    <span className="text-[10px] text-f1-muted ml-1">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
      className="flex flex-col gap-3"
    >
      <Link
        href="/predictions/leaderboard"
        className="flex-1 block glass-card rounded-xl p-5 border border-f1-border hover:border-f1-red/40 transition-all group"
      >
        <div className="flex items-center gap-3 h-full">
          <span className="text-3xl">{"\u{1F3C6}"}</span>
          <div className="flex-1">
            <h2 className="text-sm font-bold group-hover:text-f1-red transition-colors">
              Full Leaderboard
            </h2>
            <p className="text-xs text-f1-muted mt-1">
              Podium view &amp; head-to-head
            </p>
          </div>
          <svg
            className="w-5 h-5 text-f1-muted group-hover:text-f1-red transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
      <Link
        href="/calendar"
        className="flex-1 block glass-card rounded-xl p-5 border border-f1-border hover:border-f1-red/40 transition-all group"
      >
        <div className="flex items-center gap-3 h-full">
          <span className="text-3xl">&#x1F4C5;</span>
          <div className="flex-1">
            <h2 className="text-sm font-bold group-hover:text-f1-red transition-colors">
              Race Calendar
            </h2>
            <p className="text-xs text-f1-muted mt-1">
              See all 24 races &amp; predict
            </p>
          </div>
          <svg
            className="w-5 h-5 text-f1-muted group-hover:text-f1-red transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

// =============================================================================
// How It Works explainer
// =============================================================================

function HowItWorks() {
  const steps = [
    {
      icon: "&#x1F3CE;&#xFE0F;",
      title: "Pick Your Podium",
      desc: "Choose P1, P2, P3 for each race before qualifying starts.",
    },
    {
      icon: "&#x1F512;",
      title: "Predictions Lock",
      desc: "Once saved, predictions are locked in. No changes allowed!",
    },
    {
      icon: "&#x2705;",
      title: "Earn Points",
      desc: "Exact position = 25pts. On podium = 10pts. Top 5 = 5pts.",
    },
    {
      icon: "&#x1F3C6;",
      title: "Win the Season",
      desc: "Highest total points across all races wins bragging rights.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative rounded-xl glass-card border border-f1-border overflow-hidden p-5"
    >
      <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
      <div className="relative">
        <h2 className="text-xs uppercase tracking-widest text-f1-muted font-bold mb-4">
          How Scoring Works
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <span
                className="text-2xl block mb-2"
                dangerouslySetInnerHTML={{ __html: step.icon }}
              />
              <p className="text-sm font-bold text-white mb-1">{step.title}</p>
              <p className="text-[11px] text-f1-muted leading-tight">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
