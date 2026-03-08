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
 * Real F1 team logos hosted on Wikimedia Commons (SVG).
 */
const TEAM_LOGOS: Record<string, string> = {
  red_bull:
    'https://upload.wikimedia.org/wikipedia/en/7/7a/Oracle_Red_Bull_Racing_logo.svg',
  ferrari:
    'https://upload.wikimedia.org/wikipedia/en/a/a2/Scuderia_Ferrari_Logo.svg',
  mercedes:
    'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg',
  mclaren:
    'https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg',
  aston_martin:
    'https://upload.wikimedia.org/wikipedia/en/1/1e/Aston_Martin_Aramco_F1_Team_logo.svg',
  alpine:
    'https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg',
  williams:
    'https://upload.wikimedia.org/wikipedia/en/f/f9/Williams_Racing_2020_logo.svg',
  racing_bulls:
    'https://upload.wikimedia.org/wikipedia/en/6/6e/Visa_Cash_App_Racing_Bulls_logo.svg',
  haas: 'https://upload.wikimedia.org/wikipedia/en/4/45/Haas_F1_Team_logo.svg',
  audi: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
  cadillac:
    'https://upload.wikimedia.org/wikipedia/commons/2/22/Cadillac_logo.svg',
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
