'use client';

import Link from "next/link";
import { getCountryFlag, formatRaceDateLong } from "@/lib/utils/dates";
import CountdownTimer from "@/components/race/CountdownTimer";
import { motion } from "framer-motion";

interface NextRaceWidgetProps {
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: string;
  time?: string;
}

export default function NextRaceWidget({
  round,
  raceName,
  circuitName,
  country,
  locality,
  date,
  time,
}: NextRaceWidgetProps) {
  const flag = getCountryFlag(country);
  const formattedDate = formatRaceDateLong(date);
  const targetDate = time ? `${date}T${time}` : `${date}T14:00:00Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        href={`/race/${round}`}
        className="group relative block rounded-xl glass-card border border-f1-red/30 overflow-hidden transition-all duration-200 hover:border-f1-red/60"
      >
        {/* Racing stripe top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-f1-red to-transparent" />
        {/* Carbon fiber texture */}
        <div className="absolute inset-0 carbon-fiber opacity-20 pointer-events-none" />
        {/* Red radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(225, 6, 0, 0.08), transparent 60%)' }} />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-f1-red bg-f1-red/10 px-2.5 py-1 rounded border border-f1-red/20">
              Up Next &mdash; Round {round}
            </span>
            <span className="text-xs text-f1-muted group-hover:text-f1-red transition-colors font-semibold uppercase tracking-wider">
              View details &rarr;
            </span>
          </div>

          {/* Race info */}
          <div className="flex items-start gap-3 mb-5">
            <span className="text-4xl leading-none">{flag}</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
                {raceName}
              </h2>
              <p className="text-f1-muted text-sm mt-1 font-medium">{circuitName}</p>
              <p className="text-f1-muted text-sm font-medium">
                {locality} &middot; {formattedDate}
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="font-orbitron">
            <CountdownTimer targetDate={targetDate} raceName={raceName} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
