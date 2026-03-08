"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DRIVERS_2026, type PredictionDriver } from "@/lib/data/drivers-fallback";
import { TEAMS } from "@/lib/constants/teams";
import {
  savePrediction,
  getPrediction,
  lockPrediction,
  getCurrentPlayer,
  type Prediction,
  type Player,
} from "@/lib/predictions/store";
import PlayerSwitcher from "@/components/predictions/PlayerSwitcher";
import {
  scorePrediction,
  hasRaceResults,
} from "@/lib/predictions/scoring";
import type { PredictionScore } from "@/lib/predictions/store";
import type { RaceResult } from "@/lib/api/types";
import Toast, { useToast } from "@/components/ui/Toast";

// =============================================================================
// Rank title based on accumulated points
// =============================================================================

function getRankTitle(points: number): { title: string; color: string } {
  if (points >= 450) return { title: "World Champion", color: "text-yellow-300" };
  if (points >= 300) return { title: "Race Winner", color: "text-green-400" };
  if (points >= 150) return { title: "Podium Finisher", color: "text-blue-400" };
  if (points >= 50) return { title: "Points Scorer", color: "text-orange-400" };
  return { title: "Rookie", color: "text-f1-muted" };
}

function getAccumulatedPoints(): number {
  try {
    const stored = localStorage.getItem("f1-predictions");
    if (!stored) return 0;
    const predictions = JSON.parse(stored);
    if (!Array.isArray(predictions)) return 0;
    // Sum up points from scored predictions (those with a score field)
    return predictions.reduce((sum: number, p: { score?: number }) => sum + (p.score ?? 0), 0);
  } catch {
    return 0;
  }
}

// =============================================================================
// Props
// =============================================================================

interface PredictionPanelProps {
  round: number;
  qualifyingDateISO: string | null; // ISO 8601 string for qualifying start
  raceResults: RaceResult[] | null; // null if race hasn't happened yet
}

// =============================================================================
// Component
// =============================================================================

