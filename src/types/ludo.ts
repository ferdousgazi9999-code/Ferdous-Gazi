export type PlayerColor = 'RED' | 'GREEN' | 'YELLOW' | 'BLUE';

export type GameMode = 'vs_bot' | 'pass_and_play' | 'quick_rush' | 'online_sim';

export type BotDifficulty = 'easy' | 'medium' | 'master';

export interface Pawn {
  id: string; // e.g. "RED_0", "GREEN_2"
  color: PlayerColor;
  index: number; // 0, 1, 2, 3
  step: number; // -1 = In Base, 0 = At Start Tile, 1..50 = On Outer Track, 51..55 = In Home Lane, 56 = HOME!
  isHome: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  avatar: string;
  phoneNumber?: string;
  pawns: Pawn[];
  consecutiveSixes: number;
  rank?: number; // 1, 2, 3, 4 when finished
  activeEmote?: { text: string; timestamp: number };
}

export interface BoardCoordinate {
  row: number; // 0 to 14
  col: number; // 0 to 14
}

export type GameStatus = 'SETUP' | 'ROLLING' | 'WAITING_MOVE' | 'MOVING' | 'CELEBRATING' | 'FINISHED';

export interface LudoGameState {
  mode: GameMode;
  botDifficulty: BotDifficulty;
  playersCount: 2 | 3 | 4;
  players: Player[];
  activePlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  canRoll: boolean;
  status: GameStatus;
  movablePawnIds: string[];
  winnerPodium: PlayerColor[];
  turnTimerSeconds: number;
  lastActionMessage: string;
  quickMode: boolean; // First to 2 pawns wins
  soundMuted: boolean;
}
