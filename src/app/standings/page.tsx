import { getDriverStandings, getConstructorStandings } from '@/lib/api/jolpica';
import type { DriverStanding, ConstructorStanding } from '@/lib/api/types';
import { getAllDriverProfiles } from '@/lib/data/driver-profiles';
import { TEAMS } from '@/lib/constants/teams';
import StandingsClient from '@/components/standings/StandingsClient';
import { PageTransition } from '@/components/ui/MotionWrappers';
import PageBackground from '@/components/ui/PageBackground';

/**
 * Build pre-season driver standings from hardcoded profiles.
 * All drivers start at 0 points, ordered by team.
 */
function buildPreSeasonDriverStandings(): DriverStanding[] {
  const profiles = getAllDriverProfiles();
  return profiles.map((p, i) => {
    const team = TEAMS[p.teamId];
    return {
      position: String(i + 1),
      positionText: String(i + 1),
      points: '0',
      wins: '0',
      Driver: {
        driverId: p.driverId,
        permanentNumber: String(p.number),
        code: p.code,
        givenName: p.firstName,
        familyName: p.lastName,
        dateOfBirth: p.dateOfBirth,
        nationality: p.nationality,
      },
      Constructors: [{
        constructorId: p.teamId,
        name: team?.name ?? p.teamId,
      }],
    };
  });
}

/**
 * Build pre-season constructor standings from TEAMS constant.
 */
function buildPreSeasonConstructorStandings(): ConstructorStanding[] {
  const teamIds = Object.keys(TEAMS);
  return teamIds.map((id, i) => ({
    position: String(i + 1),
    positionText: String(i + 1),
    points: '0',
    wins: '0',
    Constructor: {
      constructorId: id,
      name: TEAMS[id].name,
    },
  }));
}

export default async function StandingsPage() {
  const [apiDriverStandings, apiConstructorStandings] = await Promise.all([
    getDriverStandings(),
    getConstructorStandings(),
  ]);

  const isPreSeason = apiDriverStandings.length === 0;
  const driverStandings = apiDriverStandings.length > 0
    ? apiDriverStandings
    : buildPreSeasonDriverStandings();
  const constructorStandings = apiConstructorStandings.length > 0
    ? apiConstructorStandings
    : buildPreSeasonConstructorStandings();

  return (
    <>
      <PageBackground page="standings" />
      <PageTransition>
        <div className="space-y-8">
          {/* Page header — broadcast style */}
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-f1-red rounded-full shadow-[0_0_12px_rgba(225,6,0,0.4)]" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="text-f1-red">CHAMPIONSHIP</span> STANDINGS
            </h1>
            <p className="text-f1-muted text-sm mt-1 font-medium tracking-wide uppercase">
              2026 Season Leaderboard
            </p>
          </div>
          <div className="broadcast-divider" />

          <StandingsClient
            driverStandings={driverStandings}
            constructorStandings={constructorStandings}
            isPreSeason={isPreSeason}
          />
        </div>
      </PageTransition>
    </>
  );
}
