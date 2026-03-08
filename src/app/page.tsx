import {
  getDriverStandings,
  getConstructorStandings,
  getSeasonCalendar,
  getRaceResults,
  CALENDAR_2026,
} from "@/lib/api";
import { getNextRace, normalizeRace } from "@/lib/utils/dates";
import type { RaceWithResults } from "@/lib/api/types";
import NextRaceWidget from "@/components/dashboard/NextRaceWidget";
import StandingsPreview from "@/components/dashboard/StandingsPreview";
import RecentResult from "@/components/dashboard/RecentResult";
import PredictionScoreWidget from "@/components/dashboard/PredictionScoreWidget";
import QuickLinks from "@/components/dashboard/QuickLinks";
import LightsOut from "@/components/dashboard/LightsOut";
import { PageTransition } from "@/components/ui/MotionWrappers";

export default async function DashboardPage() {
  // Fetch all data in parallel
  const [driverStandings, constructorStandings, apiCalendar] =
    await Promise.all([
      getDriverStandings(),
      getConstructorStandings(),
      getSeasonCalendar(),
    ]);

  // Use API calendar if available, otherwise fallback
  const rawCalendar =
    apiCalendar.length > 0
      ? apiCalendar.map(normalizeRace)
      : CALENDAR_2026.map(normalizeRace);

  // Find next race
  const nextRace = getNextRace(rawCalendar);

  // Find the most recent completed race and fetch its results
  let recentResult: RaceWithResults | null = null;
  if (nextRace) {
    const nextRound = parseInt(nextRace.round, 10);
    if (nextRound > 1) {
      recentResult = await getRaceResults(nextRound - 1);
    }
  } else {
    // Season over - try the last race
    const lastRace = rawCalendar[rawCalendar.length - 1];
    if (lastRace) {
      recentResult = await getRaceResults(lastRace.round);
    }
  }

  return (
    <LightsOut>
      <PageTransition>
        <div className="space-y-6">
          {/* Page header */}
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-f1-red rounded-full shadow-[0_0_12px_rgba(225,6,0,0.4)]" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="text-f1-red">RACE</span> COMMAND
            </h1>
            <p className="text-f1-muted text-sm mt-1 font-medium tracking-wide uppercase">
              2026 Formula One Season
            </p>
          </div>
          <div className="broadcast-divider" />

          {/* Next race countdown - full width, prominent */}
          {nextRace ? (
            <NextRaceWidget
              round={nextRace.round}
              raceName={nextRace.raceName}
              circuitName={nextRace.circuitName}
              country={nextRace.country}
              locality={nextRace.locality}
              date={nextRace.date}
              time={nextRace.time}
            />
          ) : (
            <div className="rounded-xl bg-f1-surface border border-f1-border p-6 text-center">
              <p className="text-lg font-semibold text-f1-muted">
                The 2026 season has concluded
              </p>
            </div>
          )}

          {/* Main content grid: standings + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Driver standings preview */}
            <StandingsPreview type="drivers" standings={driverStandings} />

            {/* Constructor standings preview */}
            <StandingsPreview
              type="constructors"
              standings={constructorStandings}
            />

            {/* Right column: recent result + predictions */}
            <div className="space-y-4">
              {recentResult && <RecentResult race={recentResult} />}
              <PredictionScoreWidget />
            </div>
          </div>

          {/* Quick navigation links */}
          <QuickLinks />
        </div>
      </PageTransition>
    </LightsOut>
  );
}
