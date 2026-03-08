"use client";

import { useState, useEffect } from "react";
import { getCountdownValues } from "@/lib/utils/dates";

interface CountdownTimerProps {
  targetDate: string; // ISO date string, e.g. "2026-03-08T15:00:00Z"
  raceName: string;
}

export default function CountdownTimer({
  targetDate,
  raceName,
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(() =>
    getCountdownValues(new Date(targetDate))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownValues(new Date(targetDate)));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Race has passed
  if (countdown.total < -3 * 60 * 60 * 1000) {
    return (
      <div className="rounded-xl bg-f1-surface border border-f1-border p-6 text-center">
        <p className="text-f1-muted text-sm uppercase tracking-wider mb-1">
          {raceName}
        </p>
        <p className="text-lg font-semibold text-f1-muted">Race completed</p>
      </div>
    );
  }

  // Race window (within ~3 hours of start - approximate race duration)
  if (countdown.total <= 0) {
    return (
      <div className="rounded-xl bg-f1-surface border border-f1-red/50 p-6 text-center">
        <p className="text-f1-muted text-sm uppercase tracking-wider mb-1">
          {raceName}
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-f1-red animate-pulse" />
          <p className="text-lg font-bold text-f1-red">Race in progress</p>
        </div>
      </div>
    );
  }

  const units = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Mins", value: countdown.minutes },
    { label: "Secs", value: countdown.seconds },
  ];

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-6">
      <p className="text-f1-muted text-sm uppercase tracking-wider text-center mb-1">
        Next Race
      </p>
      <p className="text-center text-lg font-semibold mb-4">{raceName}</p>
      <div className="grid grid-cols-4 gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-f1-red tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-xs text-f1-muted uppercase tracking-wider mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
