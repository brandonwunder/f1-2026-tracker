'use client';

import { useState, useEffect } from 'react';

interface RaceStatusBannerProps {
  raceDate: string;
  raceTime: string;
  hasQualifying: boolean;
  hasRaceResults: boolean;
}

type WeekendStatus = 'upcoming' | 'qualifying-done' | 'race-day' | 'completed' | 'waiting';

function getWeekendStatus(
  raceDate: string,
  raceTime: string,
  hasQualifying: boolean,
  hasRaceResults: boolean,
): WeekendStatus {
  if (hasRaceResults) return 'completed';

  const now = new Date();
  const raceStart = new Date(`${raceDate}T${raceTime}`);
  const raceEnd = new Date(raceStart.getTime() + 3 * 60 * 60 * 1000);

  // If qualifying is done but no race results yet, check timing
  if (hasQualifying && !hasRaceResults) {
    if (now >= raceStart && now <= raceEnd) return 'race-day';
    if (now > raceEnd) return 'waiting';
    return 'qualifying-done';
  }

  // No qualifying data yet
  if (now >= raceStart) return 'race-day';
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
    description: 'Race weekend has not started yet.',
    bgClass: 'bg-blue-500/10 border-blue-500/30',
    dotClass: 'bg-blue-500',
    icon: '\u{1F4C5}',
  },
  'qualifying-done': {
    label: 'QUALIFYING COMPLETE',
    description: 'Qualifying is done \u2014 the starting grid is set! Waiting for the race.',
    bgClass: 'bg-yellow-500/10 border-yellow-500/30',
    dotClass: 'bg-yellow-500 animate-pulse',
    icon: '\u{1F3C1}',
  },
  'race-day': {
    label: 'RACE IN PROGRESS',
    description: 'The race is happening now! Results will appear once it finishes.',
    bgClass: 'bg-f1-red/10 border-f1-red/30',
    dotClass: 'bg-f1-red animate-pulse',
    icon: '\u{1F3CE}\u{FE0F}',
  },
  completed: {
    label: 'RACE COMPLETE',
    description: 'The race has finished. Final results are in!',
    bgClass: 'bg-green-500/10 border-green-500/30',
    dotClass: 'bg-green-500',
    icon: '\u2705',
  },
  waiting: {
    label: 'WAITING FOR RESULTS',
    description: 'The race has likely finished. Results will appear here as soon as they are available.',
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

    const interval = setInterval(() => {
      setStatus(getWeekendStatus(raceDate, raceTime, hasQualifying, hasRaceResults));
    }, 60_000);

    return () => clearInterval(interval);
  }, [raceDate, raceTime, hasQualifying, hasRaceResults]);

  const config = STATUS_CONFIG[status];

  return (
    <div className={`rounded-xl border p-4 ${config.bgClass}`}>
      <div className="flex items-center gap-3">
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

      {/* Weekend Progress Bar */}
      <div className="mt-3 flex items-center gap-1">
        <ProgressStep
          label="Qualifying"
          done={hasQualifying}
          active={!hasQualifying && status === 'upcoming'}
        />
        <ProgressConnector done={hasRaceResults} />
        <ProgressStep
          label="Race"
          done={hasRaceResults}
          active={hasQualifying && !hasRaceResults}
        />
      </div>
    </div>
  );
}

function ProgressStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
          done
            ? 'bg-green-500 border-green-500 text-white'
            : active
            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 animate-pulse'
            : 'border-f1-border bg-f1-dark text-f1-muted'
        }`}
      >
        {done ? '\u2713' : ''}
      </div>
      <span
        className={`text-[10px] uppercase tracking-wider font-medium ${
          done ? 'text-green-400' : active ? 'text-yellow-400' : 'text-f1-muted'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function ProgressConnector({ done }: { done: boolean }) {
  return (
    <div
      className={`h-0.5 flex-1 rounded-full mt-[-14px] ${
        done ? 'bg-green-500' : 'bg-f1-border'
      }`}
    />
  );
}
