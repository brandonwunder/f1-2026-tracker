'use client';

import { useState } from 'react';
import type { DriverStanding } from '@/lib/api/types';
import { TEAMS } from '@/lib/constants/teams';
import {
  getDriverImageUrl,
  getDriverInitials,
  getDriverCountryFlag,
  getTeamIdFromConstructor,
} from '@/lib/utils/drivers';

interface DriverCardProps {
  standing: DriverStanding;
}

export default function DriverCard({ standing }: DriverCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const driver = standing.Driver;
  const constructor = standing.Constructors[0];
  const teamId = constructor
    ? getTeamIdFromConstructor(constructor.constructorId)
    : '';
  const team = TEAMS[teamId];
  const teamColor = team?.color ?? '#666666';
  const teamName = constructor?.name ?? 'Unknown Team';

  const flag = getDriverCountryFlag(driver.nationality);
  const imageUrl = getDriverImageUrl(driver);
  const initials = getDriverInitials(driver);
  const driverNumber = driver.permanentNumber ?? driver.code ?? '--';
  const position = parseInt(standing.position);

  // Position badge styling
  const positionBadge =
    position === 1
      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
      : position === 2
        ? 'bg-gray-300/20 text-gray-300 border-gray-400/40'
        : position === 3
          ? 'bg-amber-700/20 text-amber-500 border-amber-600/40'
          : 'bg-f1-dark/60 text-f1-muted border-f1-border';

  return (
    <div
      className="relative rounded-xl bg-f1-surface border border-f1-border overflow-hidden cursor-pointer transition-all duration-200 hover:border-f1-muted/40 hover:shadow-lg hover:shadow-black/20"
      style={{ borderLeftWidth: '4px', borderLeftColor: teamColor }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Driver Headshot */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-f1-dark">
            {!imgError ? (
              <img
                src={imageUrl}
                alt={`${driver.givenName} ${driver.familyName}`}
                className="w-full h-full object-cover object-top"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                style={{ backgroundColor: teamColor }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Driver Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-f1-muted font-mono">
                #{driverNumber}
              </span>
              <span className="text-sm">{flag}</span>
            </div>
            <h3 className="text-white font-bold text-base leading-tight truncate">
              {driver.givenName}{' '}
              <span className="text-white/90">{driver.familyName}</span>
            </h3>
            <p
              className="text-xs font-medium mt-0.5 truncate"
              style={{ color: teamColor }}
            >
              {teamName}
            </p>
          </div>

          {/* Position Badge */}
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-sm ${positionBadge}`}
          >
            {standing.position}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-f1-border/50">
          <div className="text-center">
            <p className="text-xs text-f1-muted">PTS</p>
            <p className="text-sm font-bold text-white">{standing.points}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-f1-muted">WINS</p>
            <p className="text-sm font-bold text-white">{standing.wins}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-f1-muted">POS</p>
            <p className="text-sm font-bold text-white">P{standing.position}</p>
          </div>
          {/* Expand indicator */}
          <div className="ml-auto">
            <svg
              className={`w-4 h-4 text-f1-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Stats */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 pb-4 space-y-3">
          {/* Season Stats */}
          <div className="rounded-lg bg-f1-dark/50 p-3">
            <h4 className="text-xs font-semibold text-f1-muted uppercase tracking-wider mb-2">
              Season Stats
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <StatItem label="Points" value={standing.points} />
              <StatItem label="Wins" value={standing.wins} />
              <StatItem label="Championship" value={`P${standing.position}`} />
              <StatItem
                label="Team"
                value={teamName}
                small
              />
            </div>
          </div>

          {/* Career Info */}
          <div className="rounded-lg bg-f1-dark/50 p-3">
            <h4 className="text-xs font-semibold text-f1-muted uppercase tracking-wider mb-2">
              Career Info
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <StatItem
                label="Full Name"
                value={`${driver.givenName} ${driver.familyName}`}
                small
              />
              <StatItem
                label="Nationality"
                value={driver.nationality ?? 'Unknown'}
              />
              {driver.dateOfBirth && (
                <StatItem label="Born" value={driver.dateOfBirth} small />
              )}
              <StatItem label="Number" value={`#${driverNumber}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-f1-muted uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`font-semibold text-white ${small ? 'text-xs' : 'text-sm'} truncate`}
      >
        {value}
      </p>
    </div>
  );
}
