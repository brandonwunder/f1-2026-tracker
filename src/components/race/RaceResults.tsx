import type { RaceResult } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";

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

export default function RaceResults({ results }: RaceResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="rounded-xl bg-f1-surface border border-f1-border p-6">
        <h3 className="text-lg font-bold mb-2">Race Results</h3>
        <p className="text-f1-muted text-sm">Race results not yet available.</p>
      </div>
    );
  }

  // Separate finishers and DNFs
  const finishers = results.filter((r) => !isDNF(r.status));
  const dnfs = results.filter((r) => isDNF(r.status));
  const sorted = [...finishers, ...dnfs];

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-5">
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
          <tbody>
            {sorted.map((result) => {
              const pos = parseInt(result.position, 10);
              const teamColor = getTeamColor(result.Constructor.constructorId);
              const hasFastestLap = result.FastestLap?.rank === "1";
              const dnf = isDNF(result.status);

              return (
                <tr
                  key={result.position}
                  className={`border-b border-f1-border/50 hover:bg-f1-surface-hover transition-colors ${
                    dnf ? "opacity-60" : ""
                  } ${pos <= 3 ? "bg-white/[0.02]" : ""}`}
                >
                  <td className="py-2.5 px-2">
                    <span className={`font-bold ${getPodiumStyle(pos)}`}>
                      {result.positionText}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1 h-5 rounded-full shrink-0"
                        style={{ backgroundColor: teamColor }}
                      />
                      <span className={`font-medium ${dnf ? "line-through decoration-red-500/50" : ""}`}>
                        {result.Driver.givenName}{" "}
                        <span className="font-bold">{result.Driver.familyName}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-f1-muted">
                    {result.Constructor.name}
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
                        className="inline-block w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold leading-5 text-center"
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {sorted.map((result) => {
          const pos = parseInt(result.position, 10);
          const teamColor = getTeamColor(result.Constructor.constructorId);
          const hasFastestLap = result.FastestLap?.rank === "1";
          const dnf = isDNF(result.status);

          return (
            <div
              key={result.position}
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
                }`}
              >
                {result.positionText}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-medium text-sm truncate ${dnf ? "line-through decoration-red-500/50" : ""}`}>
                    {result.Driver.givenName}{" "}
                    <span className="font-bold">{result.Driver.familyName}</span>
                  </span>
                  {hasFastestLap && (
                    <span className="inline-block w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold leading-4 text-center shrink-0">
                      F
                    </span>
                  )}
                </div>
                <div className="text-f1-muted text-xs truncate">
                  {result.Constructor.name}
                </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
