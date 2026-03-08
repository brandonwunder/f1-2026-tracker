'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  2: 'linear-gradient(135deg, #E8E8E8, #A0A0A0)',
  3: 'linear-gradient(135deg, #CD7F32, #8B5E3C)',
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
  const imageUrl = getDriverImageUrl(driver, teamId);
  const initials = getDriverInitials(driver);
  const driverNumber = driver.permanentNumber ?? driver.code ?? '--';
  const position = parseInt(standing.position);

  const isTopThree = position <= 3;

  return (
    <TiltCard glowColor={teamColor} className="rounded-xl overflow-hidden">
      <motion.div
        layout
        className={`relative rounded-xl overflow-hidden cursor-pointer ${isTopThree ? 'holo-shimmer' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Team gradient background */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: `radial-gradient(ellipse at top right, ${teamColor}, transparent 70%)`,
          }}
        />

        {/* Card border — team color left, subtle elsewhere */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: `1px solid ${teamColor}25`,
            borderLeftWidth: '4px',
            borderLeftColor: teamColor,
          }}
        />

        {/* Carbon fiber texture */}
        <div className="absolute inset-0 carbon-fiber opacity-20 pointer-events-none" />

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start gap-3">
            {/* Driver Headshot */}
            <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden">
              {/* Team color halo */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${teamColor}50, ${teamColor}15)`,
                  boxShadow: `inset 0 0 20px ${teamColor}30`,
                }}
              />
              {!imgError ? (
                <img
                  src={imageUrl}
                  alt={`${driver.givenName} ${driver.familyName}`}
                  className="relative w-full h-full object-cover object-top"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className="relative w-full h-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ backgroundColor: teamColor }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Driver Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-orbitron font-bold"
                  style={{ color: teamColor }}
                >
                  #{driverNumber}
                </span>
                <span className="text-sm">{flag}</span>
              </div>
              <h3 className="text-white text-base leading-tight truncate">
                <span className="font-medium">{driver.givenName}</span>{' '}
                <span className="font-black">{driver.familyName}</span>
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <TeamLogo teamId={teamId} size={16} />
                <p
                  className="text-xs font-semibold truncate"
                  style={{ color: teamColor }}
                >
                  {teamName}
                </p>
              </div>
            </div>

            {/* Position Badge */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-black text-base font-orbitron ${positionGlowClass[position] ?? ''}`}
              style={{
                background: positionGradients[position] ?? `${teamColor}15`,
                color: isTopThree ? '#000' : teamColor,
                border: isTopThree ? 'none' : `1px solid ${teamColor}30`,
              }}
            >
              {standing.position}
            </div>
          </div>

          {/* Stats Row */}
          <div
            className="flex items-center gap-5 mt-3 pt-3"
            style={{ borderTop: `1px solid ${teamColor}15` }}
          >
            <StatPill label="PTS" value={standing.points} color={teamColor} highlight />
            <StatPill label="WINS" value={standing.wins} color={teamColor} />
            <StatPill label="POS" value={`P${standing.position}`} color={teamColor} />

            {/* Expand arrow */}
            <div className="ml-auto">
              <motion.svg
                className="w-4 h-4"
                style={{ color: teamColor }}
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

        {/* Expanded Section */}
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
              <div className="relative px-4 pb-4 space-y-3">
                {/* Season Stats */}
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: `${teamColor}08`, border: `1px solid ${teamColor}15` }}
                >
                  <h4
                    className="text-[10px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: teamColor }}
                  >
                    Season Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <StatItem label="Points" value={standing.points} />
                    <StatItem label="Wins" value={standing.wins} />
                    <StatItem label="Championship" value={`P${standing.position}`} />
                    <StatItem label="Team" value={teamName} small />
                  </div>
                </div>

                {/* Career Info */}
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: `${teamColor}08`, border: `1px solid ${teamColor}15` }}
                >
                  <h4
                    className="text-[10px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: teamColor }}
                  >
                    Driver Info
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <StatItem
                      label="Full Name"
                      value={`${driver.givenName} ${driver.familyName}`}
                      small
                    />
                    <StatItem label="Nationality" value={driver.nationality ?? 'Unknown'} />
                    {driver.dateOfBirth && (
                      <StatItem label="Born" value={driver.dateOfBirth} small />
                    )}
                    <StatItem label="Number" value={`#${driverNumber}`} />
                  </div>
                </div>

                {/* View Profile */}
                <Link
                  href={`/drivers/${driver.driverId}`}
                  className="block w-full text-center py-2.5 rounded-lg text-sm font-bold transition-all hover:brightness-110 uppercase tracking-wider"
                  style={{
                    backgroundColor: `${teamColor}20`,
                    color: teamColor,
                    border: `1px solid ${teamColor}30`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View Full Profile
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick profile link (collapsed) */}
        {!expanded && (
          <div className="relative px-4 pb-3">
            <Link
              href={`/drivers/${driver.driverId}`}
              className="block text-center text-xs font-semibold uppercase tracking-wider transition-colors hover:brightness-125"
              style={{ color: `${teamColor}90` }}
              onClick={(e) => e.stopPropagation()}
            >
              View Profile
            </Link>
          </div>
        )}
      </motion.div>
    </TiltCard>
  );
}

function StatPill({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-f1-muted uppercase tracking-widest font-medium">{label}</p>
      <p
        className={`font-orbitron font-bold ${highlight ? 'text-base' : 'text-sm'}`}
        style={highlight ? { color } : {}}
      >
        {value}
      </p>
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
