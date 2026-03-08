'use client';

import { useState } from 'react';
import type { DriverStanding } from '@/lib/api/types';
import { TEAMS } from '@/lib/constants/teams';
import { motion } from 'framer-motion';
import TeamLogo from '@/components/ui/TeamLogo';
import { getDriverProfileImageUrl, getDriverCountryFlag } from '@/lib/utils/drivers';

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

const MEDAL_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

interface DriverStandingsProps {
  standings: DriverStanding[];
  onDriverClick?: (driverId: string) => void;
  onTeamClick?: (teamId: string) => void;
}

export default function DriverStandings({ standings, onDriverClick, onTeamClick }: DriverStandingsProps) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

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
    <div className="space-y-2">
      {standings.map((entry, i) => {
        const pos = parseInt(entry.position, 10);
        const constructorId = entry.Constructors?.[0]?.constructorId ?? '';
        const constructorName = entry.Constructors?.[0]?.name ?? 'Unknown';
        const teamColor = getTeamColor(constructorId);
        const teamKey = getTeamKey(constructorId);
        const medalColor = MEDAL_COLORS[pos];
        const barWidth = ((parseFloat(entry.points) || 0) / maxPoints) * 100;
        const flag = getDriverCountryFlag(entry.Driver.nationality);
        const imageUrl = getDriverProfileImageUrl(
          entry.Driver.driverId,
          teamKey,
          entry.Driver.givenName,
          entry.Driver.familyName,
        );
        const hasImgError = imgErrors[entry.Driver.driverId];

        return (
          <motion.div
            key={entry.Driver.driverId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="group relative rounded-xl border border-f1-border/50 overflow-hidden hover:border-f1-border transition-all"
            style={{
              background: `linear-gradient(90deg, ${teamColor}08 0%, transparent 50%)`,
            }}
          >
            {/* Team color accent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ backgroundColor: teamColor }}
            />

            <div className="flex items-center gap-3 md:gap-4 py-3 px-4 pl-5">
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

              {/* Driver photo */}
              <div
                className="hidden sm:block flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${teamColor}30, transparent)`,
                }}
              >
                {!hasImgError ? (
                  <img
                    src={imageUrl}
                    alt={`${entry.Driver.givenName} ${entry.Driver.familyName}`}
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgErrors(prev => ({ ...prev, [entry.Driver.driverId]: true }))}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: teamColor }}
                  >
                    {entry.Driver.givenName.charAt(0)}{entry.Driver.familyName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Driver info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDriverClick?.(entry.Driver.driverId)}
                    className="text-left hover:underline decoration-1 underline-offset-2 transition-colors"
                    style={{ textDecorationColor: teamColor }}
                  >
                    <span className="text-sm md:text-base text-white font-medium">
                      {entry.Driver.givenName}{' '}
                      <span className="font-bold" style={{ color: teamColor }}>
                        {entry.Driver.familyName}
                      </span>
                    </span>
                  </button>
                  {entry.Driver.code && (
                    <span
                      className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{
                        backgroundColor: `${teamColor}15`,
                        color: teamColor,
                      }}
                    >
                      {entry.Driver.code}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm">{flag}</span>
                  <button
                    onClick={() => onTeamClick?.(teamKey)}
                    className="flex items-center gap-1.5 hover:underline decoration-1 underline-offset-2 transition-colors group/team"
                  >
                    <TeamLogo teamId={constructorId} size={14} />
                    <span className="text-xs text-f1-muted group-hover/team:text-white transition-colors">
                      {constructorName}
                    </span>
                  </button>
                  {entry.Driver.permanentNumber && (
                    <span className="text-xs text-f1-muted/50 font-orbitron">
                      #{entry.Driver.permanentNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-xs text-f1-muted uppercase tracking-wider">Wins</p>
                  <p className="text-sm font-bold text-white font-orbitron">{entry.wins}</p>
                </div>
              </div>

              {/* Points with bar */}
              <div className="flex-shrink-0 w-24 md:w-32 relative text-right">
                <div
                  className="absolute inset-y-0 right-0 rounded-md transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: teamColor,
                    opacity: 0.12,
                  }}
                />
                <div className="relative z-10">
                  <span className="font-black text-lg md:text-xl text-white font-orbitron">
                    {entry.points}
                  </span>
                  <span className="text-[10px] text-f1-muted ml-1 uppercase">pts</span>
                </div>
                <div className="md:hidden text-[10px] text-f1-muted relative z-10">
                  {entry.wins} {parseInt(entry.wins, 10) === 1 ? 'win' : 'wins'}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
