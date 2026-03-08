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
  British: '\🇬\🇧',
  Dutch: '\🇳\🇱',
  Spanish: '\🇪\🇸',
  Monegasque: '\🇲\🇨',
  Mexican: '\🇲\🇽',
  Australian: '\🇦\🇺',
  French: '\🇫\🇷',
  German: '\🇩\🇪',
  Finnish: '\🇫\🇮',
  Canadian: '\🇨\🇦',
  Japanese: '\🇯\🇵',
  Thai: '\🇹\🇭',
  Chinese: '\🇨\🇳',
  Danish: '\🇩\🇰',
  American: '\🇺\🇸',
  Italian: '\🇮\🇹',
  Argentine: '\🇦\🇷',
  Brazilian: '\🇧\🇷',
  'New Zealander': '\🇳\🇿',
  Austrian: '\🇦\🇹',
  Swiss: '\🇨\🇭',
  Belgian: '\🇧\🇪',
  Polish: '\🇵\🇱',
  Swedish: '\🇸\🇪',
  Indian: '\🇮\🇳',
  Russian: '\🇷\🇺',
  Indonesian: '\🇮\🇩',
  'South African': '\🇿\🇦',
  Colombian: '\🇨\🇴',
  Venezuelan: '\🇻\🇪',
  Portuguese: '\🇵\🇹',
  'South Korean': '\🇰\🇷',
};

export function getDriverCountryFlag(nationality: string | undefined): string {
  if (!nationality) return '\🏁';
  return NATIONALITY_FLAGS[nationality] ?? '\🏁';
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
