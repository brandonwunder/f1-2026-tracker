'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flag, Medal, Zap, Timer, Star, Sparkles, ExternalLink } from 'lucide-react';
import { getDriverProfile, type DriverProfile } from '@/lib/data/driver-profiles';
import { getDriverProfileImageUrl, getDriverCountryFlag } from '@/lib/utils/drivers';
import { TEAMS } from '@/lib/constants/teams';

interface DriverProfileModalProps {
  driverId: string | null;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  flag: Flag,
  medal: Medal,
  zap: Zap,
  timer: Timer,
  star: Star,
};

export default function DriverProfileModal({ driverId, onClose }: DriverProfileModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  // Reset image error when driver changes
  useEffect(() => {
    setImgError(false);
  }, [driverId]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (driverId) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [driverId, onClose]);

  const profile = driverId ? getDriverProfile(driverId) : undefined;

  return (
    <AnimatePresence>
      {driverId && profile && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <ModalContent
            profile={profile}
            imgError={imgError}
            setImgError={setImgError}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalContent({
  profile,
  imgError,
  setImgError,
  onClose,
}: {
  profile: DriverProfile;
  imgError: boolean;
  setImgError: (v: boolean) => void;
  onClose: () => void;
}) {
  const team = TEAMS[profile.teamId];
  const teamColor = team?.color ?? '#666666';
  const teamName = team?.name ?? 'Unknown Team';
  const flag = getDriverCountryFlag(profile.nationality);
  const imageUrl = getDriverProfileImageUrl(
    profile.driverId,
    profile.teamId,
    profile.firstName,
    profile.lastName,
  );

  const stats = profile.careerStats;
  const quickStats = [
    { label: 'Titles', value: stats.championships, icon: 'trophy' },
    { label: 'Wins', value: stats.wins, icon: 'flag' },
    { label: 'Podiums', value: stats.podiums, icon: 'medal' },
    { label: 'Poles', value: stats.poles, icon: 'zap' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-f1-border"
      style={{
        background: `linear-gradient(180deg, ${teamColor}15 0%, #1a1a2e 30%)`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-f1-dark/80 border border-f1-border flex items-center justify-center text-f1-muted hover:text-white hover:bg-f1-surface-hover transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Hero header */}
      <div className="flex items-center gap-4 p-5 pb-3">
        {/* Driver photo */}
        <div
          className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${teamColor}40, transparent)`,
            boxShadow: `0 4px 16px ${teamColor}30`,
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
              className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: teamColor }}
            >
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
          )}
        </div>

        {/* Name & info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-orbitron" style={{ color: teamColor }}>
              #{profile.number}
            </span>
            <span className="text-lg">{flag}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${teamColor}20`,
                color: teamColor,
                border: `1px solid ${teamColor}40`,
              }}
            >
              {profile.code}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white truncate">
            {profile.firstName}{' '}
            <span style={{ color: teamColor }}>{profile.lastName}</span>
          </h2>
          <p className="text-sm" style={{ color: teamColor }}>
            {teamName}
          </p>
          {profile.nickname && (
            <p className="text-xs text-f1-muted italic mt-0.5">
              &quot;{profile.nickname}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Known For */}
      <div
        className="mx-5 mb-4 p-3 rounded-lg text-sm text-gray-300"
        style={{
          borderLeft: `3px solid ${teamColor}`,
          backgroundColor: `${teamColor}10`,
        }}
      >
        {profile.knownFor}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 px-5 mb-4">
        {quickStats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? Star;
          return (
            <div
              key={stat.label}
              className="glass-card rounded-lg p-2 text-center"
              style={{ borderTop: `2px solid ${teamColor}` }}
            >
              <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: teamColor }} />
              <p className="text-lg font-bold font-orbitron text-white">
                {stat.value}
              </p>
              <p className="text-[10px] text-f1-muted uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Extra stats row */}
      <div className="grid grid-cols-3 gap-2 px-5 mb-4">
        <div className="glass-card rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-white">{stats.fastestLaps}</p>
          <p className="text-[10px] text-f1-muted uppercase">Fastest Laps</p>
        </div>
        <div className="glass-card rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-white">{stats.raceStarts}</p>
          <p className="text-[10px] text-f1-muted uppercase">Race Starts</p>
        </div>
        <div className="glass-card rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-white">{stats.points.toLocaleString()}</p>
          <p className="text-[10px] text-f1-muted uppercase">Career Pts</p>
        </div>
      </div>

      {/* Fun Facts (show first 3) */}
      <div className="px-5 mb-4">
        <h3 className="text-xs font-semibold text-f1-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" style={{ color: teamColor }} />
          Fun Facts
        </h3>
        <div className="space-y-2">
          {profile.funFacts.slice(0, 3).map((fact, i) => (
            <div
              key={i}
              className="flex gap-2 items-start text-xs text-gray-300 leading-relaxed"
            >
              <span
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                style={{ backgroundColor: `${teamColor}20`, color: teamColor }}
              >
                {i + 1}
              </span>
              <p>{fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* View full profile link */}
      <div className="px-5 pb-5">
        <Link
          href={`/drivers/${profile.driverId}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: `${teamColor}20`,
            border: `1px solid ${teamColor}40`,
          }}
          onClick={onClose}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Full Profile
        </Link>
      </div>
    </motion.div>
  );
}
