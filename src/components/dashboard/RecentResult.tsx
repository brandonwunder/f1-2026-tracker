import Link from "next/link";
import type { RaceWithResults } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";
import { getTeamIdFromConstructor } from "@/lib/utils/drivers";

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
    <Link
      href={`/race/${race.round}`}
      className="group block rounded-xl bg-f1-surface border border-f1-border p-5 transition-all duration-200 hover:bg-f1-surface-hover"
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

          return (
            <div key={result.Driver.driverId} className="flex items-center gap-3">
              <span
                className="text-sm font-bold w-6 text-center"
                style={{ color: PODIUM_COLORS[label] }}
              >
                {label}
              </span>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: teamColor }}
              />
              <span className="flex-1 text-sm text-white truncate">
                {result.Driver.givenName}{" "}
                <span className="font-bold">{result.Driver.familyName}</span>
              </span>
              <span className="text-xs text-f1-muted">
                {result.Constructor.name}
              </span>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
