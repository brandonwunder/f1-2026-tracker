'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  if (hasQualifying && !hasRaceResults) {
    if (now >= raceStart && now <= raceEnd) return 'race-day';
    if (now > raceEnd) return 'waiting';
    return 'qualifying-done';
  }

  if (now >= raceStart) return 'race-day';
  return 'upcoming';
}

const STATUS_CONFIG: Record<WeekendStatus, {
  label: string;
  description: string;
  accentColor: string;
  dotClass: string;
  icon: string;
}> = {
  upcoming: {
    label: 'UPCOMING',
    description: 'Race weekend has not started yet.',
    accentColor: '#3B82F6',
    dotClass: 'bg-blue-500',
    icon: '\u{1F4C5}',
  },
  'qualifying-done': {
    label: 'QUALIFYING COMPLETE',
    description: 'Qualifying is done \u2014 the starting grid is set! Waiting for the race.',
    accentColor: '#EAB308',
    dotClass: 'bg-yellow-500 animate-pulse',
    icon: '\u{1F3C1}',
  },
  'race-day': {
    label: 'RACE IN PROGRESS',
    description: 'The race is happening now! Results will appear once it finishes.',
    accentColor: '#E10600',
    dotClass: 'bg-f1-red animate-pulse',
    icon: '\u{1F3CE}\u{FE0F}',
  },
  completed: {
    label: 'RACE COMPLETE',
    description: 'The race has finished. Final results are in!',
    accentColor: '#22C55E',
    dotClass: 'bg-green-500',
    icon: '\u2705',
  },
  waiting: {
    label: 'WAITING FOR RESULTS',
    description: 'The race has likely finished. Results will appear here as soon as they are available.',
    accentColor: '#F97316',
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl glass-card border overflow-hidden"
      style={{ borderColor: `${config.accentColor}30` }}
    >
      {/* Accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accentColor}80, transparent)` }}
      />
      <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${config.accentColor}10, transparent 60%)` }}
      />

      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
              <span
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: config.accentColor }}
              >
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
            color={config.accentColor}
          />
          <ProgressConnector done={hasRaceResults} color={config.accentColor} />
          <ProgressStep
            label="Race"
            done={hasRaceResults}
            active={hasQualifying && !hasRaceResults}
            color={config.accentColor}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ProgressStep({ label, done, active, color }: { label: string; done: boolean; active: boolean; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
          done
            ? 'text-white'
            : active
            ? 'animate-pulse'
            : 'border-f1-border bg-f1-dark text-f1-muted'
        }`}
        style={
          done
            ? { backgroundColor: '#22C55E', borderColor: '#22C55E' }
            : active
            ? { borderColor: color, backgroundColor: `${color}20`, color: color }
            : {}
        }
      >
        {done ? '\u2713' : ''}
      </div>
      <span
        className={`text-[10px] uppercase tracking-widest font-bold ${
          done ? 'text-green-400' : active ? '' : 'text-f1-muted'
        }`}
        style={active ? { color } : {}}
      >
        {label}
      </span>
    </div>
  );
}

function ProgressConnector({ done, color }: { done: boolean; color: string }) {
  return (
    <div
      className="h-0.5 flex-1 rounded-full mt-[-14px]"
      style={{ backgroundColor: done ? '#22C55E' : `${color}20` }}
    />
  );
}
