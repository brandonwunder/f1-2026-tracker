"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllPredictions } from "@/lib/predictions/store";

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
      <div className="rounded-xl bg-f1-surface border border-f1-border p-5 animate-pulse">
        <div className="h-4 w-32 bg-f1-border rounded mb-4" />
        <div className="h-10 w-20 bg-f1-border rounded mb-2" />
        <div className="h-3 w-24 bg-f1-border rounded" />
      </div>
    );
  }

  return (
    <Link
      href="/predictions"
      className="group block rounded-xl bg-f1-surface border border-f1-border p-5 transition-all duration-200 hover:bg-f1-surface-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-f1-muted uppercase tracking-wider">
          Your Predictions
        </h3>
        <span className="text-xs text-f1-muted group-hover:text-white transition-colors">
          View all &rarr;
        </span>
      </div>

      <div className="flex items-end gap-6">
        <div>
          <div className="text-4xl font-bold text-f1-red tabular-nums">
            {predictionCount}
          </div>
          <p className="text-f1-muted text-sm mt-1">
            {predictionCount === 1 ? "race predicted" : "races predicted"}
          </p>
        </div>

        {predictionCount === 0 && (
          <p className="text-f1-muted text-xs pb-1">
            Make your first podium prediction!
          </p>
        )}
      </div>
    </Link>
  );
}
