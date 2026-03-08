"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCountdownValues } from "@/lib/utils/dates";

interface CountdownTimerProps {
  targetDate: string; // ISO date string, e.g. "2026-03-08T15:00:00Z"
  raceName: string;
}

function AnimatedDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="text-center">
      <div className="glass-card rounded-lg p-3 md:p-4 relative overflow-hidden">
        {/* Subtle red glow behind the numbers */}
        <div className="absolute inset-0 bg-f1-red/5 rounded-lg" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-f1-red/10 to-transparent rounded-b-lg" />
        <div className="relative">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={display}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="block text-3xl md:text-4xl font-bold text-f1-red tabular-nums font-orbitron"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className="text-xs text-f1-muted uppercase tracking-wider mt-2">
        {label}
      </div>
    </div>
  );
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
      <div className="rounded-xl glass-card border border-f1-border p-6 text-center">
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
      <div className="rounded-xl glass-card border border-f1-red/50 p-6 text-center relative overflow-hidden">
        {/* Dramatic pulsing red glow for race in progress */}
        <div className="absolute inset-0 animate-glow-pulse rounded-xl" />
        <div className="absolute inset-0 bg-f1-red/5" />
        <div className="relative">
          <p className="text-f1-muted text-sm uppercase tracking-wider mb-1">
            {raceName}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-f1-red animate-pulse shadow-lg shadow-f1-red/50" />
            <p className="text-xl font-bold text-f1-red font-orbitron tracking-wide">
              RACE IN PROGRESS
            </p>
            <span className="inline-block w-3 h-3 rounded-full bg-f1-red animate-pulse shadow-lg shadow-f1-red/50" />
          </div>
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
    <div className="rounded-xl glass-card border border-f1-border p-6">
      <p className="text-f1-muted text-sm uppercase tracking-wider text-center mb-1">
        Next Race
      </p>
      <p className="text-center text-lg font-semibold mb-4">{raceName}</p>
      <div className="grid grid-cols-4 gap-3">
        {units.map((unit) => (
          <AnimatedDigit key={unit.label} value={unit.value} label={unit.label} />
        ))}
      </div>
    </div>
  );
}