export default function PredictionPanel({
  round,
  qualifyingDateISO,
  raceResults,
}: PredictionPanelProps) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [saved, setSaved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [score, setScore] = useState<PredictionScore | null>(null);
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [currentPlayerName, setCurrentPlayerName] = useState("Your");
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const { toast, showToast, hideToast } = useToast();

  const resultsAvailable = hasRaceResults(raceResults);

  // Load current player name
  useEffect(() => {
    const player = getCurrentPlayer();
    if (player) setCurrentPlayerName(player.name + "'s");
  }, []);

  // Handle player switch — reload predictions for the new player
  const handlePlayerChange = (player: Player) => {
    setCurrentPlayerName(player.name + "'s");
    // Reload prediction for this round with new player
    const existing = getPrediction(round);
    if (existing) {
      setPrediction(existing);
      setP1(existing.p1);
      setP2(existing.p2);
      setP3(existing.p3);
      setLocked(existing.locked);
    } else {
      setPrediction(null);
      setP1("");
      setP2("");
      setP3("");
      setLocked(false);
    }
    setScore(null);
    setSaved(false);
    setAccumulatedPoints(getAccumulatedPoints());
  };

  // -------------------------------------------------------------------------
  // Load existing prediction from localStorage
  // -------------------------------------------------------------------------
  useEffect(() => {
    const existing = getPrediction(round);
    if (existing) {
      setPrediction(existing);
      setP1(existing.p1);
      setP2(existing.p2);
      setP3(existing.p3);
      setLocked(existing.locked);
    }
    setAccumulatedPoints(getAccumulatedPoints());
  }, [round]);

  // -------------------------------------------------------------------------
  // Auto-lock if qualifying has started
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!qualifyingDateISO) return;
    const qualifyingTime = new Date(qualifyingDateISO).getTime();
    const now = Date.now();

    if (now >= qualifyingTime) {
      // Qualifying has started -- lock any existing prediction
      const existing = getPrediction(round);
      if (existing && !existing.locked) {
        lockPrediction(round);
        setLocked(true);
        setPrediction({ ...existing, locked: true });
      } else {
        setLocked(true);
      }
    }
  }, [round, qualifyingDateISO]);

  // -------------------------------------------------------------------------
  // Score prediction once results are available
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (prediction && resultsAvailable && raceResults) {
      const scored = scorePrediction(prediction, raceResults);
      setScore(scored);

      // Trigger confetti for high scores
      if (scored.totalPoints >= 25) {
        setTimeout(() => {
          confetti({
            particleCount: scored.totalPoints >= 50 ? 150 : 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E10600', '#FFD700', '#FFFFFF'],
          });
        }, 500);
      } else if (scored.totalPoints >= 10) {
        // Sparkle effect for 10pts
        setTimeout(() => {
          confetti({
            particleCount: 30,
            spread: 40,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500'],
            gravity: 0.8,
            scalar: 0.8,
          });
        }, 500);
      }
    }
  }, [prediction, resultsAvailable, raceResults]);

  // -------------------------------------------------------------------------
  // Handle save
  // -------------------------------------------------------------------------
  const handleSave = useCallback(() => {
    if (!p1 || !p2 || !p3) return;
    savePrediction(round, p1, p2, p3);
    // Immediately lock after saving — predictions cannot be changed once submitted
    lockPrediction(round);
    const updated = getPrediction(round);
    setPrediction(updated);
    setLocked(true);
    setSaved(true);
    showToast("Prediction locked in! No take-backs!");
    setTimeout(() => setSaved(false), 2000);

    // Fire confetti from save button position
    if (saveButtonRef.current) {
      const rect = saveButtonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x, y },
        colors: ['#E10600', '#FFD700', '#FFFFFF'],
        startVelocity: 25,
        gravity: 0.8,
      });
    }
  }, [round, p1, p2, p3, showToast]);

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  /** Get drivers available for a slot (exclude drivers already picked in other slots) */
  const getAvailableDrivers = (
    currentSlot: string,
    otherSlots: string[]
  ): PredictionDriver[] => {
    return DRIVERS_2026.filter(
      (d) => d.driverId === currentSlot || !otherSlots.includes(d.driverId)
    );
  };

  /** Get team color for a driver */
  const getTeamColor = (driverId: string): string => {
    const driver = DRIVERS_2026.find((d) => d.driverId === driverId);
    if (!driver) return "#666";
    return TEAMS[driver.teamId]?.color ?? "#666";
  };

  /** Get driver name from ID */
  const getDriverName = (driverId: string): string => {
    const driver = DRIVERS_2026.find((d) => d.driverId === driverId);
    return driver?.name ?? driverId;
  };

  /** Get actual result driver name by position */
  const getActualDriverByPosition = (
    pos: number
  ): { name: string; driverId: string } | null => {
    if (!raceResults) return null;
    const result = raceResults.find((r) => parseInt(r.position, 10) === pos);
    if (!result) return null;
    return {
      name: `${result.Driver.givenName} ${result.Driver.familyName}`,
      driverId: result.Driver.driverId,
    };
  };

  /** Points badge color */
  const pointsColor = (pts: number): string => {
    if (pts === 25) return "text-green-400";
    if (pts === 10) return "text-yellow-400";
    if (pts === 5) return "text-blue-400";
    return "text-f1-muted";
  };

  /** Points label */
  const pointsLabel = (pts: number): string => {
    if (pts === 25) return "Exact";
    if (pts === 10) return "On podium";
    if (pts === 5) return "Top 5";
    return "Miss";
  };

  const rank = getRankTitle(accumulatedPoints);

  // =========================================================================
  // RENDER: Post-race scored state
  // =========================================================================

  if (prediction && resultsAvailable && score) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-card rounded-xl p-5"
      >
        <div className="mb-3">
          <PlayerSwitcher onPlayerChange={handlePlayerChange} compact />
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{currentPlayerName} Predictions</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-f1-muted uppercase tracking-wider">
              Total
            </span>
            <span className="text-2xl font-bold text-f1-red font-orbitron">
              {score.totalPoints}
              <span className="text-sm text-f1-muted font-normal ml-1">
                pts
              </span>
            </span>
          </div>
        </div>

        {/* Rank title */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-f1-muted uppercase tracking-wider">Rank:</span>
          <span className={`text-sm font-bold font-orbitron ${rank.color}`}>
            {rank.title}
          </span>
        </div>

        <div className="space-y-3">
          {(
            [
              { pos: 1, label: "P1", pick: prediction.p1, pts: score.p1Points },
              { pos: 2, label: "P2", pick: prediction.p2, pts: score.p2Points },
              { pos: 3, label: "P3", pick: prediction.p3, pts: score.p3Points },
            ] as const
          ).map(({ pos, label, pick, pts }) => {
            const actual = getActualDriverByPosition(pos);
            const isExact = pts === 25;
            return (
              <div
                key={pos}
                className={`rounded-lg border p-3 ${
                  isExact
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-f1-border bg-f1-dark"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-f1-muted font-medium uppercase tracking-wider">
                    {label}
                  </span>
                  <span
                    className={`text-xs font-bold ${pointsColor(pts)}`}
                  >
                    +{pts} {pointsLabel(pts)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-6 rounded-full"
                      style={{ backgroundColor: getTeamColor(pick) }}
                    />
                    <span className="text-sm font-medium">
                      {getDriverName(pick)}
                    </span>
                  </div>
                  {actual && (
                    <span className="text-xs text-f1-muted">
                      Actual: {actual.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Max possible indicator */}
        <div className="mt-4 pt-3 border-t border-f1-border">
          <div className="flex items-center justify-between text-xs text-f1-muted">
            <span>Max possible: 75 pts</span>
            <span>
              Accuracy:{" "}
              {Math.round((score.totalPoints / 75) * 100)}%
            </span>
          </div>
          {/* Visual bar */}
          <div className="mt-2 h-2 rounded-full bg-f1-dark overflow-hidden">
            <div
              className="h-full rounded-full bg-f1-red transition-all duration-500"
              style={{
                width: `${Math.round((score.totalPoints / 75) * 100)}%`,
              }}
            />
          </div>
        </div>

        <Toast message={toast.message} show={toast.show} onClose={hideToast} />
      </motion.div>
    );
  }

  // =========================================================================
  // RENDER: Locked state (no results yet)
  // =========================================================================

  if (locked && prediction) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-card rounded-xl p-5"
      >
        <div className="mb-3">
          <PlayerSwitcher onPlayerChange={handlePlayerChange} compact />
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{currentPlayerName} Predictions</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            Locked
          </span>
        </div>

        <p className="text-f1-muted text-xs mb-3">
          Predictions are locked once qualifying begins. Check back after the
          race for your score.
        </p>

        <div className="space-y-2">
          {(
            [
              { label: "P1", pick: prediction.p1 },
              { label: "P2", pick: prediction.p2 },
              { label: "P3", pick: prediction.p3 },
            ] as const
          ).map(({ label, pick }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg bg-f1-dark border border-f1-border p-3 opacity-70"
            >
              <span className="text-xs text-f1-muted font-medium w-6">
                {label}
              </span>
              <div
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: getTeamColor(pick) }}
              />
              <span className="text-sm">{getDriverName(pick)}</span>
            </div>
          ))}
        </div>

        <Toast message={toast.message} show={toast.show} onClose={hideToast} />
      </motion.div>
    );
  }

  // =========================================================================
  // RENDER: Locked but no prediction was made
  // =========================================================================

  if (locked && !prediction) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-card rounded-xl p-5"
      >
        <div className="mb-3">
          <PlayerSwitcher onPlayerChange={handlePlayerChange} compact />
        </div>
        <h3 className="text-lg font-bold mb-2">{currentPlayerName} Predictions</h3>
        <p className="text-f1-muted text-sm">
          Predictions are locked. No prediction was submitted for this race.
        </p>

        <Toast message={toast.message} show={toast.show} onClose={hideToast} />
      </motion.div>
    );
  }

  // =========================================================================
  // RENDER: Pre-race editable state
  // =========================================================================

  const canSave = p1 && p2 && p3 && p1 !== p2 && p1 !== p3 && p2 !== p3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card rounded-xl p-5"
    >
      <div className="mb-3">
        <PlayerSwitcher onPlayerChange={handlePlayerChange} compact />
      </div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold">{currentPlayerName} Predictions</h3>
        <span className={`text-xs font-bold font-orbitron ${rank.color}`}>
          {rank.title}
        </span>
      </div>
      <p className="text-f1-muted text-xs mb-4">
        Pick your podium before qualifying begins.
      </p>

      <div className="space-y-3">
        {(
          [
            {
              label: "P1 - Winner",
              value: p1,
              setter: setP1,
              others: [p2, p3],
            },
            {
              label: "P2 - Second",
              value: p2,
              setter: setP2,
              others: [p1, p3],
            },
            {
              label: "P3 - Third",
              value: p3,
              setter: setP3,
              others: [p1, p2],
            },
          ] as const
        ).map(({ label, value, setter, others }) => (
          <div key={label}>
            <label className="block text-xs text-f1-muted font-medium mb-1">
              {label}
            </label>
            <div className="relative">
              {value && (
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
                  style={{ backgroundColor: getTeamColor(value) }}
                />
              )}
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className={`w-full rounded-lg border border-f1-border bg-f1-dark text-white text-sm
                  py-2.5 pr-3 appearance-none cursor-pointer
                  focus:outline-none focus:ring-1 focus:ring-f1-red focus:border-f1-red
                  ${value ? "pl-7" : "pl-3"}`}
              >
                <option value="">Select a driver...</option>
                {getAvailableDrivers(value, others.filter(Boolean) as string[]).map(
                  (d) => (
                    <option key={d.driverId} value={d.driverId}>
                      {d.code} - {d.name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        ref={saveButtonRef}
        onClick={handleSave}
        disabled={!canSave}
        className={`mt-4 w-full py-2.5 rounded-lg text-sm font-bold transition-all
          ${
            canSave
              ? "bg-f1-red hover:bg-red-700 text-white cursor-pointer"
              : "bg-f1-border text-f1-muted cursor-not-allowed"
          }`}
      >
        {saved ? "Saved!" : prediction ? "Update Prediction" : "Save Prediction"}
      </button>

      {prediction && (
        <p className="text-f1-muted text-xs mt-2 text-center">
          Last saved:{" "}
          {new Date(prediction.timestamp).toLocaleString()}
        </p>
      )}

      <Toast message={toast.message} show={toast.show} onClose={hideToast} />
    </motion.div>
  );
}
