'use client';

import { useState } from 'react';
import type { ConstructorStanding, DriverStanding } from '@/lib/api/types';
import { TEAMS } from '@/lib/constants/teams';
import { motion } from 'framer-motion';
import TeamLogo from '@/components/ui/TeamLogo';
import { getDriverProfileImageUrl } from '@/lib/utils/drivers';

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

function getTeamKey(constructorId: string): string {
  const idMap: Record<string, string> = {
    rb: 'racing_bulls',
    alphatauri: 'racing_bulls',
    sauber: 'audi',
    kick_sauber: 'audi',
    andretti: 'cadillac',
  };
  return idMap[constructorId] ?? constructorId;
}

interface DriverContribution {
  driverId: string;
  givenName: string;
  familyName: string;
  code: string;
  points: string;
  teamId: string;
}

interface ConstructorStandingsProps {
  standings: ConstructorStanding[];
  driverStandings: DriverStanding[];
  onDriverClick?: (driverId: string) => void;
  onTeamClick?: (teamId: string) => void;
}

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
        driverId: ds.Driver.driverId,
        givenName: ds.Driver.givenName,
        familyName: ds.Driver.familyName,
        code: ds.Driver.code ?? '',
        points: ds.points,
        teamId: getTeamKey(c.constructorId),
      });
    }
  }
  return map;
}

const MEDAL_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export default function ConstructorStandings({
  standings,
  driverStandings,
  onDriverClick,
  onTeamClick,
}: ConstructorStandingsProps) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

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
      {standings.map((entry, i) => {
        const constructorId = entry.Constructor.constructorId;
        const teamColor = getTeamColor(constructorId);
        const teamKey = getTeamKey(constructorId);
        const pos = parseInt(entry.position, 10);
        const medalColor = MEDAL_COLORS[pos];
        const drivers = driverContributions[constructorId] ?? [];
        const barWidth = ((parseFloat(entry.points) || 0) / maxPoints) * 100;

        return (
          <motion.div
            key={constructorId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="relative rounded-xl border border-f1-border/50 overflow-hidden hover:border-f1-border transition-all"
            style={{
              background: `linear-gradient(90deg, ${teamColor}0A 0%, transparent 60%)`,
            }}
          >
            {/* Team color accent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ backgroundColor: teamColor }}
            />

            <div className="p-4 pl-6">
              {/* Header row: position, team, points */}
              <div className="flex items-center gap-4">
                {/* Position */}
                <div className="flex-shrink-0 w-10 text-center">
                  {medalColor ? (
                    <div
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full font-black text-lg font-orbitron"
                      style={{
                        color: medalColor,
                        background: `${medalColor}15`,
                        boxShadow: `0 0 12px ${medalColor}20`,
                      }}
                    >
                      {entry.position}
                    </div>
                  ) : (
                    <span className="font-bold text-lg font-orbitron text-f1-muted">
                      {entry.position}
                    </span>
                  )}
                </div>

                {/* Team logo + name */}
                <button
                  onClick={() => onTeamClick?.(teamKey)}
                  className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${teamColor}20, transparent)`,
                      border: `1px solid ${teamColor}25`,
                    }}
                  >
                    <TeamLogo teamId={constructorId} size={32} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-white truncate hover:underline decoration-1 underline-offset-2" style={{ textDecorationColor: teamColor }}>
                      {entry.Constructor.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-f1-muted">
                      <span>{entry.wins} {parseInt(entry.wins, 10) === 1 ? 'win' : 'wins'}</span>
                    </div>
                  </div>
                </button>

                {/* Points */}
                <div className="flex-shrink-0 w-28 md:w-36 relative text-right">
                  <div
                    className="absolute inset-y-0 right-0 rounded-md transition-all duration-700"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: teamColor,
                      opacity: 0.12,
                    }}
                  />
                  <div className="relative z-10">
                    <span className="font-black text-xl md:text-2xl text-white font-orbitron">
                      {entry.points}
                    </span>
                    <span className="text-[10px] text-f1-muted ml-1 uppercase">pts</span>
                  </div>
                </div>
              </div>

              {/* Driver contributions */}
              {drivers.length > 0 && (
                <div className="mt-3 ml-14 flex flex-wrap gap-2">
                  {drivers.map((d) => {
                    const imageUrl = getDriverProfileImageUrl(
                      d.driverId,
                      d.teamId,
                      d.givenName,
                      d.familyName,
                    );
                    const hasImgError = imgErrors[d.driverId];

                    return (
                      <button
                        key={d.driverId}
                        onClick={() => onDriverClick?.(d.driverId)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                        style={{
                          background: `${teamColor}08`,
                          border: `1px solid ${teamColor}15`,
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0"
                          style={{ background: `${teamColor}20` }}
                        >
                          {!hasImgError ? (
                            <img
                              src={imageUrl}
                              alt={`${d.givenName} ${d.familyName}`}
                              className="w-full h-full object-cover object-top"
                              onError={() => setImgErrors(prev => ({ ...prev, [d.driverId]: true }))}
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white"
                              style={{ backgroundColor: teamColor }}
                            >
                              {d.givenName.charAt(0)}{d.familyName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-white group-hover:underline decoration-1 underline-offset-2">
                          {d.givenName.charAt(0)}. <span className="font-bold">{d.familyName}</span>
                        </span>
                        <span className="text-xs font-orbitron" style={{ color: teamColor }}>
                          {d.points}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
