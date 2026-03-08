'use client';

import { useState } from 'react';
import { TEAMS } from '@/lib/constants/teams';

/**
 * Map Jolpica/Ergast API constructorId values to our internal team IDs.
 * Centralised here so every consumer can just pass constructorId directly.
 */
const CONSTRUCTOR_ID_MAP: Record<string, string> = {
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

/**
 * Local team logo files in /public/logos/.
 * These are the user's own logo files, copied to public for static serving.
 */
const TEAM_LOGOS: Record<string, string> = {
  red_bull: '/logos/red_bull.png',
  ferrari: '/logos/ferrari.jpg',
  mercedes: '/logos/mercedes.png',
  mclaren: '/logos/mclaren.png',
  aston_martin: '/logos/aston_martin.jpg',
  alpine: '/logos/alpine.avif',
  williams: '/logos/williams.webp',
  racing_bulls: '/logos/racing_bulls.png',
  haas: '/logos/haas.jpg',
  audi: '/logos/audi.png',
  cadillac: '/logos/cadillac.webp',
};

export function resolveTeamId(constructorId: string): string {
  return CONSTRUCTOR_ID_MAP[constructorId] ?? constructorId;
}

interface TeamLogoProps {
  teamId: string;
  size?: number;
  className?: string;
  showFallback?: boolean;
}

export default function TeamLogo({
  teamId,
  size = 24,
  className = '',
  showFallback = true,
}: TeamLogoProps) {
  const resolvedId = resolveTeamId(teamId);
  const logoUrl = TEAM_LOGOS[resolvedId];
  const team = TEAMS[resolvedId];
  const teamColor = team?.color ?? '#666666';
  const teamName = team?.name ?? teamId;

  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    if (!showFallback) return null;

    return (
      <span
        className={`inline-flex items-center justify-center rounded-full text-white font-bold flex-shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.45,
          backgroundColor: teamColor,
        }}
        title={teamName}
      >
        {teamName.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${teamName} logo`}
      width={size}
      height={size}
      className={`object-contain flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
