import type { QualifyingResult } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";

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

export default function QualifyingResults({ results }: QualifyingResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="rounded-xl bg-f1-surface border border-f1-border p-6">
        <h3 className="text-lg font-bold mb-2">Qualifying Results</h3>
        <p className="text-f1-muted text-sm">Qualifying results not yet available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-5">
      <h3 className="text-lg font-bold mb-4">Qualifying Results</h3>

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
          <tbody>
            {results.map((result) => {
              const pos = parseInt(result.position, 10);
              const isPole = pos === 1;
              const teamColor = getTeamColor(result.Constructor.constructorId);

              return (
                <tr
                  key={result.position}
                  className={`border-b border-f1-border/50 hover:bg-f1-surface-hover transition-colors ${
                    isPole ? "bg-yellow-500/5" : ""
                  }`}
                >
                  <td className="py-2.5 px-2">
                    <span
                      className={`font-bold ${
                        isPole ? "text-yellow-400" : "text-f1-muted"
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
                      <span className="font-medium">
                        {result.Driver.givenName}{" "}
                        <span className="font-bold">{result.Driver.familyName}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-f1-muted">
                    {result.Constructor.name}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {results.map((result) => {
          const pos = parseInt(result.position, 10);
          const isPole = pos === 1;
          const teamColor = getTeamColor(result.Constructor.constructorId);

          return (
            <div
              key={result.position}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isPole
                  ? "border-yellow-500/30 bg-yellow-500/5"
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
                <div className="font-medium text-sm truncate">
                  {result.Driver.givenName}{" "}
                  <span className="font-bold">{result.Driver.familyName}</span>
                </div>
                <div className="text-f1-muted text-xs truncate">
                  {result.Constructor.name}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-xs">
                  {result.Q3 ?? result.Q2 ?? result.Q1 ?? "-"}
                </div>
                <div className="text-f1-muted text-xs">
                  {result.Q3 ? "Q3" : result.Q2 ? "Q2" : "Q1"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
