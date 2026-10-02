import { BoardCoordinate, Pawn, Player, PlayerColor } from '../types/ludo';

/**
 * 15x15 Ludo Board Layout Coordinates
 * Standard clockwise 52-cell track starting from Red's start square at (6, 1)
 */
export const TRACK_COORDINATES: BoardCoordinate[] = [
  // 0: Red Start
  { row: 6, col: 1 },
  { row: 6, col: 2 },
  { row: 6, col: 3 },
  { row: 6, col: 4 },
  { row: 6, col: 5 },
  // 5: Going up top arm (left side)
  { row: 5, col: 6 },
  { row: 4, col: 6 },
  { row: 3, col: 6 },
  { row: 2, col: 6 }, // 8: Star Safe
  { row: 1, col: 6 },
  { row: 0, col: 6 },
  // 11: Top arm apex
  { row: 0, col: 7 },
  // 12: Going down top arm (right side)
  { row: 0, col: 8 },
  { row: 1, col: 8 }, // 13: Green Start
  { row: 2, col: 8 },
  { row: 3, col: 8 },
  { row: 4, col: 8 },
  { row: 5, col: 8 },
  // 18: Going right into right arm (top side)
  { row: 6, col: 9 },
  { row: 6, col: 10 },
  { row: 6, col: 11 },
  { row: 6, col: 12 }, // 21: Star Safe
  { row: 6, col: 13 },
  { row: 6, col: 14 },
  // 24: Right arm apex
  { row: 7, col: 14 },
  // 25: Going left into right arm (bottom side)
  { row: 8, col: 14 },
  { row: 8, col: 13 }, // 26: Yellow Start
  { row: 8, col: 12 },
  { row: 8, col: 11 },
  { row: 8, col: 10 },
  { row: 8, col: 9 },
  // 31: Going down bottom arm (right side)
  { row: 9, col: 8 },
  { row: 10, col: 8 },
  { row: 11, col: 8 },
  { row: 12, col: 8 }, // 34: Star Safe
  { row: 13, col: 8 },
  { row: 14, col: 8 },
  // 37: Bottom arm apex
  { row: 14, col: 7 },
  // 38: Going up bottom arm (left side)
  { row: 14, col: 6 },
  { row: 13, col: 6 }, // 39: Blue Start
  { row: 12, col: 6 },
  { row: 11, col: 6 },
  { row: 10, col: 6 },
  { row: 9, col: 6 },
  // 44: Going left into left arm (bottom side)
  { row: 8, col: 5 },
  { row: 8, col: 4 },
  { row: 8, col: 3 },
  { row: 8, col: 2 }, // 47: Star Safe
  { row: 8, col: 1 },
  { row: 8, col: 0 },
  // 50: Left arm apex
  { row: 7, col: 0 },
  // 51: Leading into Red home row
  { row: 6, col: 0 },
];

/**
 * 8 Safe Star indices on the main 52-cell track
 * 4 starting tiles (0, 13, 26, 39) + 4 intermediate safe stars (8, 21, 34, 47)
 */
export const SAFE_TRACK_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

export interface ColorDetails {
  color: PlayerColor;
  name: string;
  badge: string;
  themeColor: string;
  darkColor: string;
  lightColor: string;
  trackStartIndex: number;
  homeGateIndex: number;
  baseCoords: BoardCoordinate[];
  homePathCoords: BoardCoordinate[];
  homeCenterCoord: BoardCoordinate;
}

