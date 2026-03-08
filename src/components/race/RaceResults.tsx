"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { RaceResult } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";
import TeamLogo from "@/components/ui/TeamLogo";
import DriverProfileModal from "./DriverProfileModal";
import TeamProfileModal from "./TeamProfileModal";
import { getTeamIdFromConstructor } from "@/lib/utils/drivers";

interface RaceResultsProps {
  results: RaceResult[];
}

/** Map API constructor ID to our team constant keys */
function getTeamColor(constructorId: string): string {
  const direct = TEAMS[constructorId];
  if (direct) return direct.color;

  const mapping: Record<string, string> = {
    red_bull: "#3671C6",
    ferrari: "#E80020",
    mercedes: "#27F4D2",
    mclaren: "#FF8000",
    aston_martin: "#229971",
    alpine: "#FF87BC",
    williams: "#64C4FF",
    rb: "#6692FF",
    alphatauri: "#6692FF",
    racing_bulls: "#6692FF",
    haas: "#B6BABD",
    kick_sauber: "#C0C0C0",
    sauber: "#C0C0C0",
    audi: "#C0C0C0",
    cadillac: "#FFD700",
  };

  return mapping[constructorId] ?? "#8B8B9E";
}

function getPodiumStyle(position: number): string {
  switch (position) {
    case 1:
      return "text-yellow-400";
    case 2:
      return "text-gray-300";
    case 3:
      return "text-amber-600";
    default:
      return "text-f1-muted";
  }
}

function getPodiumGlow(position: number): string {
  switch (position) {
    case 1:
      return "glow-gold";
    case 2:
      return "glow-silver";
    case 3:
      return "glow-bronze";
    default:
      return "";
  }
}

function isDNF(status: string): boolean {
  const finishedStatuses = ["Finished", "+1 Lap", "+2 Laps", "+3 Laps", "+4 Laps", "+5 Laps"];
  return !finishedStatuses.includes(status);
}

