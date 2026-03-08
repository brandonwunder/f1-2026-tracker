// =============================================================================
// Jolpica / Ergast-compatible API response types
// =============================================================================

/** Driver information */
export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
}

/** Constructor / team information */
export interface Constructor {
  constructorId: string;
  url?: string;
  name: string;
  nationality?: string;
}

/** Circuit information */
export interface Circuit {
  circuitId: string;
  url?: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

/** A single race on the calendar */
export interface Race {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
  FirstPractice?: SessionTime;
  SecondPractice?: SessionTime;
  ThirdPractice?: SessionTime;
  Qualifying?: SessionTime;
  Sprint?: SessionTime;
}

export interface SessionTime {
  date: string;
  time?: string;
}

/** Individual race result for a driver */
export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: { millis?: string; time?: string };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: { time: string };
    AverageSpeed?: { units: string; speed: string };
  };
}

/** Qualifying result for a driver */
export interface QualifyingResult {
  number: string;
  position: string;
  Driver: Driver;
  Constructor: Constructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

/** Race with results attached */
export interface RaceWithResults extends Race {
  Results?: RaceResult[];
  QualifyingResults?: QualifyingResult[];
}

/** Driver standings entry */
export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

/** Constructor standings entry */
export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

/** Standings list wrapper */
export interface StandingsList {
  season: string;
  round: string;
  DriverStandings?: DriverStanding[];
  ConstructorStandings?: ConstructorStanding[];
}

// =============================================================================
// Jolpica API response wrappers
// =============================================================================

export interface JolpicaResponse<T> {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
  } & T;
}

export interface RaceTableData {
  RaceTable: { season: string; Races: Race[] };
}

export interface RaceResultsTableData {
  RaceTable: { season: string; round: string; Races: RaceWithResults[] };
}

export interface DriverTableData {
  DriverTable: { season: string; Drivers: Driver[] };
}

export interface ConstructorTableData {
  ConstructorTable: { season: string; Constructors: Constructor[] };
}

export interface DriverStandingsData {
  StandingsTable: { season: string; StandingsLists: StandingsList[] };
}

export interface ConstructorStandingsData {
  StandingsTable: { season: string; StandingsLists: StandingsList[] };
}

// =============================================================================
// OpenF1 supplementary types
// =============================================================================

/** Lap timing data from OpenF1 */
export interface LapTime {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  is_pit_out_lap: boolean;
  st_speed: number | null;
  date_start: string;
  meeting_key: number;
  session_key: number;
}

/** Pit stop data from OpenF1 */
export interface PitStop {
  driver_number: number;
  lap_number: number;
  pit_duration: number | null;
  date: string;
  meeting_key: number;
  session_key: number;
}

/** Session info from OpenF1 */
export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  meeting_key: number;
  date_start: string;
  date_end: string;
  year: number;
  country_name: string;
  circuit_short_name: string;
}

// =============================================================================
// Calendar fallback type
// =============================================================================

export interface CalendarRace {
  round: number;
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  date: string;
  time?: string;
}
