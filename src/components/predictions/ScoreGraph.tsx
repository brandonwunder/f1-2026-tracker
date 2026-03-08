"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { PredictionScore } from "@/lib/predictions/store";
import type { CalendarRace } from "@/lib/api/types";

interface ScoreGraphProps {
  raceScores: PredictionScore[];
  calendar: CalendarRace[];
}

interface DataPoint {
  round: number;
  raceName: string;
  roundPoints: number;
  cumulative: number;
}

export default function ScoreGraph({ raceScores, calendar }: ScoreGraphProps) {
  if (raceScores.length === 0) {
    return (
      <div className="rounded-xl bg-f1-surface border border-f1-border p-6">
        <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-3 font-medium">
          Score Over Time
        </h2>
        <p className="text-f1-muted text-sm">
          No scored predictions yet. Make predictions and check back after races complete.
        </p>
      </div>
    );
  }

  // Build cumulative data points sorted by round
  const sorted = [...raceScores].sort((a, b) => a.round - b.round);
  const calendarMap = new Map(calendar.map((r) => [r.round, r.raceName]));

  let cumulative = 0;
  const data: DataPoint[] = sorted.map((rs) => {
    cumulative += rs.totalPoints;
    return {
      round: rs.round,
      raceName: calendarMap.get(rs.round) ?? `Round ${rs.round}`,
      roundPoints: rs.totalPoints,
      cumulative,
    };
  });

  return (
    <div className="rounded-xl bg-f1-surface border border-f1-border p-6">
      <h2 className="text-xs uppercase tracking-wider text-f1-muted mb-4 font-medium">
        Score Over Time
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#2E2E3E" strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              tick={{ fill: "#8B8B9E", fontSize: 12 }}
              axisLine={{ stroke: "#2E2E3E" }}
              tickLine={{ stroke: "#2E2E3E" }}
              label={{
                value: "Round",
                position: "insideBottomRight",
                offset: -5,
                fill: "#8B8B9E",
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fill: "#8B8B9E", fontSize: 12 }}
              axisLine={{ stroke: "#2E2E3E" }}
              tickLine={{ stroke: "#2E2E3E" }}
              label={{
                value: "Points",
                angle: -90,
                position: "insideLeft",
                fill: "#8B8B9E",
                fontSize: 11,
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const d = payload[0].payload as DataPoint;
                return (
                  <div className="rounded-lg bg-f1-dark border border-f1-border p-3 shadow-lg">
                    <p className="text-sm font-medium mb-1">{d.raceName}</p>
                    <p className="text-xs text-f1-muted">
                      Round {d.round} &middot; +{d.roundPoints} pts
                    </p>
                    <p className="text-sm font-bold text-f1-red mt-1">
                      Total: {d.cumulative} pts
                    </p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#E10600"
              strokeWidth={2}
              dot={{ fill: "#E10600", r: 4, stroke: "#1F1F2B", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#E10600", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
