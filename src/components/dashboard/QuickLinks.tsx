'use client';

import Link from "next/link";
import { Calendar, Users, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import { type ElementType } from "react";

interface QuickLinkItem {
  href: string;
  icon: ElementType;
  title: string;
  description: string;
  color: string;
}

const LINKS: QuickLinkItem[] = [
  {
    href: "/calendar",
    icon: Calendar,
    title: "Race Calendar",
    description: "Full 2026 season schedule",
    color: "#E10600",
  },
  {
    href: "/drivers",
    icon: Users,
    title: "Drivers",
    description: "Driver profiles and stats",
    color: "#3671C6",
  },
  {
    href: "/standings",
    icon: Trophy,
    title: "Standings",
    description: "Championship leaderboards",
    color: "#FFD700",
  },
  {
    href: "/predictions",
    icon: Target,
    title: "Predictions",
    description: "Predict podium finishes",
    color: "#22C55E",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function QuickLinks() {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <motion.div key={link.href} variants={itemVariants}>
            <Link
              href={link.href}
              className="group relative block rounded-2xl bg-[#0D0D16] border border-f1-border overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ ['--link-color' as string]: link.color }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${link.color}50, transparent)` }}
              />
              <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
              {/* Subtle glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top, ${link.color}08, transparent 70%)` }}
              />

              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border transition-all group-hover:scale-110"
                  style={{
                    backgroundColor: `${link.color}15`,
                    borderColor: `${link.color}30`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: link.color }} />
                </div>
                <h3 className="text-sm font-black text-white group-hover:text-f1-red transition-colors uppercase tracking-wide">
                  {link.title}
                </h3>
                <p className="text-xs text-white/35 mt-1 font-medium">{link.description}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
