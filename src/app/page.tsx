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
  const [driverStandings, constructorStandings, apiCalendar] =
    await Promise.all([
      getDriverStandings(),
      getConstructorStandings(),
      getSeasonCalendar(),
    ]);

  const rawCalendar =
    apiCalendar.length > 0
      ? apiCalendar.map(normalizeRace)
      : CALENDAR_2026.map(normalizeRace);

  const nextRace = getNextRace(rawCalendar);

  // Check if the next race actually has results already
  let nextRaceResults: RaceWithResults | null = null;
  if (nextRace) {
    nextRaceResults = await getRaceResults(parseInt(nextRace.round, 10));
  }
  const nextRaceHasResults = (nextRaceResults?.Results?.length ?? 0) > 0;

  // Find the most recent completed race and fetch its results
  let recentResult: RaceWithResults | null = null;
  if (nextRace) {
    const nextRound = parseInt(nextRace.round, 10);
    if (nextRound > 1) {
      recentResult = await getRaceResults(nextRound - 1);
    }
  } else {
    const lastRace = rawCalendar[rawCalendar.length - 1];
    if (lastRace) {
      recentResult = await getRaceResults(lastRace.round);
    }
  }

  return (
    <LightsOut>
      <PageTransition>
        <div className="space-y-8">
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
              hasRaceResults={nextRaceHasResults}
            />
          ) : (
            <div className="relative rounded-2xl bg-[#0D0D16] border border-f1-border overflow-hidden p-8 text-center">
              <div className="absolute inset-0 carbon-fiber opacity-15 pointer-events-none" />
              <div className="relative">
                <p className="text-lg font-black text-f1-muted uppercase tracking-wide">
                  The 2026 season has concluded
                </p>
              </div>
            </div>
          )}

          {/* Section label */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-f1-red" />
            <h2 className="text-[10px] font-black text-f1-red uppercase tracking-[0.2em]">
              Season Overview
            </h2>
            <div className="flex-1 h-[1px] bg-f1-border/50" />
          </div>

          {/* Main content grid: standings + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <StandingsPreview type="drivers" standings={driverStandings} />
            <StandingsPreview
              type="constructors"
              standings={constructorStandings}
            />
            <div className="space-y-5">
              {recentResult && <RecentResult race={recentResult} />}
              <PredictionScoreWidget />
            </div>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-f1-red" />
            <h2 className="text-[10px] font-black text-f1-red uppercase tracking-[0.2em]">
              Quick Access
            </h2>
            <div className="flex-1 h-[1px] bg-f1-border/50" />
          </div>

          {/* Quick navigation links */}
          <QuickLinks />
        </div>
      </PageTransition>
    </LightsOut>
  );
}
