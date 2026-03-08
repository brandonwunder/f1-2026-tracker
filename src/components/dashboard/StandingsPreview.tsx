import Link from "next/link";
import type { DriverStanding, ConstructorStanding } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";
import { getTeamIdFromConstructor } from "@/lib/utils/drivers";

function getTeamColor(constructorId: string): string {
  const teamId = getTeamIdFromConstructor(constructorId);
  return TEAMS[teamId]?.color ?? "#6B7280";
}

interface DriverPreviewProps {
  type: "drivers";
  standings: DriverStanding[];
}

interface ConstructorPreviewProps {
  type: "constructors";
  standings: ConstructorStanding[];
}

type StandingsPreviewProps = DriverPreviewProps | ConstructorPreviewProps;

export default function StandingsPreview(props: StandingsPreviewProps) {
  const { type } = props;
  const title = type === "drivers" ? "Driver Standings" : "Constructor Standings";
  const top5 =
    type === "drivers"
      ? (props as DriverPreviewProps).standings.slice(0, 5)
      : (props as ConstructorPreviewProps).standings.slice(0, 5);

  if (top5.length === 0) {
    return (
      <div className="rounded-xl bg-f1-surface border border-f1-border p-5">
        <h3 className="text-sm font-semibold text-f1-muted uppercase tracking-wider mb-3">
          {title}
        </h3>
        <p className="text-f1-muted text-sm">
          Standings data will appear once the season begins.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-5">
      <h3 className="text-sm font-semibold text-f1-muted uppercase tracking-wider mb-4">
        {title}
      </h3>

      <div className="space-y-2.5">
        {type === "drivers"
          ? (top5 as DriverStanding[]).map((entry) => {
              const constructorId =
                entry.Constructors?.[0]?.constructorId ?? "";
              const teamColor = getTeamColor(constructorId);
              return (
                <div
                  key={entry.Driver.driverId}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-bold text-f1-muted w-5 text-right tabular-nums">
                    {entry.position}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: teamColor }}
                  />
                  <span className="flex-1 text-sm text-white truncate">
                    {entry.Driver.givenName}{" "}
                    <span className="font-bold">{entry.Driver.familyName}</span>
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {entry.points}
                  </span>
                </div>
              );
            })
          : (top5 as ConstructorStanding[]).map((entry) => {
              const constructorId = entry.Constructor.constructorId;
              const teamColor = getTeamColor(constructorId);
              return (
                <div
                  key={constructorId}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-bold text-f1-muted w-5 text-right tabular-nums">
                    {entry.position}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: teamColor }}
                  />
                  <span className="flex-1 text-sm text-white truncate">
                    {entry.Constructor.name}
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {entry.points}
                  </span>
                </div>
              );
            })}
      </div>

      <Link
        href="/standings"
        className="block mt-4 pt-3 border-t border-f1-border text-center text-xs font-medium text-f1-muted hover:text-f1-red transition-colors"
      >
        View full standings &rarr;
      </Link>
    </div>
  );
}
