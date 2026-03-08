import { getSeasonCalendar, CALENDAR_2026 } from "@/lib/api";
import RaceCard from "@/components/race/RaceCard";
import CountdownTimer from "@/components/race/CountdownTimer";
import {
  normalizeRace,
  getNextRace,
  getRaceStatus,
} from "@/lib/utils/dates";

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

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">2026 Race Calendar</h1>
        <p className="text-f1-muted mt-1">
          {races.length} races &middot; March &ndash; December 2026
        </p>
      </div>

      {/* Countdown timer for the next race */}
      {nextRace && countdownTarget && (
        <CountdownTimer
          targetDate={countdownTarget}
          raceName={nextRace.raceName}
        />
      )}

      {/* Race grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {races.map((race) => {
          const isNext = race.round === nextRound;
          const status = getRaceStatus(race.date, isNext);

          return (
            <RaceCard
              key={race.round}
              round={race.round}
              raceName={race.raceName}
              circuitName={race.circuitName}
              country={race.country}
              locality={race.locality}
              date={race.date}
              status={status}
            />
          );
        })}
      </div>

      {/* Season complete message */}
      {!nextRace && (
        <div className="rounded-xl bg-f1-surface border border-f1-border p-6 text-center">
          <p className="text-lg font-semibold">Season Complete</p>
          <p className="text-f1-muted text-sm mt-1">
            All 2026 races have been completed. Check out the final standings!
          </p>
        </div>
      )}
    </div>
  );
}
