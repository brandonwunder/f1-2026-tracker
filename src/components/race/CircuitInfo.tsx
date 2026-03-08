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
      className="relative rounded-xl glass-card border border-f1-border overflow-hidden"
    >
      {/* Racing stripe */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red/40 to-transparent" />
      <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />

      <div className="relative p-5">
        <h3 className="text-lg font-black uppercase tracking-wide mb-4">Circuit Information</h3>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg bg-f1-dark/50 p-2.5 border border-f1-border/50">
                <span className="text-f1-muted flex items-center gap-1.5 text-[10px] uppercase tracking-widest mb-1 font-semibold">
                  <Icon className="w-3.5 h-3.5 text-f1-red" />
                  {item.label}
                </span>
                <span className="font-bold text-white">{item.value}</span>
                {item.subtext && (
                  <span className="text-f1-muted block text-xs mt-0.5">{item.subtext}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Overtaking Spots */}
        <div className="mt-4 pt-4 border-t border-f1-border/50">
          <span className="text-f1-red block text-[10px] uppercase tracking-widest mb-2 font-bold">
            Key Overtaking Spots
          </span>
          <ul className="space-y-1.5">
            {circuit.overtakingSpots.map((spot) => (
              <li key={spot} className="text-sm flex items-start gap-2">
                <span className="text-f1-red mt-0.5 shrink-0">&#9656;</span>
                <span className="text-white/90">{spot}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
