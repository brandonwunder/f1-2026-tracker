import type { Team } from '@/types';
import type { CSSProperties } from 'react';

export const TEAMS: Record<string, Team> = {
  red_bull: { id: 'red_bull', name: 'Red Bull Racing', color: '#3671C6' },
  ferrari: { id: 'ferrari', name: 'Ferrari', color: '#E80020' },
  mercedes: { id: 'mercedes', name: 'Mercedes', color: '#27F4D2' },
  mclaren: { id: 'mclaren', name: 'McLaren', color: '#FF8000' },
  aston_martin: { id: 'aston_martin', name: 'Aston Martin', color: '#229971' },
  alpine: { id: 'alpine', name: 'Alpine', color: '#FF87BC' },
  williams: { id: 'williams', name: 'Williams', color: '#64C4FF' },
  racing_bulls: { id: 'racing_bulls', name: 'Racing Bulls', color: '#6692FF' },
  haas: { id: 'haas', name: 'Haas', color: '#B6BABD' },
  audi: { id: 'audi', name: 'Audi', color: '#C0C0C0' },
  cadillac: { id: 'cadillac', name: 'Cadillac', color: '#FFD700' },
};

export function getTeamStyle(teamId: string): CSSProperties {
  const team = TEAMS[teamId];
  if (!team) return {};
  return {
    borderColor: team.color,
    '--team-color': team.color,
  } as CSSProperties;
}

export function getTeamById(teamId: string): Team | undefined {
  return TEAMS[teamId];
}

export const TEAM_LIST = Object.values(TEAMS);
