'use client';

import { useState, useEffect } from 'react';

interface RaceStatusBannerProps {
  raceDate: string;
  raceTime: string;
  hasQualifying: boolean;
  hasRaceResults: boolean;
}

type WeekendStatus = 'upcoming' | 'qualifying-done' | 'race-day' | 'completed' | 'past';

function getWeekendStatus(
  raceDate: string,
  raceTime: string,
  hasQualifying: boolean,
  hasRaceResults: boolean,
): WeekendStatus {
  if (hasRaceResults) return 'completed';

  const now = new Date();
  const raceStart = new Date(`${raceDate}T${raceTime}`);
  const raceEnd = new Date(raceStart.getTime() + 3 * 60 * 60 * 1000); // +3h buffer

  if (now > raceEnd && !hasRaceResults) return 'past';
  if (now >= raceStart) return 'race-day';
  if (hasQualifying) return 'qualifying-done';
  return 'upcoming';
}

const STATUS_CONFIG: Record<WeekendStatus, {
  label: string;
  description: string;
  bgClass: string;
  dotClass: string;
  icon: string;
}> = {
  upcoming: {
    label: 'UPCOMING',
    description: 'Race weekend has not started yet',
    bgClass: 'bg-blue-500/10 border-blue-500/30',
    dotClass: 'bg-blue-500',
    icon: '\u{1F4C5}',
  },
  'qualifying-done': {
    label: 'QUALIFYING COMPLETE',
    description: 'Qualifying has finished — grid is set! Race has not started yet.',
    bgClass: 'bg-yellow-500/10 border-yellow-500/30',
    dotClass: 'bg-yellow-500 animate-pulse',
    icon: '\u{1F3C1}',
  },
  'race-day': {
    label: 'RACE DAY',
    description: 'The race is happening now or about to start!',
    bgClass: 'bg-f1-red/10 border-f1-red/30',
    dotClass: 'bg-f1-red animate-pulse',
    icon: '\u{1F3CE}\u{FE0F}',
  },
  completed: {
    label: 'RACE COMPLETE',
    description: 'The race has finished. Final results are in.',
    bgClass: 'bg-green-500/10 border-green-500/30',
    dotClass: 'bg-green-500',
    icon: '\u2705',
  },
  past: {
    label: 'AWAITING RESULTS',
    description: 'The race should be finished. Results will appear shortly.',
    bgClass: 'bg-orange-500/10 border-orange-500/30',
    dotClass: 'bg-orange-500 animate-pulse',
    icon: '\u23F3',
  },
};

export default function RaceStatusBanner({
  raceDate,
  raceTime,
  hasQualifying,
  hasRaceResults,
}: RaceStatusBannerProps) {
  const [status, setStatus] = useState<WeekendStatus>('upcoming');

  useEffect(() => {
    setStatus(getWeekendStatus(raceDate, raceTime, hasQualifying, hasRaceResults));

    // Re-check every minute for live updates
    const interval = setInterval(() => {
      setStatus(getWeekendStatus(raceDate, raceTime, hasQualifying, hasRaceResults));
    }, 60_000);

    return () => clearInterval(interval);
  }, [raceDate, raceTime, hasQualifying, hasRaceResults]);

  const config = STATUS_CONFIG[status];

  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${config.bgClass}`}>
      <span className="text-2xl">{config.icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {config.label}
          </span>
        </div>
        <p className="text-sm text-f1-muted mt-0.5">{config.description}</p>
      </div>
    </div>
  );
}
