// =============================================================================
// Prediction store — localStorage-backed persistence for podium predictions
// Now supports multiple players with per-player prediction storage
// =============================================================================

const LEGACY_STORAGE_KEY = "f1-2026-predictions";
const PLAYERS_KEY = "f1-2026-players";
const CURRENT_PLAYER_KEY = "f1-2026-current-player";

/** Storage key for a specific player's predictions */
function playerStorageKey(playerId: string): string {
  return `f1-2026-predictions-${playerId}`;
}

// =============================================================================
// Types
// =============================================================================

/** A user's podium prediction for a single race round */
export interface Prediction {
  round: number;
  p1: string; // driverId
  p2: string;
  p3: string;
  timestamp: number;
  locked: boolean;
}

/** Scoring result for a single prediction */
export interface PredictionScore {
  round: number;
  p1Points: number;
  p2Points: number;
  p3Points: number;
  totalPoints: number;
}

/** A player profile */
export interface Player {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
}

/** Map of round number to prediction */
type PredictionMap = Record<number, Prediction>;

// =============================================================================
// Default players
// =============================================================================

const DEFAULT_PLAYERS: Player[] = [
  { id: "brycen", name: "Brycen", emoji: "\u{1F3CE}\u{FE0F}", createdAt: 0 },
  { id: "mom", name: "Mom", emoji: "\u{1F49C}", createdAt: 1 },
  { id: "dad", name: "Dad", emoji: "\u{1F3C6}", createdAt: 2 },
  { id: "quinn", name: "Quinn", emoji: "\u26A1", createdAt: 3 },
  { id: "kolver", name: "Kolver", emoji: "\u{1F525}", createdAt: 4 },
];

// =============================================================================
// Player management
// =============================================================================

/** Get all players. Initializes defaults + migrates legacy data on first call. */
export function getPlayers(): Player[] {
  if (typeof window === "undefined") return DEFAULT_PLAYERS;

  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    if (raw) {
      return JSON.parse(raw) as Player[];
    }
  } catch {
    // fall through to initialization
  }

  // First visit — initialize default players
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(DEFAULT_PLAYERS));

  // Migrate legacy predictions to Brycen's profile
  migrateLegacyPredictions();

  // Set Brycen as default current player
  if (!localStorage.getItem(CURRENT_PLAYER_KEY)) {
    localStorage.setItem(CURRENT_PLAYER_KEY, "brycen");
  }

  return DEFAULT_PLAYERS;
}

/** Add a new player */
export function addPlayer(name: string, emoji: string): Player {
  const players = getPlayers();
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
  const newPlayer: Player = {
    id,
    name,
    emoji,
    createdAt: Date.now(),
  };
  players.push(newPlayer);
  if (typeof window !== "undefined") {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  }
  return newPlayer;
}

/** Remove a player and their predictions */
export function removePlayer(id: string): void {
  if (typeof window === "undefined") return;
  const players = getPlayers().filter((p) => p.id !== id);
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  localStorage.removeItem(playerStorageKey(id));

  // If the removed player was the current player, switch to the first player
  const current = getCurrentPlayer();
  if (current?.id === id && players.length > 0) {
    setCurrentPlayer(players[0].id);
  }
}

/** Get the current active player */
export function getCurrentPlayer(): Player | null {
  if (typeof window === "undefined") return DEFAULT_PLAYERS[0];

  const players = getPlayers();
  const currentId = localStorage.getItem(CURRENT_PLAYER_KEY);

  if (currentId) {
    const found = players.find((p) => p.id === currentId);
    if (found) return found;
  }

  // Fallback to first player
  if (players.length > 0) {
    localStorage.setItem(CURRENT_PLAYER_KEY, players[0].id);
    return players[0];
  }

  return null;
}

/** Set the current active player */
export function setCurrentPlayer(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_PLAYER_KEY, id);
}

/** Get predictions for a specific player */
export function getPlayerPredictions(playerId: string): Prediction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(playerStorageKey(playerId));
    if (!raw) return [];
    const map = JSON.parse(raw) as PredictionMap;
    return Object.values(map).sort((a, b) => a.round - b.round);
  } catch {
    return [];
  }
}

// =============================================================================
// Legacy migration
// =============================================================================

function migrateLegacyPredictions(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return;
    const legacyMap = JSON.parse(raw) as PredictionMap;
    // Copy to Brycen's profile
    localStorage.setItem(playerStorageKey("brycen"), JSON.stringify(legacyMap));
    // Remove old key
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore migration errors
  }
}

// =============================================================================
// Internal helpers (now player-aware)
// =============================================================================

function loadAll(playerId?: string): PredictionMap {
  if (typeof window === "undefined") return {};
  const id = playerId ?? localStorage.getItem(CURRENT_PLAYER_KEY) ?? "brycen";
  try {
    const raw = localStorage.getItem(playerStorageKey(id));
    if (!raw) return {};
    return JSON.parse(raw) as PredictionMap;
  } catch {
    return {};
  }
}

function saveAll(map: PredictionMap, playerId?: string): void {
  if (typeof window === "undefined") return;
  const id = playerId ?? localStorage.getItem(CURRENT_PLAYER_KEY) ?? "brycen";
  localStorage.setItem(playerStorageKey(id), JSON.stringify(map));
}

// =============================================================================
// Public API (backward-compatible — operates on current player)
// =============================================================================

/** Save (or update) a podium prediction for a given round */
export function savePrediction(
  round: number,
  p1: string,
  p2: string,
  p3: string
): void {
  const map = loadAll();
  const existing = map[round];

  // Don't overwrite a locked prediction
  if (existing?.locked) return;

  map[round] = {
    round,
    p1,
    p2,
    p3,
    timestamp: Date.now(),
    locked: false,
  };
  saveAll(map);
}

/** Retrieve the prediction for a specific round (or null) */
export function getPrediction(round: number): Prediction | null {
  const map = loadAll();
  return map[round] ?? null;
}

/** Get all saved predictions keyed by round */
export function getAllPredictions(): Prediction[] {
  const map = loadAll();
  return Object.values(map).sort((a, b) => a.round - b.round);
}

/** Lock a prediction so it can no longer be edited */
export function lockPrediction(round: number): void {
  const map = loadAll();
  if (map[round]) {
    map[round].locked = true;
    saveAll(map);
  }
}

/** Check whether a round's prediction is locked */
export function isPredictionLocked(round: number): boolean {
  const map = loadAll();
  return map[round]?.locked === true;
}
