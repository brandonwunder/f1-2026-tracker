import type { Driver, DriverStanding } from '@/lib/api/types';

// =============================================================================
// Driver image URL
// =============================================================================

/**
 * F1 media driver codes used in the official CDN URL.
 * Format: first 3 chars of given name + first 3 chars of family name + "01"
 * (lowercased). Some drivers have non-standard codes noted below.
 */
const DRIVER_IMAGE_CODES: Record<string, string> = {
  max_verstappen: 'maxver01',
  hadjar: 'isahad01',
  leclerc: 'chalec01',
  hamilton: 'lewham01',
  russell: 'georus01',
  antonelli: 'andant01',
  norris: 'lannor01',
  piastri: 'oscpia01',
  alonso: 'feralo01',
  stroll: 'lanstr01',
  gasly: 'piegas01',
  colapinto: 'fracol01',
  albon: 'alealb01',
  sainz: 'carsai01',
  lawson: 'lialaw01',
  arvid_lindblad: 'arvlin01',
  ocon: 'estoco01',
  bearman: 'olibea01',
  hulkenberg: 'nichul01',
  bortoleto: 'gabbor01',
  perez: 'serper01',
  bottas: 'valbot01',
};

/**
 * Map our internal team IDs to the team slug used in the F1 media CDN path.
 */
const TEAM_IMAGE_SLUGS: Record<string, string> = {
  red_bull: 'redbullracing',
  ferrari: 'ferrari',
  mercedes: 'mercedes',
  mclaren: 'mclaren',
  aston_martin: 'astonmartin',
  alpine: 'alpine',
  williams: 'williams',
  racing_bulls: 'racingbulls',
  haas: 'haasf1team',
  audi: 'audi',
  cadillac: 'cadillac',
};

/**
 * Construct F1 media CDN headshot URL for a driver.
 *
 * Primary: 2026 official Cloudinary-based URL (720px WebP).
 *   https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000000/common/f1/2026/{team}/{code}/2026{team}{code}right.webp
 *
 * Fallback pattern (OpenF1-style PNG, no team needed):
 *   https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/{LETTER}/{CODE}_{Given}_{Family}/{code}.png.transform/1col/image.png
 */
export function getDriverImageUrl(driver: Driver, teamId?: string): string {
  const driverCode = DRIVER_IMAGE_CODES[driver.driverId];
  const teamSlug = teamId ? TEAM_IMAGE_SLUGS[teamId] : undefined;

  // If we have both the driver code and team, use the primary 2026 CDN URL
  if (driverCode && teamSlug) {
    return `https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000000/common/f1/2026/${teamSlug}/${driverCode}/2026${teamSlug}${driverCode}right.webp`;
  }

  // Fallback: OpenF1-style headshot URL (works without team context)
  if (driverCode) {
    const upper = driverCode.toUpperCase().replace(/\d+$/, '01');
    const letter = driver.givenName.charAt(0).toUpperCase();
    return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${letter}/${upper}_${driver.givenName}_${driver.familyName}/${driverCode}.png.transform/1col/image.png`;
  }

  // Last resort: generate the code from name (first3 + last3 + 01)
  const first3 = driver.givenName.replace(/\s+/g, '').substring(0, 3).toLowerCase();
  const last3 = driver.familyName.replace(/\s+/g, '').substring(0, 3).toLowerCase();
  const generatedCode = `${first3}${last3}01`;
  const letter = driver.givenName.charAt(0).toUpperCase();
  const upper = generatedCode.toUpperCase().replace(/\d+$/, '01');
  return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${letter}/${upper}_${driver.givenName}_${driver.familyName}/${generatedCode}.png.transform/1col/image.png`;
}

/**
 * Build the 2026 CDN headshot URL from a driver profile's driverId and teamId.
 * Useful in server components that have profile data but not a full Driver object.
 */
export function getDriverProfileImageUrl(
  driverId: string,
  teamId: string,
  firstName: string,
  lastName: string,
): string {
  const driverCode = DRIVER_IMAGE_CODES[driverId];
  const teamSlug = TEAM_IMAGE_SLUGS[teamId];

  if (driverCode && teamSlug) {
    return `https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000000/common/f1/2026/${teamSlug}/${driverCode}/2026${teamSlug}${driverCode}right.webp`;
  }

  // Fallback
  const code = driverCode ?? `${firstName.substring(0, 3).toLowerCase()}${lastName.substring(0, 3).toLowerCase()}01`;
  const letter = firstName.charAt(0).toUpperCase();
  const upper = code.toUpperCase().replace(/\d+$/, '01');
  return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${letter}/${upper}_${firstName}_${lastName}/${code}.png.transform/1col/image.png`;
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