export const COLOR_CONFIGS: Record<PlayerColor, ColorDetails> = {
  RED: {
    color: 'RED',
    name: 'Red Stallion',
    badge: '🔴',
    themeColor: '#ef4444',
    darkColor: '#991b1b',
    lightColor: '#fee2e2',
    trackStartIndex: 0, // (6, 1)
    homeGateIndex: 50,
    baseCoords: [
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
    ],
    // 5 steps inside Red Home row: row 7, cols 1..5
    homePathCoords: [
      { row: 7, col: 1 },
      { row: 7, col: 2 },
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 7, col: 5 },
    ],
    homeCenterCoord: { row: 7, col: 6 },
  },
  GREEN: {
    color: 'GREEN',
    name: 'Emerald Tiger',
    badge: '🟢',
    themeColor: '#10b981',
    darkColor: '#065f46',
    lightColor: '#d1fae5',
    trackStartIndex: 13, // (1, 8)
    homeGateIndex: 11,
    baseCoords: [
      { row: 2, col: 11 },
      { row: 2, col: 12 },
      { row: 3, col: 11 },
      { row: 3, col: 12 },
    ],
    // 5 steps inside Green Home column: col 7, rows 1..5
    homePathCoords: [
      { row: 1, col: 7 },
      { row: 2, col: 7 },
      { row: 3, col: 7 },
      { row: 4, col: 7 },
      { row: 5, col: 7 },
    ],
    homeCenterCoord: { row: 6, col: 7 },
  },
  YELLOW: {
    color: 'YELLOW',
    name: 'Golden Falcon',
    badge: '🟡',
    themeColor: '#f59e0b',
    darkColor: '#92400e',
    lightColor: '#fef3c7',
    trackStartIndex: 26, // (8, 13)
    homeGateIndex: 24,
    baseCoords: [
      { row: 11, col: 11 },
      { row: 11, col: 12 },
      { row: 12, col: 11 },
      { row: 12, col: 12 },
    ],
    // 5 steps inside Yellow Home row: row 7, cols 13 down to 9
    homePathCoords: [
      { row: 7, col: 13 },
      { row: 7, col: 12 },
      { row: 7, col: 11 },
      { row: 7, col: 10 },
      { row: 7, col: 9 },
    ],
    homeCenterCoord: { row: 7, col: 8 },
  },
  BLUE: {
    color: 'BLUE',
    name: 'Azure Dragon',
    badge: '🔵',
    themeColor: '#3b82f6',
    darkColor: '#1e40af',
    lightColor: '#dbeafe',
    trackStartIndex: 39, // (13, 6)
    homeGateIndex: 37,
    baseCoords: [
      { row: 11, col: 2 },
      { row: 11, col: 3 },
      { row: 12, col: 2 },
      { row: 12, col: 3 },
    ],
    // 5 steps inside Blue Home column: col 7, rows 13 down to 9
    homePathCoords: [
      { row: 13, col: 7 },
      { row: 12, col: 7 },
      { row: 11, col: 7 },
      { row: 10, col: 7 },
      { row: 9, col: 7 },
    ],
    homeCenterCoord: { row: 8, col: 7 },
  },
};

/**
 * Get board coordinate for a pawn
 */
export function getPawnBoardCoordinate(pawn: Pawn): BoardCoordinate {
  const config = COLOR_CONFIGS[pawn.color];

  // Base slot
  if (pawn.step === -1) {
    return config.baseCoords[pawn.index];
  }

  // Home triangle center
  if (pawn.step === 56) {
    return config.homeCenterCoord;
  }

  // Home lane path (steps 51 to 55)
  if (pawn.step >= 51 && pawn.step <= 55) {
    return config.homePathCoords[pawn.step - 51];
  }

  // Main 52-cell track (steps 0 to 50)
  const trackIndex = (config.trackStartIndex + pawn.step) % 52;
  return TRACK_COORDINATES[trackIndex];
}

/**
 * Returns the global track index (0..51) if the pawn is on the main track, or null if in base/home
 */
export function getPawnTrackIndex(pawn: Pawn): number | null {
  if (pawn.step >= 0 && pawn.step <= 50) {
    const config = COLOR_CONFIGS[pawn.color];
    return (config.trackStartIndex + pawn.step) % 52;
  }
  return null;
}

/**
 * Check if a global track coordinate is a safe star
 */
export function isSafeCoordinate(row: number, col: number): boolean {
  for (const trackIdx of SAFE_TRACK_INDICES) {
    const coord = TRACK_COORDINATES[trackIdx];
    if (coord.row === row && coord.col === col) {
      return true;
    }
  }
  return false;
}

/**
 * Check which pawns can legally move with the given rolled dice value
 */
export function getMovablePawns(player: Player, diceValue: number): Pawn[] {
  if (player.rank !== undefined) {
    return []; // Already completed
  }

  return player.pawns.filter((pawn) => {
    // Pawn in base requires a 6 to move out to step 0
    if (pawn.step === -1) {
      return diceValue === 6;
    }

    // Pawn already home cannot move
    if (pawn.step === 56 || pawn.isHome) {
      return false;
    }

    // Must not exceed step 56 (exact roll required for home)
    return pawn.step + diceValue <= 56;
  });
}

