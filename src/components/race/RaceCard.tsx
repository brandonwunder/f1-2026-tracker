"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  formatRaceDate,
  getCountryFlag,
  type RaceStatus,
} from "@/lib/utils/dates";
import GPLogo from "@/components/race/GPLogo";

interface RaceCardProps {
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: string;
  status: RaceStatus;
}

export default function RaceCard({
  round,
  raceName,
  circuitName,
  country,
  locality,
  date,
  status,
}: RaceCardProps) {
  const flag = getCountryFlag(country);
  const formattedDate = formatRaceDate(date);

  const isPast = status === "past";
  const isNext = status === "next";

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        rotateX: -1,
        rotateY: 2,
        y: -4,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
    >
      <Link
        href={`/race/${round}`}
        className={`
          group relative block rounded-xl glass-card border overflow-hidden
          transition-all duration-200
          ${isNext ? "border-f1-red ring-2 ring-f1-red/40" : "border-f1-border"}
          ${isPast ? "opacity-80" : ""}
        `}
      >
        {/* Top accent stripe */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${
          isNext
            ? "bg-gradient-to-r from-transparent via-f1-red to-transparent"
            : isPast
            ? "bg-gradient-to-r from-transparent via-green-500/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-f1-border to-transparent"
        }`} />

        {/* Carbon fiber texture */}
        <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />

        {/* Checkered pattern overlay for past races */}
        {isPast && (
          <div className="absolute inset-0 checkered-pattern rounded-xl pointer-events-none" />
        )}

        <div className="relative p-4">
          {/* Next race badge */}
          {isNext && (
            <span className="absolute -top-0 right-3 bg-f1-red text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-b shadow-lg shadow-f1-red/30">
              Next Race
            </span>
          )}

          {/* Past race checkmark */}
          {isPast && (
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold flex items-center justify-center border border-green-500/30" title="Completed">
              &#10003;
            </span>
          )}

          {/* Round number */}
          <div className="text-[10px] font-bold text-f1-red uppercase tracking-widest mb-2">
            Round {round}
          </div>

          {/* GP image + race name */}
          <div className="flex items-start gap-2.5 mb-1">
            <GPLogo raceName={raceName} fallbackFlag={flag} size="sm" />
            <div className="min-w-0 flex-1">
              <h3 className="font-black text-sm leading-tight truncate text-white">
                {raceName}
              </h3>
              <p className="text-f1-muted text-xs mt-0.5 truncate font-medium">
                {circuitName}
              </p>
            </div>
          </div>

          {/* Date and locality */}
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(225, 6, 0, 0.1)' }}>
            <span className="text-xs text-f1-muted font-medium">{locality}</span>
            <span className={`text-xs font-bold ${isNext ? "text-f1-red" : "text-f1-muted"}`}>
              {formattedDate}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
