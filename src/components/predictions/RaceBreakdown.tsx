"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Prediction, PredictionScore } from "@/lib/predictions/store";
import type { CalendarRace, RaceResult } from "@/lib/api/types";
import { DRIVERS_2026 } from "@/lib/data/drivers-fallback";

interface RaceBreakdownProps {
  predictions: Prediction[];
  raceScores: PredictionScore[];
  calendar: CalendarRace[];
  resultsByRound: Record<number, RaceResult[]>;
}

/** Get driver display name from driverId */
function driverName(driverId: string): string {
  const d = DRIVERS_2026.find((dr) => dr.driverId === driverId);
  return d?.name ?? driverId;
}

/** Get actual result driver name by finishing position */
function actualDriverName(results: RaceResult[], pos: number): string {
  const r = results.find((res) => parseInt(res.position, 10) === pos);
  if (!r) return "---";
  return `${r.Driver.givenName} ${r.Driver.familyName}`;
}

/** Color class based on points */
function pointsColorClass(pts: number): string {
  if (pts === 25) return "text-green-400";
  if (pts === 10) return "text-yellow-400";
  if (pts === 5) return "text-orange-400";
  return "text-f1-muted";
}

/** Border color based on total score - more vivid */
function rowBorderClass(total: number): string {
  if (total >= 50) return "border-l-green-400";
  if (total >= 25) return "border-l-yellow-400";
  if (total > 0) return "border-l-orange-400";
  return "border-l-f1-border";
}

export default function RaceBreakdown({
  predictions,
  raceScores,
  calendar,
  resultsByRound,
}: RaceBreakdownProps) {
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const calendarMap = new Map(calendar.map((r) => [r.round, r]));
  const scoreMap = new Map(raceScores.map((rs) => [rs.round, rs]));

  // Only show predictions that have been scored (results available)
  const scoredPredictions = predictions.filter((p) => scoreMap.has(p.round));

  if (scoredPredictions.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-3 font-medium">
          Race-by-Race Breakdown
        </h2>
        <p className="text-f1-muted text-sm">
          No scored races yet. Your prediction results will appear here after races are complete.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-3 font-medium">
        Race-by-Race Breakdown
      </h2>
      <div className="space-y-2">
        {scoredPredictions.map((pred) => {
          const race = calendarMap.get(pred.round);
          const score = scoreMap.get(pred.round)!;
          const results = resultsByRound[pred.round] ?? [];
          const isExpanded = expandedRound === pred.round;

          return (
            <div
              key={pred.round}
              className={`glass-card rounded-xl border-l-4 ${rowBorderClass(
                score.totalPoints
              )} overflow-hidden`}
            >
              {/* Summary row */}
              <button
                onClick={() =>
                  setExpandedRound(isExpanded ? null : pred.round)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-f1-surface-hover transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-f1-muted font-mono w-8">
                    R{String(pred.round).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium">
                    {race?.raceName ?? `Round ${pred.round}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-f1-red">
                    {score.totalPoints}
                    <span className="text-xs text-f1-muted font-normal ml-1">
                      pts
                    </span>
                  </span>
                  <motion.svg
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-f1-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>
              </button>

              {/* Expanded details with AnimatePresence */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="border-t border-f1-border px-4 pb-4 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(
                          [
                            { label: "P1", pick: pred.p1, pts: score.p1Points, pos: 1 },
                            { label: "P2", pick: pred.p2, pts: score.p2Points, pos: 2 },
                            { label: "P3", pick: pred.p3, pts: score.p3Points, pos: 3 },
                          ] as const
                        ).map(({ label, pick, pts, pos }) => (
                          <div
                            key={label}
                            className="rounded-lg bg-f1-dark border border-f1-border p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-f1-muted font-medium">
                                {label}
                              </span>
                              <span
                                className={`text-xs font-bold ${pointsColorClass(pts)}`}
                              >
                                +{pts}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{driverName(pick)}</p>
                            <p className="text-xs text-f1-muted mt-1">
                              Actual: {actualDriverName(results, pos)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
