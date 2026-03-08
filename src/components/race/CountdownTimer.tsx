"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCountdownValues } from "@/lib/utils/dates";

interface CountdownTimerProps {
  targetDate: string;
  raceName: string;
}

function AnimatedDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="text-center">
      <div className="relative rounded-xl overflow-hidden">
        <div className="glass-card p-3 md:p-4 relative overflow-hidden">
          <div className="absolute inset-0 carbon-fiber opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-f1-red/5 rounded-xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-f1-red/10 to-transparent rounded-b-xl" />
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/30" />
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={display}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block text-3xl md:text-5xl font-black text-f1-red tabular-nums font-orbitron"
              >
                {display}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-f1-muted uppercase tracking-widest mt-2 font-bold">
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

  if (countdown.total < -3 * 60 * 60 * 1000) {
    return (
      <div className="relative rounded-xl glass-card border border-f1-border overflow-hidden p-6 text-center">
        <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
        <div className="relative">
          <p className="text-f1-muted text-sm uppercase tracking-widest mb-1 font-bold">
            {raceName}
          </p>
          <p className="text-lg font-black text-f1-muted uppercase">Race completed</p>
        </div>
      </div>
    );
  }

  if (countdown.total <= 0) {
    return (
      <div className="relative rounded-xl glass-card border border-f1-red/50 overflow-hidden p-6 text-center">
        <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
        <div className="absolute inset-0 animate-glow-pulse rounded-xl" />
        <div className="absolute inset-0 bg-f1-red/5" />
        <div className="relative">
          <p className="text-f1-muted text-sm uppercase tracking-widest mb-1 font-bold">
            {raceName}
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-f1-red animate-pulse shadow-lg shadow-f1-red/50" />
            <p className="text-xl md:text-2xl font-black text-f1-red font-orbitron tracking-wider">
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
    <div className="relative rounded-xl glass-card border border-f1-border overflow-hidden p-6">
      <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red/60 to-transparent" />
      <div className="relative">
        <p className="text-[10px] text-f1-red uppercase tracking-widest text-center mb-1 font-black">
          Lights Out
        </p>
        <p className="text-center text-lg font-black mb-5 uppercase tracking-wide">{raceName}</p>
        <div className="grid grid-cols-4 gap-3">
          {units.map((unit) => (
            <AnimatedDigit key={unit.label} value={unit.value} label={unit.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
