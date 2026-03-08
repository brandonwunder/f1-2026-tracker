// =============================================================================
// Hardcoded 2026 F1 driver list for prediction dropdowns
// Updated to match the official 2026 FIA entry list.
// =============================================================================

export interface PredictionDriver {
  driverId: string;
  name: string; // "FirstName LastName"
  code: string; // 3-letter abbreviation
  teamId: string; // matches keys in teams.ts
}

export const DRIVERS_2026: PredictionDriver[] = [
  // Red Bull Racing
  { driverId: "max_verstappen", name: "Max Verstappen", code: "VER", teamId: "red_bull" },
  { driverId: "hadjar", name: "Isack Hadjar", code: "HAD", teamId: "red_bull" },
  // Ferrari
  { driverId: "leclerc", name: "Charles Leclerc", code: "LEC", teamId: "ferrari" },
  { driverId: "hamilton", name: "Lewis Hamilton", code: "HAM", teamId: "ferrari" },
  // Mercedes
  { driverId: "russell", name: "George Russell", code: "RUS", teamId: "mercedes" },
  { driverId: "antonelli", name: "Andrea Kimi Antonelli", code: "ANT", teamId: "mercedes" },
  // McLaren
  { driverId: "norris", name: "Lando Norris", code: "NOR", teamId: "mclaren" },
  { driverId: "piastri", name: "Oscar Piastri", code: "PIA", teamId: "mclaren" },
  // Aston Martin
  { driverId: "alonso", name: "Fernando Alonso", code: "ALO", teamId: "aston_martin" },
  { driverId: "stroll", name: "Lance Stroll", code: "STR", teamId: "aston_martin" },
  // Alpine
  { driverId: "gasly", name: "Pierre Gasly", code: "GAS", teamId: "alpine" },
  { driverId: "colapinto", name: "Franco Colapinto", code: "COL", teamId: "alpine" },
  // Williams
  { driverId: "albon", name: "Alexander Albon", code: "ALB", teamId: "williams" },
  { driverId: "sainz", name: "Carlos Sainz", code: "SAI", teamId: "williams" },
  // RB F1 Team (Racing Bulls)
  { driverId: "lawson", name: "Liam Lawson", code: "LAW", teamId: "racing_bulls" },
  { driverId: "arvid_lindblad", name: "Arvid Lindblad", code: "LIN", teamId: "racing_bulls" },
  // Haas
  { driverId: "ocon", name: "Esteban Ocon", code: "OCO", teamId: "haas" },
  { driverId: "bearman", name: "Oliver Bearman", code: "BEA", teamId: "haas" },
  // Audi (Kick Sauber)
  { driverId: "hulkenberg", name: "Nico Hulkenberg", code: "HUL", teamId: "audi" },
  { driverId: "bortoleto", name: "Gabriel Bortoleto", code: "BOR", teamId: "audi" },
  // Cadillac
  { driverId: "perez", name: "Sergio Perez", code: "PER", teamId: "cadillac" },
  { driverId: "bottas", name: "Valtteri Bottas", code: "BOT", teamId: "cadillac" },
];
