'use client';

import Link from "next/link";
import { Calendar, Users, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/MotionWrappers";
import { type ElementType } from "react";

interface QuickLinkItem {
  href: string;
  icon: ElementType;
  title: string;
  description: string;
}

const LINKS: QuickLinkItem[] = [
  {
    href: "/calendar",
    icon: Calendar,
    title: "Race Calendar",
    description: "Full 2026 season schedule",
  },
  {
    href: "/drivers",
    icon: Users,
    title: "Drivers",
    description: "Driver profiles and stats",
  },
  {
    href: "/standings",
    icon: Trophy,
    title: "Standings",
    description: "Championship leaderboards",
  },
  {
    href: "/predictions",
    icon: Target,
    title: "Predictions",
    description: "Predict podium finishes",
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
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <motion.div key={link.href} variants={itemVariants}>
            <TiltCard className="relative rounded-xl glass-card overflow-hidden" glowColor="#E10600">
              {/* Accent stripe */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red/30 to-transparent" />
              <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
              <Link
                href={link.href}
                className="group relative block p-4"
              >
                <Icon className="w-6 h-6 text-f1-red mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-black text-white group-hover:text-f1-red transition-colors uppercase tracking-wide">
                  {link.title}
                </h3>
                <p className="text-xs text-f1-muted mt-1 font-medium">{link.description}</p>
              </Link>
            </TiltCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
