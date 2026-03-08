'use client';

import type { DriverStanding } from '@/lib/api/types';
import { TEAMS } from '@/lib/constants/teams';
import { StaggeredList, StaggeredListItem } from '@/components/ui/MotionWrappers';
import TeamLogo from '@/components/ui/TeamLogo';

function getTeamColor(constructorId: string): string {
  // Map Jolpica constructorId to our TEAMS keys
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

const MEDAL_COLORS: Record<number, string> = {
  1: '#FFD700', // Gold
  2: '#C0C0C0', // Silver
  3: '#CD7F32', // Bronze
};

const MEDAL_GLOW: Record<number, string> = {
  1: 'glow-gold',
  2: 'glow-silver',
  3: 'glow-bronze',
};

interface DriverStandingsProps {
  standings: DriverStanding[];
}

export default function DriverStandings({ standings }: DriverStandingsProps) {
  if (standings.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <p className="text-f1-muted text-sm">
          Driver standings data is not yet available for the current season.
        </p>
      </div>
    );
  }

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
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-right">Wins</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>
          <StaggeredList className="" >
            <tbody>
              {standings.map((entry) => {
                const pos = parseInt(entry.position, 10);
                const constructorId = entry.Constructors?.[0]?.constructorId ?? '';
                const constructorName = entry.Constructors?.[0]?.name ?? 'Unknown';
                const teamColor = getTeamColor(constructorId);
                const medalColor = MEDAL_COLORS[pos];
                const glowClass = MEDAL_GLOW[pos];
                const barWidth = ((parseFloat(entry.points) || 0) / maxPoints) * 100;

                return (
                  <StaggeredListItem key={entry.Driver.driverId}>
                    <tr
                      className="border-b border-f1-border/50 hover:bg-f1-surface-hover transition-colors"
                      style={{ borderLeftWidth: '4px', borderLeftColor: teamColor }}
                    >
                      <td className="px-4 py-3">
                        {glowClass ? (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg font-orbitron ${glowClass}`}
                            style={{ color: medalColor }}
                          >
                            {entry.position}
                          </span>
                        ) : (
                          <span className="font-bold text-lg font-orbitron text-white">
                            {entry.position}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-white">
                            {entry.Driver.givenName}{' '}
                            <span className="font-bold">{entry.Driver.familyName}</span>
                          </span>
                          {entry.Driver.code && (
                            <span className="ml-2 text-xs text-f1-muted">
                              {entry.Driver.code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TeamLogo teamId={constructorId} size={22} />
                          <span className="text-f1-muted text-sm">{constructorName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-f1-muted">
                        {entry.wins}
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
          const pos = parseInt(entry.position, 10);
          const constructorId = entry.Constructors?.[0]?.constructorId ?? '';
          const constructorName = entry.Constructors?.[0]?.name ?? 'Unknown';
          const teamColor = getTeamColor(constructorId);
          const medalColor = MEDAL_COLORS[pos];
          const glowClass = MEDAL_GLOW[pos];
          const barWidth = ((parseFloat(entry.points) || 0) / maxPoints) * 100;

          return (
            <StaggeredListItem key={entry.Driver.driverId}>
              <div
                className="rounded-lg glass-card p-3 border border-f1-border/50"
                style={{ borderLeftWidth: '4px', borderLeftColor: teamColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {glowClass ? (
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg font-orbitron ${glowClass}`}
                        style={{ color: medalColor }}
                      >
                        {entry.position}
                      </span>
                    ) : (
                      <span className="font-bold text-lg w-8 text-center font-orbitron text-white">
                        {entry.position}
                      </span>
                    )}
                    <div>
                      <div className="font-medium text-white text-sm">
                        {entry.Driver.givenName}{' '}
                        <span className="font-bold">{entry.Driver.familyName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <TeamLogo teamId={constructorId} size={16} />
                        <span className="text-f1-muted text-xs">{constructorName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right relative">
                    <div
                      className="absolute inset-y-0 right-0 rounded-r-md bar-grow"
                      style={{
                        '--bar-width': `${barWidth}%`,
                        backgroundColor: teamColor,
                        opacity: 0.15,
                      } as React.CSSProperties}
                    />
                    <div className="font-bold text-lg text-white font-orbitron relative z-10">
                      {entry.points}
                    </div>
                    <div className="text-xs text-f1-muted">
                      {entry.wins} {parseInt(entry.wins, 10) === 1 ? 'win' : 'wins'}
                    </div>
                  </div>
                </div>
              </div>
            </StaggeredListItem>
          );
        })}
      </StaggeredList>
    </div>
  );
}