/**
 * Check if landing on this step causes a capture
 */
export function findCapturablePawns(
  movingPawn: Pawn,
  targetStep: number,
  allPlayers: Player[]
): Pawn[] {
  // Only pawns on the outer track (steps 0..50) can capture or be captured
  if (targetStep < 0 || targetStep > 50) {
    return [];
  }

  const config = COLOR_CONFIGS[movingPawn.color];
  const targetTrackIndex = (config.trackStartIndex + targetStep) % 52;

  // Safe star squares cannot be captured
  if (SAFE_TRACK_INDICES.has(targetTrackIndex)) {
    return [];
  }

  const captured: Pawn[] = [];
  for (const otherPlayer of allPlayers) {
    if (otherPlayer.color === movingPawn.color) continue;

    for (const otherPawn of otherPlayer.pawns) {
      const otherTrackIdx = getPawnTrackIndex(otherPawn);
      if (otherTrackIdx !== null && otherTrackIdx === targetTrackIndex) {
        captured.push(otherPawn);
      }
    }
  }

  return captured;
}

/**
 * Smart AI bot decision engine
 */
export function selectBestBotMove(
  botPlayer: Player,
  diceValue: number,
  allPlayers: Player[],
  difficulty: 'easy' | 'medium' | 'master'
): Pawn | null {
  const movable = getMovablePawns(botPlayer, diceValue);
  if (movable.length === 0) return null;
  if (movable.length === 1) return movable[0];

  // In easy mode, pick a random legal move
  if (difficulty === 'easy') {
    return movable[Math.floor(Math.random() * movable.length)];
  }

  let bestPawn = movable[0];
  let bestScore = -Infinity;

  for (const pawn of movable) {
    let score = 0;
    const targetStep = pawn.step === -1 ? 0 : pawn.step + diceValue;

    // 1. Reaching home is the ultimate goal!
    if (targetStep === 56) {
      score += 150;
    }

    // 2. Capturing an opponent gives massive advantage + extra roll
    const captures = findCapturablePawns(pawn, targetStep, allPlayers);
    if (captures.length > 0) {
      score += 120 * captures.length;
    }

    // 3. Moving out of base on a 6 is high priority
    if (pawn.step === -1 && diceValue === 6) {
      score += 90;
    }

    // 4. Landing on a safe star protects the pawn
    if (targetStep >= 0 && targetStep <= 50) {
      const config = COLOR_CONFIGS[pawn.color];
      const targetTrackIdx = (config.trackStartIndex + targetStep) % 52;
      if (SAFE_TRACK_INDICES.has(targetTrackIdx)) {
        score += 60;
      }
    }

    // 5. Entering the safe home lane (steps 51..55)
    if (targetStep >= 51 && targetStep < 56) {
      score += 70;
    }

    // 6. Escaping vulnerability (if currently on an unsafe tile with an opponent nearby)
    const currentTrackIdx = getPawnTrackIndex(pawn);
    if (currentTrackIdx !== null && !SAFE_TRACK_INDICES.has(currentTrackIdx)) {
      // Check if an enemy is 1..6 steps behind us
      let threatened = false;
      for (const otherPlayer of allPlayers) {
        if (otherPlayer.color === pawn.color) continue;
        for (const opPawn of otherPlayer.pawns) {
          const opTrackIdx = getPawnTrackIndex(opPawn);
          if (opTrackIdx !== null) {
            const dist = (currentTrackIdx - opTrackIdx + 52) % 52;
            if (dist >= 1 && dist <= 6) {
              threatened = true;
              break;
            }
          }
        }
        if (threatened) break;
      }
      if (threatened) {
        score += 45;
      }
    }

    // 7. General forward progress bonus
    score += targetStep * 0.8;

    // Slight variance in medium vs master
    const jitter = difficulty === 'medium' ? (Math.random() * 20 - 10) : (Math.random() * 4 - 2);
    score += jitter;

    if (score > bestScore) {
      bestScore = score;
      bestPawn = pawn;
    }
  }

  return bestPawn;
}
