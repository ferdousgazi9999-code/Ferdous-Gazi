import { Achievement, MatchRecord, UserProfile } from '../types/user';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Crown',
    description: 'Win your first Ludo match in any mode',
    icon: '👑',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rewardCoins: 500,
  },
  {
    id: 'pawn_hunter',
    title: 'Pawn Hunter',
    description: 'Capture 10 opponent pawns in total',
    icon: '🎯',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    rewardCoins: 800,
  },
  {
    id: 'six_master',
    title: 'Six Sensation',
    description: 'Roll a six 25 times',
    icon: '🎲',
    progress: 0,
    maxProgress: 25,
    unlocked: false,
    rewardCoins: 1000,
  },
  {
    id: 'hot_streak',
    title: 'Unstoppable',
    description: 'Achieve a winning streak of 3 games',
    icon: '🔥',
    progress: 0,
    maxProgress: 3,
    unlocked: false,
    rewardCoins: 1500,
  },
  {
    id: 'veteran',
    title: 'Grand Champion',
    description: 'Play 20 total matches in FG Ludu MAX',
    icon: '⚡',
    progress: 0,
    maxProgress: 20,
    unlocked: false,
    rewardCoins: 2500,
  },
];

const DEFAULT_GUEST_PHONE = '+880 1700-000000';

const DEFAULT_FRIENDS = [
  {
    id: 'f_fg',
    name: 'Ferdous Gazi (FG)',
    phoneNumber: '+880 1799-999999',
    avatar: 'avatar_king',
    status: 'online' as const,
    level: 42,
  },
  {
    id: 'f_rahim',
    name: 'Rahim Tiger',
    phoneNumber: '+880 1812-345678',
    avatar: 'avatar_tiger',
    status: 'in_game' as const,
    level: 18,
  },
  {
    id: 'f_elena',
    name: 'Elena Star',
    phoneNumber: '+1 415-555-0199',
    avatar: 'avatar_diamond',
    status: 'offline' as const,
    level: 12,
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    title: 'Welcome to FG Ludu MAX!',
    message: 'Welcome to the premier competitive Ludo arena! Claim your welcome starter gift.',
    date: 'Just now',
    read: false,
    rewardCoins: 500,
    claimed: false,
    type: 'gift' as const,
  },
  {
    id: 'notif_tournament',
    title: 'FG Grand Championship',
    message: 'Compete this week to climb the Leaderboard and win up to 50,000 Coins!',
    date: '1 hour ago',
    read: false,
    type: 'system' as const,
  },
];

export function createDefaultProfile(phoneNumber = DEFAULT_GUEST_PHONE, name = 'Ferdous Star', pin = '1234'): UserProfile {
  return {
    phoneNumber,
    name,
    pin,
    avatar: 'avatar_king',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    coins: 2000,
    diamonds: 30,
    xp: 250,
    level: 1,
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      winRate: 0,
      captures: 0,
      sixesRolled: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
    inventory: {
      equippedDice: 'dice_classic',
      equippedPawn: 'pawn_royal',
      unlockedDice: ['dice_classic'],
      unlockedPawns: ['pawn_royal'],
    },
    matchHistory: [],
    achievements: JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS)),
    friends: DEFAULT_FRIENDS,
    notifications: DEFAULT_NOTIFICATIONS,
    dailyReward: {
      currentDay: 1,
      lastClaimedDate: '',
      streak: 0,
    },
    settings: {
      sfxVolume: 80,
      bgmVolume: 50,
      vibration: true,
      fastMode: false,
    },
  };
}

const STORAGE_KEY_CURRENT_USER = 'fg_ludo_current_user_v1';
const STORAGE_KEY_USERS_DB = 'fg_ludo_users_db_v1';

export class AccountService {
  private static currentUser: UserProfile | null = null;

