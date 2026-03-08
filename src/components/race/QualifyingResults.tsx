"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { QualifyingResult } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";
import TeamLogo from "@/components/ui/TeamLogo";
import DriverProfileModal from "./DriverProfileModal";
import TeamProfileModal from "./TeamProfileModal";
import { getTeamIdFromConstructor } from "@/lib/utils/drivers";

interface QualifyingResultsProps {
  results: QualifyingResult[];
}

/** Map API constructor ID to our team constant keys */
function getTeamColor(constructorId: string): string {
  // Try direct match first
  const direct = TEAMS[constructorId];
  if (direct) return direct.color;

  // Common API ID mappings
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

export default function QualifyingResults({ results }: QualifyingResultsProps) {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (!results || results.length === 0) {
    return (
      <div className="rounded-xl glass-card border border-f1-border p-6">
        <h3 className="text-lg font-bold mb-2">Qualifying Results</h3>
        <p className="text-f1-muted text-sm">Qualifying results not yet available.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl glass-card border border-f1-border overflow-hidden">
      {/* Racing stripe top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />
      <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />

      <div className="relative p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-black uppercase tracking-wide">Qualifying Results</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          Complete
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-f1-muted text-xs uppercase tracking-wider border-b border-f1-border">
              <th className="text-left py-2 px-2 w-12">Pos</th>
              <th className="text-left py-2 px-2">Driver</th>
              <th className="text-left py-2 px-2">Team</th>
              <th className="text-right py-2 px-2">Q1</th>
              <th className="text-right py-2 px-2">Q2</th>
              <th className="text-right py-2 px-2">Q3</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {results.map((result) => {
              const pos = parseInt(result.position, 10);
              const isPole = pos === 1;
              const teamColor = getTeamColor(result.Constructor.constructorId);

              return (
                <motion.tr
                  key={result.position}
                  variants={rowVariants}
                  className={`border-b border-f1-border/50 hover:bg-f1-surface-hover transition-colors ${
                    isPole ? "bg-yellow-500/5" : ""
                  }`}
                >
                  <td className="py-2.5 px-2">
                    <span
                      className={`font-bold ${
                        isPole ? "text-yellow-400 glow-gold" : "text-f1-muted"
                      }`}
                    >
                      {result.position}
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
                        className="font-medium hover:underline hover:text-white/90 cursor-pointer text-left transition-colors"
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
                    {result.Q1 ?? "-"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-xs">
                    {result.Q2 ?? "-"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-xs">
                    <span className={isPole ? "text-yellow-400 font-bold" : ""}>
                      {result.Q3 ?? "-"}
                    </span>
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
        {results.map((result) => {
          const pos = parseInt(result.position, 10);
          const isPole = pos === 1;
          const teamColor = getTeamColor(result.Constructor.constructorId);

          return (
            <motion.div
              key={result.position}
              variants={rowVariants}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isPole
                  ? "border-yellow-500/30 bg-yellow-500/5 glow-gold"
                  : "border-f1-border/50 bg-f1-dark/50"
              }`}
              style={{ borderLeftColor: teamColor, borderLeftWidth: "3px" }}
            >
              <span
                className={`text-lg font-bold w-8 text-center shrink-0 ${
                  isPole ? "text-yellow-400" : "text-f1-muted"
                }`}
              >
                {result.position}
              </span>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setSelectedDriver(result.Driver.driverId)}
                  className="font-medium text-sm truncate hover:underline cursor-pointer text-left transition-colors"
                >
                  {result.Driver.givenName}{" "}
                  <span className="font-bold">{result.Driver.familyName}</span>
                </button>
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
                  {result.Q3 ?? result.Q2 ?? result.Q1 ?? "-"}
                </div>
                <div className="text-f1-muted text-xs">
                  {result.Q3 ? "Q3" : result.Q2 ? "Q2" : "Q1"}
                </div>
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
    </div>
  );
}
