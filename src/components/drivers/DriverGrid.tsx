'use client';

import { useState } from 'react';
import type { DriverStanding } from '@/lib/api/types';
import { sortDriverStandings, type SortOption } from '@/lib/utils/drivers';
import DriverCard from './DriverCard';

interface DriverGridProps {
  standings: DriverStanding[];
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'points', label: 'Points' },
  { value: 'wins', label: 'Wins' },
  { value: 'team', label: 'Team' },
  { value: 'name', label: 'Name' },
];

export default function DriverGrid({ standings }: DriverGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('points');

  const sorted = sortDriverStandings(standings, sortBy);

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-f1-muted uppercase tracking-wider font-medium">
          Sort by
        </span>
        <div className="flex gap-1 bg-f1-dark rounded-lg p-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                sortBy === option.value
                  ? 'bg-f1-red text-white'
                  : 'text-f1-muted hover:text-white hover:bg-f1-surface-hover'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-f1-muted ml-auto">
          {sorted.length} drivers
        </span>
      </div>

      {/* Driver Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((standing) => (
          <DriverCard
            key={standing.Driver.driverId}
            standing={standing}
          />
        ))}
      </div>
    </div>
  );
}
