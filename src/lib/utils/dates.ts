import type { Race, CalendarRace } from "@/lib/api/types";

// =============================================================================
// Country to flag emoji mapping for F1 calendar countries
// =============================================================================

const COUNTRY_FLAGS: Record<string, string> = {
  "Bahrain": "\u{1F1E7}\u{1F1ED}",
  "Saudi Arabia": "\u{1F1F8}\u{1F1E6}",
  "Australia": "\u{1F1E6}\u{1F1FA}",
  "Japan": "\u{1F1EF}\u{1F1F5}",
  "China": "\u{1F1E8}\u{1F1F3}",
  "USA": "\u{1F1FA}\u{1F1F8}",
  "Italy": "\u{1F1EE}\u{1F1F9}",
  "Monaco": "\u{1F1F2}\u{1F1E8}",
  "Spain": "\u{1F1EA}\u{1F1F8}",
  "Canada": "\u{1F1E8}\u{1F1E6}",
  "Austria": "\u{1F1E6}\u{1F1F9}",
  "UK": "\u{1F1EC}\u{1F1E7}",
  "Belgium": "\u{1F1E7}\u{1F1EA}",
  "Hungary": "\u{1F1ED}\u{1F1FA}",
  "Netherlands": "\u{1F1F3}\u{1F1F1}",
  "Azerbaijan": "\u{1F1E6}\u{1F1FF}",
  "Singapore": "\u{1F1F8}\u{1F1EC}",
  "Mexico": "\u{1F1F2}\u{1F1FD}",
  "Brazil": "\u{1F1E7}\u{1F1F7}",
  "Qatar": "\u{1F1F6}\u{1F1E6}",
  "UAE": "\u{1F1E6}\u{1F1EA}",
  "United States": "\u{1F1FA}\u{1F1F8}",
  "United Kingdom": "\u{1F1EC}\u{1F1E7}",
  "Great Britain": "\u{1F1EC}\u{1F1E7}",
};

/**
 * Get flag emoji for a country name.
 */
export function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? "\u{1F3C1}";
}

/**
 * Format a race date string into a human-readable format.
 * e.g. "2026-03-08" -> "Mar 8"
 */
export function formatRaceDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a race date with the full weekday.
 * e.g. "2026-03-08" -> "Sunday, March 8"
 */
export function formatRaceDateLong(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export type RaceStatus = "past" | "next" | "future";

/**
 * Determine if a race is past, next, or future based on today's date.
 */
export function getRaceStatus(
  raceDate: string,
  isNextRace: boolean
): RaceStatus {
  if (isNextRace) return "next";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const race = new Date(raceDate + "T00:00:00");
  return race < today ? "past" : "future";
}

/**
 * Find the next upcoming race from a list of races.
 * Returns the first race whose date is today or in the future.
 */
export function getNextRace<T extends { date: string }>(
  races: T[]
): T | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const race of races) {
    const raceDate = new Date(race.date + "T00:00:00");
    if (raceDate >= today) {
      return race;
    }
  }
  // All races are in the past - season is over
  return null;
}

/**
 * Calculate countdown values from now until a target date.
 */
export function getCountdownValues(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const total = target - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total };
}

/**
 * Normalize a Race (from API) or CalendarRace (from fallback) into a common shape.
 */
export function normalizeRace(
  race: Race | CalendarRace
): {
  round: string;
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  date: string;
  time?: string;
} {
  if ("Circuit" in race) {
    // API Race type
    return {
      round: race.round,
      raceName: race.raceName,
      circuitName: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
      date: race.date,
      time: race.time,
    };
  }
  // CalendarRace fallback type
  return {
    round: String(race.round),
    raceName: race.raceName,
    circuitName: race.circuitName,
    locality: race.locality,
    country: race.country,
    date: race.date,
    time: race.time,
  };
}
