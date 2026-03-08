'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, User, Cpu, Trophy, Flag, Zap, Timer, Calendar } from 'lucide-react';
import { getTeamProfile, type TeamProfile } from '@/lib/data/team-profiles';
import { getDriverProfile } from '@/lib/data/driver-profiles';
import { getDriverProfileImageUrl, getDriverCountryFlag } from '@/lib/utils/drivers';
import { TEAMS } from '@/lib/constants/teams';
import TeamLogo from '@/components/ui/TeamLogo';

interface TeamProfileModalProps {
  teamId: string | null;
  onClose: () => void;
}

export default function TeamProfileModal({ teamId, onClose }: TeamProfileModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (teamId) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [teamId, onClose]);

  const profile = teamId ? getTeamProfile(teamId) : undefined;
  const team = teamId ? TEAMS[teamId] : undefined;

  return (
    <AnimatePresence>
      {teamId && profile && team && (
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
          <ModalContent profile={profile} teamColor={team.color} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalContent({
  profile,
  teamColor,
  onClose,
}: {
  profile: TeamProfile;
  teamColor: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-f1-border"
      style={{
        background: `linear-gradient(180deg, ${teamColor}18 0%, #1a1a2e 25%)`,
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

      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${teamColor}30, ${teamColor}10)`,
              border: `2px solid ${teamColor}40`,
            }}
          >
            <TeamLogo teamId={profile.teamId} size={40} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{profile.fullName}</h2>
            <p className="text-sm" style={{ color: teamColor }}>{profile.tagline}</p>
          </div>
        </div>
      </div>

      {/* Team Info Grid */}
      <div className="grid grid-cols-2 gap-2 px-5 mb-4">
        <InfoRow icon={MapPin} label="Base" value={profile.base} teamColor={teamColor} />
        <InfoRow icon={User} label="Team Principal" value={profile.teamPrincipal} teamColor={teamColor} />
        <InfoRow icon={Cpu} label="Power Unit" value={profile.powerUnit} teamColor={teamColor} />
        <InfoRow icon={Calendar} label="First Entry" value={String(profile.firstEntry)} teamColor={teamColor} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-5 mb-4">
        <StatBox icon={Trophy} label="Titles" value={profile.championships} teamColor={teamColor} />
        <StatBox icon={Flag} label="Wins" value={profile.wins} teamColor={teamColor} />
        <StatBox icon={Zap} label="Poles" value={profile.poles} teamColor={teamColor} />
        <StatBox icon={Timer} label="FL" value={profile.fastestLaps} teamColor={teamColor} />
      </div>

      {/* Drivers */}
      <div className="px-5 mb-4">
        <h3 className="text-xs font-semibold text-f1-muted uppercase tracking-wider mb-2">
          2026 Drivers
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {profile.driverIds.map((driverId) => (
            <DriverMiniCard key={driverId} driverId={driverId} teamId={profile.teamId} teamColor={teamColor} onClose={onClose} />
          ))}
        </div>
      </div>

      {/* Facts */}
      <div className="px-5 mb-4">
        <h3 className="text-xs font-semibold text-f1-muted uppercase tracking-wider mb-2">
          Team Facts
        </h3>
        <div className="space-y-2">
          {profile.facts.map((fact, i) => (
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

      {/* Bottom padding */}
      <div className="h-3" />
    </motion.div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  teamColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  teamColor: string;
}) {
  return (
    <div className="glass-card rounded-lg p-2">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className="w-3 h-3" style={{ color: teamColor }} />
        <span className="text-[10px] text-f1-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs text-white font-medium truncate">{value}</p>
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  teamColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  teamColor: string;
}) {
  return (
    <div
      className="glass-card rounded-lg p-2 text-center"
      style={{ borderTop: `2px solid ${teamColor}` }}
    >
      <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: teamColor }} />
      <p className="text-lg font-bold font-orbitron text-white">{value}</p>
      <p className="text-[10px] text-f1-muted uppercase tracking-wider">{label}</p>
    </div>
  );
}

function DriverMiniCard({
  driverId,
  teamId,
  teamColor,
  onClose,
}: {
  driverId: string;
  teamId: string;
  teamColor: string;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const profile = getDriverProfile(driverId);
  if (!profile) return null;

  const imageUrl = getDriverProfileImageUrl(driverId, teamId, profile.firstName, profile.lastName);
  const flag = getDriverCountryFlag(profile.nationality);

  return (
    <Link
      href={`/drivers/${driverId}`}
      onClick={onClose}
      className="glass-card rounded-lg p-3 flex items-center gap-3 hover:bg-f1-surface-hover transition-colors group"
      style={{ borderLeft: `3px solid ${teamColor}` }}
    >
      <div
        className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${teamColor}40, transparent)` }}
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
            className="w-full h-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: teamColor }}
          >
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate group-hover:underline">
          {profile.firstName} {profile.lastName}
        </p>
        <div className="flex items-center gap-1 text-xs text-f1-muted">
          <span>{flag}</span>
          <span>#{profile.number}</span>
          <span style={{ color: teamColor }}>{profile.code}</span>
        </div>
      </div>
    </Link>
  );
}
