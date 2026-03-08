'use client';

import Link from "next/link";
import type { DriverStanding, ConstructorStanding } from "@/lib/api/types";
import { TEAMS } from "@/lib/constants/teams";
import { getTeamIdFromConstructor } from "@/lib/utils/drivers";
import { motion } from "framer-motion";
import TeamLogo from "@/components/ui/TeamLogo";

function getTeamColor(constructorId: string): string {
  const teamId = getTeamIdFromConstructor(constructorId);
  return TEAMS[teamId]?.color ?? "#6B7280";
}

interface DriverPreviewProps {
  type: "drivers";
  standings: DriverStanding[];
}

interface ConstructorPreviewProps {
  type: "constructors";
  standings: ConstructorStanding[];
}

type StandingsPreviewProps = DriverPreviewProps | ConstructorPreviewProps;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

export default function StandingsPreview(props: StandingsPreviewProps) {
  const { type } = props;
  const title = type === "drivers" ? "Driver Standings" : "Constructor Standings";
  const top5 =
    type === "drivers"
      ? (props as DriverPreviewProps).standings.slice(0, 5)
      : (props as ConstructorPreviewProps).standings.slice(0, 5);

  if (top5.length === 0) {
    return (
      <div className="relative rounded-xl glass-card overflow-hidden p-5">
        <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
        <div className="relative">
          <h3 className="text-[10px] font-black text-f1-red uppercase tracking-widest mb-3">
            {title}
          </h3>
          <p className="text-f1-muted text-sm">
            Standings data will appear once the season begins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative rounded-xl glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red/40 to-transparent" />
      <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />

      <div className="relative p-5">
        <h3 className="text-[10px] font-black text-f1-red uppercase tracking-widest mb-4">
          {title}
        </h3>

        <motion.div
          className="space-y-1.5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {type === "drivers"
            ? (top5 as DriverStanding[]).map((entry) => {
                const constructorId =
                  entry.Constructors?.[0]?.constructorId ?? "";
                const teamColor = getTeamColor(constructorId);
                return (
                  <motion.div
                    key={entry.Driver.driverId}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-f1-surface-hover hover:-translate-y-0.5"
                    style={{ borderLeft: `3px solid ${teamColor}` }}
                    variants={rowVariants}
                  >
                    <span className="text-sm font-black text-f1-muted w-5 text-right tabular-nums font-orbitron">
                      {entry.position}
                    </span>
                    <TeamLogo teamId={constructorId} size={18} />
                    <span className="flex-1 text-sm text-white truncate">
                      {entry.Driver.givenName}{" "}
                      <span className="font-bold">{entry.Driver.familyName}</span>
                    </span>
                    <span className="text-sm font-black text-white tabular-nums font-orbitron">
                      {entry.points}
                    </span>
                  </motion.div>
                );
              })
            : (top5 as ConstructorStanding[]).map((entry) => {
                const constructorId = entry.Constructor.constructorId;
                const teamColor = getTeamColor(constructorId);
                return (
                  <motion.div
                    key={constructorId}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-f1-surface-hover hover:-translate-y-0.5"
                    style={{ borderLeft: `3px solid ${teamColor}` }}
                    variants={rowVariants}
                  >
                    <span className="text-sm font-black text-f1-muted w-5 text-right tabular-nums font-orbitron">
                      {entry.position}
                    </span>
                    <TeamLogo teamId={constructorId} size={18} />
                    <span className="flex-1 text-sm text-white truncate font-medium">
                      {entry.Constructor.name}
                    </span>
                    <span className="text-sm font-black text-white tabular-nums font-orbitron">
                      {entry.points}
                    </span>
                  </motion.div>
                );
              })}
        </motion.div>

        <Link
          href="/standings"
          className="block mt-4 pt-3 text-center text-xs font-bold text-f1-muted hover:text-f1-red transition-colors uppercase tracking-widest"
          style={{ borderTop: '1px solid rgba(225, 6, 0, 0.1)' }}
        >
          View full standings &rarr;
        </Link>
      </div>
    </motion.div>
  );
}
