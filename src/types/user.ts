export interface MatchRecord {
  id: string;
  date: string;
  mode: 'vs_bot' | 'pass_and_play' | 'quick_rush' | 'online_sim';
  playersCount: 2 | 3 | 4;
  rank: 1 | 2 | 3 | 4;
  coinsEarned: number;
  xpEarned: number;
  durationSeconds: number;
  winnerName: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rewardCoins: number;
}

export interface FriendItem {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  status: 'online' | 'in_game' | 'offline';
  level: number;
  lastGiftSent?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  rewardCoins?: number;
  claimed?: boolean;
  type: 'gift' | 'system' | 'challenge';
}

export interface DailyRewardState {
  currentDay: number;
  lastClaimedDate: string;
  streak: number;
}

export interface GameSettings {
  sfxVolume: number;
  bgmVolume: number;
  vibration: boolean;
  fastMode: boolean;
}

export interface UserProfile {
  phoneNumber: string;
  name: string;
  pin: string;
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
  coins: number;
  diamonds: number;
  xp: number;
  level: number;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    captures: number;
    sixesRolled: number;
    currentStreak: number;
    bestStreak: number;
  };
  inventory: {
    equippedDice: string;
    equippedPawn: string;
    unlockedDice: string[];
    unlockedPawns: string[];
  };
  matchHistory: MatchRecord[];
  achievements: Achievement[];
  friends: FriendItem[];
  notifications: NotificationItem[];
  dailyReward: DailyRewardState;
  settings: GameSettings;
}

export interface ShopItem {
  id: string;
  type: 'dice' | 'pawn';
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'diamonds';
  previewColor: string;
  previewAccent: string;
  badge?: string;
}
