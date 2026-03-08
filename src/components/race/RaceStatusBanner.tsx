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
    description: 'Qualifying has finished \u2014 grid is set! Race has NOT started yet.',
    bgClass: 'bg-yellow-500/10 border-yellow-500/30',
    dotClass: 'bg-yellow-500 animate-pulse',
    icon: '\u{1F3C1}',
  },
  'race-day': {
    label: 'RACE DAY',
    description: 'The race is happening now or about to start! Results will appear once the race finishes.',
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

/** Which steps are done for the progress bar */
function getCompletedSteps(status: WeekendStatus, hasQualifying: boolean) {
  return {
    practice: status !== 'upcoming',
    qualifying: hasQualifying,
    race: status === 'completed',
  };
}

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
  const steps = getCompletedSteps(status, hasQualifying);

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
        <ProgressStep label="Practice" done={steps.practice} active={status === 'upcoming'} />
        <ProgressConnector done={steps.qualifying} />
        <ProgressStep label="Qualifying" done={steps.qualifying} active={!steps.qualifying && steps.practice} />
        <ProgressConnector done={steps.race} />
        <ProgressStep
          label="Race"
          done={steps.race}
          active={
            (status === 'race-day' || status === 'past') && !steps.race
          }
        />
      </div>
    </div>
  );
}

function ProgressStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
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
