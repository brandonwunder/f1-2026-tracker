'use client';

import Link from "next/link";
import type { RaceWithResults } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";
import { getTeamIdFromConstructor } from "@/lib/utils/drivers";
import { motion } from "framer-motion";
import TeamLogo from "@/components/ui/TeamLogo";

function getTeamColor(constructorId: string): string {
  const teamId = getTeamIdFromConstructor(constructorId);
  return TEAMS[teamId]?.color ?? "#6B7280";
}

const PODIUM_LABELS = ["P1", "P2", "P3"] as const;
const PODIUM_COLORS = {
  P1: "#FFD700",
  P2: "#C0C0C0",
  P3: "#CD7F32",
} as const;

const PODIUM_GLOW_CLASSES = {
  P1: "glow-gold",
  P2: "glow-silver",
  P3: "glow-bronze",
} as const;

interface RecentResultProps {
  race: RaceWithResults;
}

export default function RecentResult({ race }: RecentResultProps) {
  const results = race.Results ?? [];
  const podium = results.filter(
    (r) => parseInt(r.position, 10) <= 3
  );

  if (podium.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
    >
      <Link
        href={`/race/${race.round}`}
        className="group block rounded-xl glass-card p-5 transition-all duration-200 hover:bg-f1-surface-hover"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-f1-muted uppercase tracking-wider">
            Last Race Result
          </h3>
          <span className="text-xs text-f1-muted group-hover:text-white transition-colors">
            Full results &rarr;
          </span>
        </div>

        <p className="text-white font-semibold mb-4">{race.raceName}</p>

        <div className="space-y-2.5">
          {podium.map((result, i) => {
            const label = PODIUM_LABELS[i];
            const constructorId = result.Constructor.constructorId;
            const teamColor = getTeamColor(constructorId);
            const glowClass = PODIUM_GLOW_CLASSES[label];

            return (
              <motion.div
                key={result.Driver.driverId}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
              >
                <span
                  className={`text-sm font-bold w-6 text-center rounded-md px-1 py-0.5 ${glowClass}`}
                  style={{ color: PODIUM_COLORS[label] }}
                >
                  {label}
                </span>
                <TeamLogo teamId={constructorId} size={18} />
                <span className="flex-1 text-sm text-white truncate">
                  {result.Driver.givenName}{" "}
                  <span className="font-bold">{result.Driver.familyName}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-f1-muted">
                  {result.Constructor.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Link>
    </motion.div>
  );
}