function getStatusDisplay(result: RaceResult): string {
  if (result.status === "Finished") {
    return result.Time?.time ?? "Finished";
  }
  if (result.status.startsWith("+")) {
    return result.status;
  }
  // DNF - show the reason
  return result.status;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function RaceResults({ results }: RaceResultsProps) {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (!results || results.length === 0) {
    return (
      <div className="rounded-xl glass-card border border-yellow-500/30 p-6 bg-yellow-500/5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Race Results</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Not Started
          </span>
        </div>
        <p className="text-f1-muted text-sm">
          The race has not happened yet. Results will appear here after the race finishes.
        </p>
        <p className="text-yellow-400/80 text-xs mt-2 font-medium">
          Note: Qualifying results above show the starting grid order, NOT race results.
        </p>
      </div>
    );
  }

  // Separate finishers and DNFs
  const finishers = results.filter((r) => !isDNF(r.status));
  const dnfs = results.filter((r) => isDNF(r.status));
  const sorted = [...finishers, ...dnfs];

  return (
    <div className="rounded-xl glass-card border border-f1-border p-5">
      <h3 className="text-lg font-bold mb-4">Race Results</h3>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-f1-muted text-xs uppercase tracking-wider border-b border-f1-border">
              <th className="text-left py-2 px-2 w-12">Pos</th>
              <th className="text-left py-2 px-2">Driver</th>
              <th className="text-left py-2 px-2">Team</th>
              <th className="text-right py-2 px-2">Time / Gap</th>
              <th className="text-right py-2 px-2">Pts</th>
              <th className="text-center py-2 px-2 w-10">FL</th>
              <th className="text-left py-2 px-2">Status</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sorted.map((result) => {
              const pos = parseInt(result.position, 10);
              const teamColor = getTeamColor(result.Constructor.constructorId);
              const hasFastestLap = result.FastestLap?.rank === "1";
              const dnf = isDNF(result.status);
              const glowClass = getPodiumGlow(pos);

              return (
                <motion.tr
                  key={result.position}
                  variants={rowVariants}
                  className={`border-b border-f1-border/50 hover:bg-f1-surface-hover transition-colors ${
                    dnf ? "opacity-60" : ""
                  } ${pos <= 3 ? "bg-white/[0.02]" : ""}`}
                >
                  <td className="py-2.5 px-2">
                    <span className={`font-bold ${getPodiumStyle(pos)} ${glowClass}`}>
                      {result.positionText}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1 h-5 rounded-full shrink-0"
                        style={{ backgroundColor: teamColor }}
                      />
                      <button
                        onClick={() => setSelectedDriver(result.Driver.driverId)}
                        className={`font-medium hover:underline cursor-pointer text-left transition-colors ${dnf ? "line-through decoration-red-500/50" : ""}`}
                      >
                        {result.Driver.givenName}{" "}
                        <span className="font-bold">{result.Driver.familyName}</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-f1-muted">
                    <button
                      onClick={() => setSelectedTeam(getTeamIdFromConstructor(result.Constructor.constructorId))}
                      className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"
                    >
                      <TeamLogo teamId={result.Constructor.constructorId} size={20} />
                      <span className="hover:underline">{result.Constructor.name}</span>
                    </button>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-xs">
                    {pos === 1
                      ? result.Time?.time ?? "-"
                      : result.Time?.time
                      ? `+${result.Time.time}`
                      : dnf
                      ? "DNF"
                      : result.status}
                  </td>
                  <td className="py-2.5 px-2 text-right font-medium">
                    {parseInt(result.points, 10) > 0 ? result.points : "-"}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {hasFastestLap && (
                      <span
                        className="inline-block w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold leading-5 text-center animate-pulse"
                        title={`Fastest Lap: ${result.FastestLap?.Time?.time}`}
                      >
                        F
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-xs">
                    {dnf ? (
                      <span className="text-red-400">{result.status}</span>
                    ) : (
                      <span className="text-f1-muted">{getStatusDisplay(result)}</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <motion.div
        className="md:hidden space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sorted.map((result) => {
          const pos = parseInt(result.position, 10);
          const teamColor = getTeamColor(result.Constructor.constructorId);
          const hasFastestLap = result.FastestLap?.rank === "1";
          const dnf = isDNF(result.status);
          const glowClass = getPodiumGlow(pos);

          return (
            <motion.div
              key={result.position}
              variants={rowVariants}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                dnf
                  ? "border-red-500/20 bg-red-500/5 opacity-70"
                  : pos <= 3
                  ? "border-f1-border bg-white/[0.02]"
                  : "border-f1-border/50 bg-f1-dark/50"
              }`}
              style={{ borderLeftColor: dnf ? "#EF4444" : teamColor, borderLeftWidth: "3px" }}
            >
              <span
                className={`text-lg font-bold w-8 text-center shrink-0 ${
                  dnf ? "text-red-400" : getPodiumStyle(pos)
                } ${glowClass}`}
              >
                {result.positionText}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedDriver(result.Driver.driverId)}
                    className={`font-medium text-sm truncate hover:underline cursor-pointer text-left transition-colors ${dnf ? "line-through decoration-red-500/50" : ""}`}
                  >
                    {result.Driver.givenName}{" "}
                    <span className="font-bold">{result.Driver.familyName}</span>
                  </button>
                  {hasFastestLap && (
                    <span className="inline-block w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold leading-4 text-center shrink-0 animate-pulse">
                      F
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedTeam(getTeamIdFromConstructor(result.Constructor.constructorId)); }}
                  className="flex items-center gap-1 text-f1-muted text-xs truncate hover:text-white cursor-pointer transition-colors"
                >
                  <TeamLogo teamId={result.Constructor.constructorId} size={14} />
                  {result.Constructor.name}
                </button>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-xs">
                  {dnf ? (
                    <span className="text-red-400">DNF</span>
                  ) : pos === 1 ? (
                    result.Time?.time ?? "-"
                  ) : result.Time?.time ? (
                    `+${result.Time.time}`
                  ) : (
                    result.status
                  )}
                </div>
                {parseInt(result.points, 10) > 0 && (
                  <div className="text-f1-muted text-xs">{result.points} pts</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <DriverProfileModal
        driverId={selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />
      <TeamProfileModal
        teamId={selectedTeam}
        onClose={() => setSelectedTeam(null)}
      />
    </div>
  );
}
