// =============================================================================
// API barrel re-exports
// =============================================================================

// Types
export type {
  Driver,
  Constructor,
  Circuit,
  Race,
  RaceResult,
  QualifyingResult,
  RaceWithResults,
  DriverStanding,
  ConstructorStanding,
  StandingsList,
  LapTime,
  PitStop,
  OpenF1Session,
  CalendarRace,
} from "./types";

// Jolpica API (primary data source)
export {
  getSeasonCalendar,
  getDrivers,
  getConstructors,
  getDriverStandings,
  getConstructorStandings,
  getRaceResults,
  getQualifyingResults,
} from "./jolpica";

// OpenF1 API (supplementary data)
export { getSessions, getLapTimes, getPitStops } from "./openf1";

// Cache constants
export {
  REVALIDATE_RESULTS,
  REVALIDATE_STATIC,
  REVALIDATE_LIVE,
} from "./cache";

// Calendar fallback
export { CALENDAR_2026 } from "../data/calendar-fallback";
