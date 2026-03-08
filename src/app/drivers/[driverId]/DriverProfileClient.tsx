'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Flag, Medal, Zap, Timer, Play, Star, Sparkles, Clock } from 'lucide-react';
import type { DriverProfile } from '@/lib/data/driver-profiles';
import { PageTransition } from '@/components/ui/MotionWrappers';

interface StatCard {
  label: string;
  value: number;
  icon: string;
}

interface DriverProfileClientProps {
  profile: DriverProfile;
  teamColor: string;
  teamName: string;
  flag: string;
  imageUrl: string;
  statCards: StatCard[];
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  flag: Flag,
  medal: Medal,
  zap: Zap,
  timer: Timer,
  play: Play,
  star: Star,
};

const funFactIcons = [Sparkles, Star, Zap, Trophy, Flag];

export default function DriverProfileClient({
  profile,
  teamColor,
  teamName,
  flag,
  imageUrl,
  statCards,
}: DriverProfileClientProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Back Button */}
        <Link
          href="/drivers"
          className="inline-flex items-center gap-2 text-f1-muted hover:text-white transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Drivers
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${teamColor}30, ${teamColor}10, transparent)`,
            borderLeft: `4px solid ${teamColor}`,
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            background: `radial-gradient(circle at 80% 50%, ${teamColor}, transparent 60%)`,
          }} />

          <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
            {/* Driver Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${teamColor}40, transparent)`,
                boxShadow: `0 8px 32px ${teamColor}30`,
              }}
            >
              {!imgError ? (
                <img
                  src={imageUrl}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-full object-cover object-top"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-5xl font-bold text-white"
                  style={{ backgroundColor: teamColor }}
                >
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </div>
              )}
            </motion.div>

            {/* Driver Info */}
            <div className="text-center md:text-left flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center gap-3 justify-center md:justify-start mb-2"
              >
                <span className="text-2xl font-orbitron" style={{ color: teamColor }}>
                  #{profile.number}
                </span>
                <span className="text-2xl">{flag}</span>
                <span className="text-sm px-3 py-1 rounded-full" style={{
                  backgroundColor: `${teamColor}20`,
                  color: teamColor,
                  border: `1px solid ${teamColor}40`,
                }}>
                  {profile.code}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-3xl md:text-5xl font-bold text-white mb-2"
              >
                {profile.firstName}{' '}
                <span style={{ color: teamColor }}>{profile.lastName}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-lg font-medium mb-1"
                style={{ color: teamColor }}
              >
                {teamName}
              </motion.p>

              {profile.nickname && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                  className="text-f1-muted text-sm italic"
                >
                  &quot;{profile.nickname}&quot;
                </motion.p>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-f1-muted text-sm mt-2"
              >
                Born: {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                | {profile.nationality}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Known For */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-xl p-6 text-center"
          style={{ borderLeft: `4px solid ${teamColor}` }}
        >
          <p className="text-lg md:text-xl text-white font-medium">
            {profile.knownFor}
          </p>
        </motion.div>

        {/* Career Stats Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: teamColor }} />
            Career Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => {
              const Icon = iconMap[stat.icon] ?? Star;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="glass-card rounded-xl p-4 text-center"
                  style={{
                    borderTop: `3px solid ${teamColor}`,
                  }}
                >
                  <Icon
                    className="w-5 h-5 mx-auto mb-2"
                    style={{ color: teamColor }}
                  />
                  <p className="text-2xl md:text-3xl font-bold font-orbitron text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-f1-muted uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* First Race & First Win */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-f1-muted uppercase tracking-wider mb-1">First Race</p>
              <p className="text-sm text-white font-medium">{profile.careerStats.firstRace}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-f1-muted uppercase tracking-wider mb-1">First Win</p>
              <p className="text-sm text-white font-medium">
                {profile.careerStats.firstWin ?? 'Still hunting for that first victory!'}
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: teamColor }} />
            Fun Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.funFacts.map((fact, i) => {
              const Icon = funFactIcons[i % funFactIcons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="glass-card rounded-xl p-4 flex gap-3 items-start"
                  style={{
                    borderLeft: `3px solid ${teamColor}40`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${teamColor}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: teamColor }} />
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{fact}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Career Highlights */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: teamColor }} />
            Career Highlights
          </h2>
          <div className="relative pl-6 space-y-4">
            {/* Timeline line */}
            <div
              className="absolute left-2 top-2 bottom-2 w-0.5"
              style={{ backgroundColor: `${teamColor}40` }}
            />

            {profile.highlights.map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="relative"
              >
                {/* Timeline dot */}
                <div
                  className="absolute -left-[18px] top-1.5 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: teamColor,
                    backgroundColor: i === 0 ? teamColor : 'transparent',
                  }}
                />
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm text-gray-300 leading-relaxed">{highlight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Helmet Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card rounded-xl p-5"
          style={{ borderLeft: `4px solid ${teamColor}` }}
        >
          <h3 className="text-sm font-semibold text-f1-muted uppercase tracking-wider mb-2">
            Helmet Design
          </h3>
          <p className="text-sm text-gray-300">{profile.helmetDescription}</p>
        </motion.div>

        {/* Back Button */}
        <div className="text-center pt-4">
          <Link
            href="/drivers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
            style={{
              backgroundColor: `${teamColor}20`,
              border: `1px solid ${teamColor}40`,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Drivers
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
