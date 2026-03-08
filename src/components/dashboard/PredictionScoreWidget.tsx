"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllPredictions } from "@/lib/predictions/store";
import { motion } from "framer-motion";

export default function PredictionScoreWidget() {
  const [predictionCount, setPredictionCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const predictions = getAllPredictions();
    setPredictionCount(predictions.length);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-2xl bg-[#0D0D16] border border-f1-border p-5 animate-pulse">
        <div className="h-4 w-32 bg-f1-border rounded mb-4" />
        <div className="h-10 w-20 bg-f1-border rounded mb-2" />
        <div className="h-3 w-24 bg-f1-border rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
    >
      <Link
        href="/predictions"
        className="group relative block rounded-2xl bg-[#0D0D16] border border-f1-border overflow-hidden p-5 transition-all duration-200 hover:border-f1-red/30"
      >
        {/* Accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red/30 to-transparent" />
        <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-f1-red uppercase tracking-widest">
              Your Predictions
            </h3>
            <span className="text-xs text-white/40 group-hover:text-f1-red transition-colors font-semibold uppercase tracking-wider">
              View all &rarr;
            </span>
          </div>

          <div className="flex items-end gap-6">
            <div>
              <div className="text-4xl font-black text-f1-red tabular-nums font-orbitron drop-shadow-[0_0_8px_rgba(225,6,0,0.3)]">
                {predictionCount}
              </div>
              <p className="text-white/40 text-sm mt-1 font-medium">
                {predictionCount === 1 ? "race predicted" : "races predicted"}
              </p>
            </div>

            {predictionCount === 0 && (
              <p className="text-white/30 text-xs pb-1">
                Make your first podium prediction!
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
