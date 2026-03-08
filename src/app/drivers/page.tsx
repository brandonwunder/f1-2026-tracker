import { getDriverStandings } from '@/lib/api';
import type { DriverStanding } from '@/lib/api/types';
import { getAllDriverProfiles } from '@/lib/data/driver-profiles';
import { TEAMS } from '@/lib/constants/teams';
import DriverGrid from '@/components/drivers/DriverGrid';
import { PageTransition } from '@/components/ui/MotionWrappers';

/**
 * Build a DriverStanding-compatible object from our hardcoded profile data.
 * Used as fallback when API standings are not available.
 */
function profileToStanding(
  profile: ReturnType<typeof getAllDriverProfiles>[number],
  position: number
): DriverStanding {
  const team = TEAMS[profile.teamId];
  return {
    position: String(position),
    positionText: String(position),
    points: '0',
    wins: '0',
    Driver: {
      driverId: profile.driverId,
      permanentNumber: String(profile.number),
      code: profile.code,
      givenName: profile.firstName,
      familyName: profile.lastName,
      dateOfBirth: profile.dateOfBirth,
      nationality: profile.nationality,
    },
    Constructors: [
      {
        constructorId: profile.teamId,
        name: team?.name ?? profile.teamId,
      },
    ],
  };
}

export default async function DriversPage() {
  const standings = await getDriverStandings();
  const profiles = getAllDriverProfiles();

  // If API has standings, merge profile data with standings.
  // If not, create standings from profiles with 0 points.
  let displayStandings: DriverStanding[];

  if (standings.length > 0) {
    // Start with API standings
    const standingsMap = new Map(
      standings.map((s) => [s.Driver.driverId, s])
    );

    // Add any profile drivers not in the API standings
    let pos = standings.length;
    for (const profile of profiles) {
      if (!standingsMap.has(profile.driverId)) {
        pos++;
        standingsMap.set(profile.driverId, profileToStanding(profile, pos));
      }
    }

    displayStandings = Array.from(standingsMap.values());
  } else {
    // No API data — show all drivers from profiles in team order
    displayStandings = profiles.map((p, i) => profileToStanding(p, i + 1));
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-f1-red rounded-full shadow-[0_0_12px_rgba(225,6,0,0.4)]" />
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            <span className="text-f1-red">DRIVER</span> LINEUP
          </h1>
          <p className="text-f1-muted text-sm mt-1 font-medium tracking-wide uppercase">
            2026 Championship Standings
          </p>
        </div>
        <div className="broadcast-divider" />

        <DriverGrid standings={displayStandings} />
      </div>
    </PageTransition>
  );
}