  static getAllUsers(): Record<string, UserProfile> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('Failed to load users DB', err);
    }
    return {};
  }

  static saveUserToDB(user: UserProfile) {
    try {
      const allUsers = this.getAllUsers();
      allUsers[user.phoneNumber] = user;
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(allUsers));
    } catch (err) {
      console.error('Failed to save to users DB', err);
    }
  }

  static ensureProfileDefaults(user: UserProfile): UserProfile {
    return {
      ...user,
      friends: user.friends || DEFAULT_FRIENDS,
      notifications: user.notifications || DEFAULT_NOTIFICATIONS,
      dailyReward: user.dailyReward || { currentDay: 1, lastClaimedDate: '', streak: 0 },
      settings: user.settings || { sfxVolume: 80, bgmVolume: 50, vibration: true, fastMode: false },
    };
  }

  static getCurrentUser(): UserProfile {
    if (this.currentUser) return this.currentUser;

    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (saved) {
        this.currentUser = this.ensureProfileDefaults(JSON.parse(saved));
        return this.currentUser!;
      }
    } catch (err) {
      console.error('Failed to read current user', err);
    }

    // Default guest profile
    const defaultUser = createDefaultProfile();
    this.currentUser = defaultUser;
    this.saveCurrentUser(defaultUser);
    this.saveUserToDB(defaultUser);
    return defaultUser;
  }

  static saveCurrentUser(user: UserProfile) {
    this.currentUser = this.ensureProfileDefaults(user);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(this.currentUser));
      this.saveUserToDB(this.currentUser);
    } catch (err) {
      console.error('Failed to save current user', err);
    }
  }

  static claimDailyReward(coins: number, diamonds: number = 0): UserProfile {
    const user = this.getCurrentUser();
    const today = new Date().toDateString();
    const nextDay = user.dailyReward.currentDay >= 7 ? 1 : user.dailyReward.currentDay + 1;

    const updated: UserProfile = {
      ...user,
      coins: user.coins + coins,
      diamonds: user.diamonds + diamonds,
      dailyReward: {
        currentDay: nextDay,
        lastClaimedDate: today,
        streak: user.dailyReward.streak + 1,
      },
    };
    this.saveCurrentUser(updated);
    return updated;
  }

  static sendFriendGift(friendId: string): { success: boolean; message: string; user?: UserProfile } {
    const user = this.getCurrentUser();
    const friend = user.friends.find((f) => f.id === friendId);
    if (!friend) return { success: false, message: 'Friend not found.' };

    const today = new Date().toDateString();
    if (friend.lastGiftSent === today) {
      return { success: false, message: 'Gift already sent to this friend today!' };
    }

    const updatedFriends = user.friends.map((f) =>
      f.id === friendId ? { ...f, lastGiftSent: today } : f
    );

    const updated: UserProfile = {
      ...user,
      friends: updatedFriends,
    };
    this.saveCurrentUser(updated);
    return { success: true, message: `Sent 100 🪙 gift to ${friend.name}!`, user: updated };
  }

  static addFriend(name: string, phoneNumber: string): { success: boolean; message: string; user?: UserProfile } {
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 6) {
      return { success: false, message: 'Enter a valid phone number.' };
    }
    const user = this.getCurrentUser();
    if (user.friends.some((f) => f.phoneNumber === cleanPhone)) {
      return { success: false, message: 'Friend with this phone number already in your list!' };
    }

    const newFriend = {
      id: 'f_' + Date.now(),
      name: name.trim() || 'Ludo Buddy',
      phoneNumber: cleanPhone,
      avatar: 'avatar_falcon',
      status: 'online' as const,
      level: Math.floor(Math.random() * 15) + 3,
    };

    const updated: UserProfile = {
      ...user,
      friends: [newFriend, ...user.friends],
    };
    this.saveCurrentUser(updated);
    return { success: true, message: `Added ${newFriend.name} to friends!`, user: updated };
  }

  static claimNotification(notifId: string): UserProfile {
    const user = this.getCurrentUser();
    let bonusCoins = 0;

    const updatedNotifs = user.notifications.map((n) => {
      if (n.id === notifId) {
        if (n.rewardCoins && !n.claimed) {
          bonusCoins = n.rewardCoins;
        }
        return { ...n, read: true, claimed: true };
      }
      return n;
    });

    const updated: UserProfile = {
      ...user,
      coins: user.coins + bonusCoins,
      notifications: updatedNotifs,
    };
    this.saveCurrentUser(updated);
    return updated;
  }

  static updateSettings(settings: Partial<UserProfile['settings']>): UserProfile {
    const user = this.getCurrentUser();
    const updated: UserProfile = {
      ...user,
      settings: {
        ...user.settings,
        ...settings,
      },
    };
    this.saveCurrentUser(updated);
    return updated;
  }

  static register(phoneNumber: string, name: string, pin: string, avatar: string): { success: boolean; message: string; user?: UserProfile } {
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 6) {
      return { success: false, message: 'Please enter a valid phone number (at least 6 digits).' };
    }
    if (!name.trim()) {
      return { success: false, message: 'Please enter your player name.' };
    }
    if (!pin || pin.length < 4) {
      return { success: false, message: 'PIN must be at least 4 digits.' };
    }

    const allUsers = this.getAllUsers();
    if (allUsers[cleanPhone]) {
      return { success: false, message: 'An account with this phone number already exists. Please log in instead.' };
    }

    // Transfer guest progress if upgrading
    const prev = this.getCurrentUser();
    const newUser: UserProfile = {
      ...prev,
      phoneNumber: cleanPhone,
      name: name.trim(),
      pin,
      avatar,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      coins: prev.coins + 500, // 500 phone registration bonus!
    };

    this.saveCurrentUser(newUser);
    return { success: true, message: 'Account created successfully! +500 registration bonus added!', user: newUser };
  }

  static login(phoneNumber: string, pin: string): { success: boolean; message: string; user?: UserProfile } {
    const cleanPhone = phoneNumber.trim();
    const allUsers = this.getAllUsers();
    const user = allUsers[cleanPhone];

    if (!user) {
      return { success: false, message: 'No account found with this phone number. Please register first.' };
    }

    if (user.pin !== pin) {
      return { success: false, message: 'Incorrect PIN. Please try again.' };
    }

    user.lastLoginAt = new Date().toISOString();
    this.saveCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.name}!`, user };
  }

  static recordMatchResult(record: Omit<MatchRecord, 'id' | 'date'> & { capturesMade: number; sixesMade: number }): UserProfile {
    const user = this.getCurrentUser();
    const isWin = record.rank === 1;

    const newGamesPlayed = user.stats.gamesPlayed + 1;
    const newGamesWon = isWin ? user.stats.gamesWon + 1 : user.stats.gamesWon;
    const newStreak = isWin ? user.stats.currentStreak + 1 : 0;
    const bestStreak = Math.max(user.stats.bestStreak, newStreak);
    const newCaptures = user.stats.captures + record.capturesMade;
    const newSixes = user.stats.sixesRolled + record.sixesMade;

    const fullRecord: MatchRecord = {
      id: 'match_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      mode: record.mode,
      playersCount: record.playersCount,
      rank: record.rank,
      coinsEarned: record.coinsEarned,
      xpEarned: record.xpEarned,
      durationSeconds: record.durationSeconds,
      winnerName: record.winnerName,
    };

    const newXP = user.xp + record.xpEarned;
    const newLevel = Math.floor(newXP / 500) + 1;
    const newCoins = Math.max(0, user.coins + record.coinsEarned);

    // Update achievements
    const updatedAchievements = user.achievements.map((ach) => {
      let currentProgress = ach.progress;
      if (ach.id === 'first_win' && isWin) {
        currentProgress = 1;
      } else if (ach.id === 'pawn_hunter') {
        currentProgress = Math.min(ach.maxProgress, newCaptures);
      } else if (ach.id === 'six_master') {
        currentProgress = Math.min(ach.maxProgress, newSixes);
      } else if (ach.id === 'hot_streak') {
        currentProgress = Math.min(ach.maxProgress, Math.max(ach.progress, newStreak));
      } else if (ach.id === 'veteran') {
        currentProgress = Math.min(ach.maxProgress, newGamesPlayed);
      }

      const unlocked = currentProgress >= ach.maxProgress;
      return {
        ...ach,
        progress: currentProgress,
        unlocked,
      };
    });

    const updatedUser: UserProfile = {
      ...user,
      coins: newCoins,
      xp: newXP,
      level: newLevel,
      stats: {
        gamesPlayed: newGamesPlayed,
        gamesWon: newGamesWon,
        winRate: Math.round((newGamesWon / newGamesPlayed) * 100),
        captures: newCaptures,
        sixesRolled: newSixes,
        currentStreak: newStreak,
        bestStreak,
      },
      matchHistory: [fullRecord, ...user.matchHistory.slice(0, 19)],
      achievements: updatedAchievements,
    };

    this.saveCurrentUser(updatedUser);
    return updatedUser;
  }

  static purchaseItem(itemId: string, itemType: 'dice' | 'pawn', price: number, currency: 'coins' | 'diamonds'): { success: boolean; message: string; user?: UserProfile } {
    const user = this.getCurrentUser();
    if (currency === 'coins' && user.coins < price) {
      return { success: false, message: `Not enough coins! Need ${price.toLocaleString()} coins.` };
    }
    if (currency === 'diamonds' && user.diamonds < price) {
      return { success: false, message: `Not enough diamonds! Need ${price} diamonds.` };
    }

    const newCoins = currency === 'coins' ? user.coins - price : user.coins;
    const newDiamonds = currency === 'diamonds' ? user.diamonds - price : user.diamonds;

    const newUnlockedDice = itemType === 'dice' ? Array.from(new Set([...user.inventory.unlockedDice, itemId])) : user.inventory.unlockedDice;
    const newUnlockedPawns = itemType === 'pawn' ? Array.from(new Set([...user.inventory.unlockedPawns, itemId])) : user.inventory.unlockedPawns;

    const updated: UserProfile = {
      ...user,
      coins: newCoins,
      diamonds: newDiamonds,
      inventory: {
        ...user.inventory,
        equippedDice: itemType === 'dice' ? itemId : user.inventory.equippedDice,
        equippedPawn: itemType === 'pawn' ? itemId : user.inventory.equippedPawn,
        unlockedDice: newUnlockedDice,
        unlockedPawns: newUnlockedPawns,
      },
    };

    this.saveCurrentUser(updated);
    return { success: true, message: 'Item unlocked and equipped!', user: updated };
  }

  static equipItem(itemId: string, itemType: 'dice' | 'pawn'): UserProfile {
    const user = this.getCurrentUser();
    const updated: UserProfile = {
      ...user,
      inventory: {
        ...user.inventory,
        equippedDice: itemType === 'dice' ? itemId : user.inventory.equippedDice,
        equippedPawn: itemType === 'pawn' ? itemId : user.inventory.equippedPawn,
      },
    };
    this.saveCurrentUser(updated);
    return updated;
  }

  static exportAccountData(): string {
    const user = this.getCurrentUser();
    return JSON.stringify(user, null, 2);
  }

  static importAccountData(jsonString: string): { success: boolean; message: string; user?: UserProfile } {
    try {
      const parsed = JSON.parse(jsonString) as UserProfile;
      if (!parsed.phoneNumber || !parsed.name || typeof parsed.coins !== 'number') {
        return { success: false, message: 'Invalid FG Ludu MAX account backup file.' };
      }
      this.saveCurrentUser(parsed);
      return { success: true, message: 'Account data successfully restored!', user: parsed };
    } catch {
      return { success: false, message: 'Failed to parse JSON backup.' };
    }
  }
}
