import { getSeasonCalendar, CALENDAR_2026 } from "@/lib/api";
import RaceCard from "@/components/race/RaceCard";
import CountdownTimer from "@/components/race/CountdownTimer";
import {
  normalizeRace,
  getNextRace,
  getRaceStatus,
} from "@/lib/utils/dates";
import { PageTransition, StaggeredGrid, StaggeredItem } from "@/components/ui/MotionWrappers";

export const metadata = {
  title: "Race Calendar | F1 2026 Tracker",
  description: "Full 2026 Formula 1 season calendar with all 24 races",
};

export default async function CalendarPage() {
  // Fetch from API, fall back to hardcoded calendar
  let apiRaces = await getSeasonCalendar();
  const races =
    apiRaces.length > 0
      ? apiRaces.map(normalizeRace)
      : CALENDAR_2026.map(normalizeRace);

  // Determine the next race
  const nextRace = getNextRace(races);
  const nextRound = nextRace?.round ?? null;

  // Build the countdown target date
  const countdownTarget =
    nextRace && nextRace.time
      ? `${nextRace.date}T${nextRace.time}`
      : nextRace
        ? `${nextRace.date}T14:00:00Z`
        : null;

  // Calculate season progress
  const completedRaces = races.filter((race) => {
    const isNext = race.round === nextRound;
    return getRaceStatus(race.date, isNext) === "past";
  }).length;
  const totalRaces = races.length;
  const progressPercent = totalRaces > 0 ? (completedRaces / totalRaces) * 100 : 0;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">2026 Race Calendar</h1>
          <p className="text-f1-muted mt-1">
            {races.length} races &middot; March &ndash; December 2026
          </p>
        </div>

        {/* Season progress bar */}
        <div className="glass-card rounded-xl border border-f1-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-f1-muted uppercase tracking-wider">
              Season Progress
            </span>
            <span className="text-sm font-medium">
              <span className="text-f1-red font-bold">{completedRaces}</span>
              <span className="text-f1-muted"> / {totalRaces} races</span>
            </span>
          </div>
          <div className="w-full h-2 bg-f1-dark rounded-full overflow-hidden border border-f1-border">
            <div
              className="h-full bg-gradient-to-r from-f1-red to-red-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Countdown timer for the next race */}
        {nextRace && countdownTarget && (
          <CountdownTimer
            targetDate={countdownTarget}
            raceName={nextRace.raceName}
          />
        )}

        {/* Race grid */}
        <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {races.map((race) => {
            const isNext = race.round === nextRound;
            const status = getRaceStatus(race.date, isNext);

            return (
              <StaggeredItem key={race.round}>
                <RaceCard
                  round={race.round}
                  raceName={race.raceName}
                  circuitName={race.circuitName}
                  country={race.country}
                  locality={race.locality}
                  date={race.date}
                  status={status}
                />
              </StaggeredItem>
            );
          })}
        </StaggeredGrid>

        {/* Season complete message */}
        {!nextRace && (
          <div className="rounded-xl glass-card border border-f1-border p-6 text-center">
            <p className="text-lg font-semibold">Season Complete</p>
            <p className="text-f1-muted text-sm mt-1">
              All 2026 races have been completed. Check out the final standings!
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
