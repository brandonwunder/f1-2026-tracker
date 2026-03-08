"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/MotionWrappers";
import type { PredictionScore } from "@/lib/predictions/store";

interface SeasonScoreProps {
  totalPoints: number;
  raceScores: PredictionScore[];
}

export default function SeasonScore({ totalPoints, raceScores }: SeasonScoreProps) {
  const racesScored = raceScores.length;
  const avgPerRace = racesScored > 0 ? (totalPoints / racesScored).toFixed(1) : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card gradient-border rounded-xl p-6"
    >
      <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-4 font-medium">
        Season Score
      </h2>

      <div className="flex items-end gap-3 mb-6">
        <AnimatedNumber
          value={totalPoints}
          className="text-5xl font-bold text-f1-red leading-none font-orbitron"
        />
        <span className="text-lg text-f1-muted mb-1">pts</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-f1-dark border border-f1-border p-3">
          <p className="text-xs text-f1-muted mb-1">Races Predicted</p>
          <p className="text-xl font-bold font-orbitron">{racesScored}</p>
        </div>
        <div className="rounded-lg bg-f1-dark border border-f1-border p-3">
          <p className="text-xs text-f1-muted mb-1">Avg per Race</p>
          <p className="text-xl font-bold font-orbitron">{avgPerRace}</p>
        </div>
      </div>
    </motion.div>
  );
}
