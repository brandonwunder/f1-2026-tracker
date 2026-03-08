'use client';

import Link from "next/link";
import { getCountryFlag, formatRaceDateLong } from "@/lib/utils/dates";
import CountdownTimer from "@/components/race/CountdownTimer";
import GPLogo from "@/components/race/GPLogo";
import { motion } from "framer-motion";

interface NextRaceWidgetProps {
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: string;
  time?: string;
  hasRaceResults?: boolean;
}

export default function NextRaceWidget({
  round,
  raceName,
  circuitName,
  country,
  locality,
  date,
  time,
  hasRaceResults = false,
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
        className="group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(225,6,0,0.15)]"
      >
        {/* Solid darker background for contrast */}
        <div className="absolute inset-0 bg-[#0D0D16]" />
        {/* Racing stripe top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-f1-red via-red-400 to-f1-red" />
        {/* Left accent */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-f1-red" />
        {/* Carbon fiber texture */}
        <div className="absolute inset-0 carbon-fiber opacity-25 pointer-events-none" />
        {/* Red radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(225, 6, 0, 0.1), transparent 60%)' }} />
        {/* Border */}
        <div className="absolute inset-0 rounded-2xl border border-f1-red/30 pointer-events-none" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white bg-f1-red px-3 py-1.5 rounded-md shadow-lg shadow-f1-red/30">
              Up Next &mdash; Round {round}
            </span>
            <span className="text-xs text-f1-muted group-hover:text-f1-red transition-colors font-semibold uppercase tracking-wider">
              View details &rarr;
            </span>
          </div>

          {/* Race info */}
          <div className="flex items-start gap-4 mb-6">
            <GPLogo raceName={raceName} fallbackFlag={flag} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                {raceName}
              </h2>
              <p className="text-white/60 text-sm mt-1.5 font-semibold">{circuitName}</p>
              <p className="text-white/40 text-sm font-medium">
                {locality} &middot; {formattedDate}
              </p>
            </div>
          </div>

          {/* Divider + Countdown — hide when race is already complete */}
          {!hasRaceResults && (
            <>
              <div className="broadcast-divider mb-5" />
              <CountdownTimer
                targetDate={targetDate}
                raceName={raceName}
                raceResultsPending
              />
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
