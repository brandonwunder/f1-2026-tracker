import type { Driver, DriverStanding } from '@/lib/api/types';

// =============================================================================
// Driver image URL
// =============================================================================

/**
 * Construct F1 media CDN headshot URL for a driver.
 * Pattern: https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2025Drivers/{firstName}{lastName}.jpg
 */
export function getDriverImageUrl(driver: Driver): string {
  const first = driver.givenName.replace(/\s+/g, '');
  const last = driver.familyName.replace(/\s+/g, '');
  return `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2025Drivers/${first}${last}.jpg`;
}

/**
 * Get driver initials for the fallback avatar.
 */
export function getDriverInitials(driver: Driver): string {
  return `${driver.givenName.charAt(0)}${driver.familyName.charAt(0)}`;
}

// =============================================================================
// Nationality to flag emoji mapping
// =============================================================================

const NATIONALITY_FLAGS: Record<string, string> = {
  British: '\u{1F1EC}\u{1F1E7}',
  Dutch: '\u{1F1F3}\u{1F1F1}',
  Spanish: '\u{1F1EA}\u{1F1F8}',
  Monegasque: '\u{1F1F2}\u{1F1E8}',
  Mexican: '\u{1F1F2}\u{1F1FD}',
  Australian: '\u{1F1E6}\u{1F1FA}',
  French: '\u{1F1EB}\u{1F1F7}',
  German: '\u{1F1E9}\u{1F1EA}',
  Finnish: '\u{1F1EB}\u{1F1EE}',
  Canadian: '\u{1F1E8}\u{1F1E6}',
  Japanese: '\u{1F1EF}\u{1F1F5}',
  Thai: '\u{1F1F9}\u{1F1ED}',
  Chinese: '\u{1F1E8}\u{1F1F3}',
  Danish: '\u{1F1E9}\u{1F1F0}',
  American: '\u{1F1FA}\u{1F1F8}',
  Italian: '\u{1F1EE}\u{1F1F9}',
  Argentine: '\u{1F1E6}\u{1F1F7}',
  Brazilian: '\u{1F1E7}\u{1F1F7}',
  'New Zealander': '\u{1F1F3}\u{1F1FF}',
  Austrian: '\u{1F1E6}\u{1F1F9}',
  Swiss: '\u{1F1E8}\u{1F1ED}',
  Belgian: '\u{1F1E7}\u{1F1EA}',
  Polish: '\u{1F1F5}\u{1F1F1}',
  Swedish: '\u{1F1F8}\u{1F1EA}',
  Indian: '\u{1F1EE}\u{1F1F3}',
  Russian: '\u{1F1F7}\u{1F1FA}',
  Indonesian: '\u{1F1EE}\u{1F1E9}',
  'South African': '\u{1F1FF}\u{1F1E6}',
  Colombian: '\u{1F1E8}\u{1F1F4}',
  Venezuelan: '\u{1F1FB}\u{1F1EA}',
  Portuguese: '\u{1F1F5}\u{1F1F9}',
  'South Korean': '\u{1F1F0}\u{1F1F7}',
};

export function getDriverCountryFlag(nationality: string | undefined): string {
  if (!nationality) return '\u{1F3C1}';
  return NATIONALITY_FLAGS[nationality] ?? '\u{1F3C1}';
}

// =============================================================================
// Sorting functions
// =============================================================================

export type SortOption = 'points' | 'wins' | 'team' | 'name';

export function sortDriverStandings(
  standings: DriverStanding[],
  sortBy: SortOption
): DriverStanding[] {
  const sorted = [...standings];

  switch (sortBy) {
    case 'points':
      return sorted.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
    case 'wins':
      return sorted.sort((a, b) => {
        const winDiff = parseInt(b.wins) - parseInt(a.wins);
        if (winDiff !== 0) return winDiff;
        return parseFloat(b.points) - parseFloat(a.points);
      });
    case 'team':
      return sorted.sort((a, b) => {
        const teamA = a.Constructors[0]?.name ?? '';
        const teamB = b.Constructors[0]?.name ?? '';
        const teamCompare = teamA.localeCompare(teamB);
        if (teamCompare !== 0) return teamCompare;
        return parseFloat(b.points) - parseFloat(a.points);
      });
    case 'name':
      return sorted.sort((a, b) =>
        a.Driver.familyName.localeCompare(b.Driver.familyName)
      );
    default:
      return sorted;
  }
}

// =============================================================================
// Constructor ID mapping
// =============================================================================

/**
 * Map Jolpica constructor IDs to our internal team IDs used in teams.ts.
 */
const CONSTRUCTOR_TO_TEAM: Record<string, string> = {
  red_bull: 'red_bull',
  ferrari: 'ferrari',
  mercedes: 'mercedes',
  mclaren: 'mclaren',
  aston_martin: 'aston_martin',
  alpine: 'alpine',
  williams: 'williams',
  rb: 'racing_bulls',
  alphatauri: 'racing_bulls',
  haas: 'haas',
  sauber: 'audi',
  kick_sauber: 'audi',
  cadillac: 'cadillac',
};

export function getTeamIdFromConstructor(constructorId: string): string {
  return CONSTRUCTOR_TO_TEAM[constructorId] ?? constructorId;
}
