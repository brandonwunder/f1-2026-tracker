'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DriverStanding } from '@/lib/api/types';
import { TEAMS } from '@/lib/constants/teams';
import {
  getDriverImageUrl,
  getDriverInitials,
  getDriverCountryFlag,
  getTeamIdFromConstructor,
} from '@/lib/utils/drivers';
import { TiltCard } from '@/components/ui/MotionWrappers';
import TeamLogo from '@/components/ui/TeamLogo';

interface DriverCardProps {
  standing: DriverStanding;
}

const positionGradients: Record<number, string> = {
  1: 'linear-gradient(135deg, #FFD700, #FFA500)',
  2: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
  3: 'linear-gradient(135deg, #CD7F32, #8B4513)',
};

const positionGlowClass: Record<number, string> = {
  1: 'glow-gold',
  2: 'glow-silver',
  3: 'glow-bronze',
};

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

  const isTopThree = position <= 3;

  return (
    <TiltCard glowColor={teamColor} className="rounded-xl overflow-hidden">
      <motion.div
        layout
        className={`relative rounded-xl glass-card overflow-hidden cursor-pointer ${isTopThree ? 'holo-shimmer' : ''}`}
        style={{ borderLeftWidth: '4px', borderLeftColor: teamColor }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Card Header */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Driver Headshot with team color gradient background */}
            <div
              className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${teamColor}40, transparent)`,
              }}
            >
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
                <span className="text-xs text-f1-muted font-orbitron">
                  #{driverNumber}
                </span>
                <span className="text-sm">{flag}</span>
              </div>
              <h3 className="text-white font-bold text-base leading-tight truncate">
                {driver.givenName}{' '}
                <span className="text-white/90">{driver.familyName}</span>
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <TeamLogo teamId={teamId} size={16} />
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: teamColor }}
                >
                  {teamName}
                </p>
              </div>
            </div>

            {/* Position Badge */}
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${positionGlowClass[position] ?? ''}`}
              style={{
                background: positionGradients[position] ?? 'rgba(15, 15, 25, 0.6)',
                color: isTopThree ? '#000' : 'var(--f1-muted)',
                border: isTopThree ? 'none' : '1px solid var(--f1-border)',
              }}
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
              <motion.svg
                className="w-4 h-4 text-f1-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </div>
          </div>
        </div>

        {/* Expanded Stats */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TiltCard>
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
