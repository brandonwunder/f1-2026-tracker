'use client';

import { useState } from 'react';
import type { DriverStanding, ConstructorStanding } from '@/lib/api/types';
import DriverStandings from './DriverStandings';
import ConstructorStandings from './ConstructorStandings';
import DriverProfileModal from '@/components/race/DriverProfileModal';
import TeamProfileModal from '@/components/race/TeamProfileModal';

interface StandingsClientProps {
  driverStandings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
  isPreSeason: boolean;
}

export default function StandingsClient({
  driverStandings,
  constructorStandings,
  isPreSeason,
}: StandingsClientProps) {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-8">
        {/* Pre-season notice */}
        {isPreSeason && (
          <div className="relative rounded-xl glass-card border border-yellow-500/20 overflow-hidden p-4">
            <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <span className="text-2xl">&#x1F3C1;</span>
              <div>
                <p className="text-sm font-bold text-yellow-400">Pre-Season Standings</p>
                <p className="text-xs text-f1-muted mt-0.5">
                  The 2026 season hasn&apos;t started yet. All drivers and teams begin at 0 points. Standings will update automatically after each race.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Driver Championship */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-f1-red" />
            <h2 className="text-[10px] font-black text-f1-red uppercase tracking-[0.2em]">
              Driver Championship
            </h2>
            <div className="flex-1 h-[1px] bg-f1-border/50" />
          </div>
          <DriverStandings
            standings={driverStandings}
            onDriverClick={setSelectedDriverId}
            onTeamClick={setSelectedTeamId}
          />
        </section>

        {/* Constructor Championship */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-f1-red" />
            <h2 className="text-[10px] font-black text-f1-red uppercase tracking-[0.2em]">
              Constructor Championship
            </h2>
            <div className="flex-1 h-[1px] bg-f1-border/50" />
          </div>
          <ConstructorStandings
            standings={constructorStandings}
            driverStandings={driverStandings}
            onDriverClick={setSelectedDriverId}
            onTeamClick={setSelectedTeamId}
          />
        </section>
      </div>

      {/* Modals */}
      <DriverProfileModal
        driverId={selectedDriverId}
        onClose={() => setSelectedDriverId(null)}
      />
      <TeamProfileModal
        teamId={selectedTeamId}
        onClose={() => setSelectedTeamId(null)}
      />
    </>
  );
}
