'use client';

import type { ConstructorStanding, DriverStanding } from '@/lib/api/types';
import { TEAMS } from '@/lib/constants/teams';
import { StaggeredList, StaggeredListItem } from '@/components/ui/MotionWrappers';

function getTeamColor(constructorId: string): string {
  const idMap: Record<string, string> = {
    red_bull: 'red_bull',
    ferrari: 'ferrari',
    mercedes: 'mercedes',
    mclaren: 'mclaren',
    aston_martin: 'aston_martin',
    alpine: 'alpine',
    williams: 'williams',
    rb: 'racing_bulls',
    racing_bulls: 'racing_bulls',
    alphatauri: 'racing_bulls',
    haas: 'haas',
    sauber: 'audi',
    kick_sauber: 'audi',
    audi: 'audi',
    cadillac: 'cadillac',
    andretti: 'cadillac',
  };

  const key = idMap[constructorId] ?? constructorId;
  return TEAMS[key]?.color ?? '#6B7280';
}

interface DriverContribution {
  name: string;
  points: string;
}

interface ConstructorStandingsProps {
  standings: ConstructorStanding[];
  driverStandings: DriverStanding[];
}

/**
 * Build a map of constructorId -> drivers with their points,
 * derived from the driver standings data.
 */
function buildDriverContributions(
  driverStandings: DriverStanding[]
): Record<string, DriverContribution[]> {
  const map: Record<string, DriverContribution[]> = {};

  for (const ds of driverStandings) {
    for (const c of ds.Constructors) {
      if (!map[c.constructorId]) {
        map[c.constructorId] = [];
      }
      map[c.constructorId].push({
        name: `${ds.Driver.givenName.charAt(0)}. ${ds.Driver.familyName}`,
        points: ds.points,
      });
    }
  }

  return map;
}

export default function ConstructorStandings({
  standings,
  driverStandings,
}: ConstructorStandingsProps) {
  if (standings.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <p className="text-f1-muted text-sm">
          Constructor standings data is not yet available for the current season.
        </p>
      </div>
    );
  }

  const driverContributions = buildDriverContributions(driverStandings);
  const maxPoints = Math.max(
    ...standings.map((e) => parseFloat(e.points) || 0),
    1
  );

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-f1-border glass-card">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-f1-surface border-b border-f1-border text-f1-muted text-xs uppercase tracking-wider">
              <th className="px-4 py-3 w-16">Pos</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Drivers</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>
          <StaggeredList className="">
            <tbody>
              {standings.map((entry) => {
                const constructorId = entry.Constructor.constructorId;
                const teamColor = getTeamColor(constructorId);
                const drivers = driverContributions[constructorId] ?? [];
                const barWidth = ((parseFloat(entry.points) || 0) / maxPoints) * 100;

                return (
                  <StaggeredListItem key={constructorId}>
                    <tr
                      className="border-b border-f1-border/50 hover:bg-f1-surface-hover transition-colors"
                      style={{
                        borderLeftWidth: '4px',
                        borderLeftColor: teamColor,
                        background: `linear-gradient(90deg, ${teamColor}0D 0%, transparent 60%)`,
                      }}
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-lg text-white font-orbitron">
                          {entry.position}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: teamColor }}
                          />
                          <span className="font-semibold text-white">
                            {entry.Constructor.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          {drivers.length > 0 ? (
                            drivers.map((d) => (
                              <span key={d.name} className="text-sm text-f1-muted">
                                {d.name}{' '}
                                <span className="text-xs text-f1-muted/70">({d.points} pts)</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-f1-muted">--</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right relative">
                        <div
                          className="absolute inset-y-0 right-0 rounded-r-md bar-grow"
                          style={{
                            '--bar-width': `${barWidth}%`,
                            backgroundColor: teamColor,
                            opacity: 0.15,
                          } as React.CSSProperties}
                        />
                        <span className="font-bold text-lg text-white font-orbitron relative z-10">
                          {entry.points}
                        </span>
                      </td>
                    </tr>
                  </StaggeredListItem>
                );
              })}
            </tbody>
          </StaggeredList>
        </table>
      </div>

      {/* Mobile card layout */}
      <StaggeredList className="md:hidden space-y-2">
        {standings.map((entry) => {
          const constructorId = entry.Constructor.constructorId;
          const teamColor = getTeamColor(constructorId);
          const drivers = driverContributions[constructorId] ?? [];
          const barWidth = ((parseFloat(entry.points) || 0) / maxPoints) * 100;

          return (
            <StaggeredListItem key={constructorId}>
              <div
                className="rounded-lg glass-card p-3 border border-f1-border/50"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: teamColor,
                  background: `linear-gradient(90deg, ${teamColor}0D 0%, transparent 60%)`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-lg w-8 text-center text-white font-orbitron">
                      {entry.position}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: teamColor }}
                      />
                      <span className="font-semibold text-white text-sm">
                        {entry.Constructor.name}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className="absolute inset-y-0 right-0 rounded-r-md bar-grow"
                      style={{
                        '--bar-width': `${barWidth}%`,
                        backgroundColor: teamColor,
                        opacity: 0.15,
                      } as React.CSSProperties}
                    />
                    <span className="font-bold text-lg text-white font-orbitron relative z-10">
                      {entry.points}
                    </span>
                  </div>
                </div>
                {drivers.length > 0 && (
                  <div className="ml-11 flex flex-col gap-0.5">
                    {drivers.map((d) => (
                      <span key={d.name} className="text-xs text-f1-muted">
                        {d.name} ({d.points} pts)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </StaggeredListItem>
          );
        })}
      </StaggeredList>
    </div>
  );
}
