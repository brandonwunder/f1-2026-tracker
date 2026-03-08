"use client";

import { motion } from "framer-motion";
import { MapPin, Timer, CornerDownRight, Ruler, Calendar, Flag } from "lucide-react";
import type { CircuitData } from "@/lib/data/circuits";

interface CircuitInfoProps {
  circuit: CircuitData;
}

export default function CircuitInfo({ circuit }: CircuitInfoProps) {
  const typeLabel =
    circuit.type === "street"
      ? "Street Circuit"
      : circuit.type === "semi-permanent"
      ? "Semi-Permanent"
      : "Permanent Circuit";

  const infoItems = [
    {
      icon: MapPin,
      label: "Location",
      value: circuit.location,
    },
    {
      icon: Flag,
      label: "Circuit Type",
      value: typeLabel,
    },
    {
      icon: Ruler,
      label: "Track Length",
      value: `${circuit.lengthKm.toFixed(3)} km`,
    },
    {
      icon: CornerDownRight,
      label: "Turns",
      value: String(circuit.turns),
    },
    {
      icon: Calendar,
      label: "First Grand Prix",
      value: String(circuit.firstGP),
    },
    {
      icon: Timer,
      label: "Lap Record",
      value: circuit.lapRecord.time,
      subtext: `${circuit.lapRecord.driver} (${circuit.lapRecord.year})`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl glass-card border border-f1-border p-5"
    >
      <h3 className="text-lg font-bold mb-4">Circuit Information</h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {infoItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label}>
              <span className="text-f1-muted flex items-center gap-1.5 text-xs uppercase tracking-wider mb-0.5">
                <Icon className="w-3.5 h-3.5 text-f1-red" />
                {item.label}
              </span>
              <span className="font-medium">{item.value}</span>
              {item.subtext && (
                <span className="text-f1-muted block text-xs">{item.subtext}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Overtaking Spots */}
      <div className="mt-4 pt-4 border-t border-f1-border">
        <span className="text-f1-muted block text-xs uppercase tracking-wider mb-2">
          Key Overtaking Spots
        </span>
        <ul className="space-y-1">
          {circuit.overtakingSpots.map((spot) => (
            <li key={spot} className="text-sm flex items-start gap-2">
              <span className="text-f1-red mt-0.5 shrink-0">&#9656;</span>
              <span>{spot}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
