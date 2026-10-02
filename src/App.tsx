/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AccountModal } from './components/AccountModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { DailyRewardsModal } from './components/DailyRewardsModal';
import { Dice3D } from './components/Dice3D';
import { EmoteBar } from './components/EmoteBar';
import { FriendsModal } from './components/FriendsModal';
import { JoinRoomModal } from './components/JoinRoomModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { LudoBoard } from './components/LudoBoard';
import { NotificationsModal } from './components/NotificationsModal';
import { PlayerPod } from './components/PlayerPod';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { ShopModal } from './components/ShopModal';
import { VictoryModal } from './components/VictoryModal';
import { WaitingRoomModal } from './components/WaitingRoomModal';
import { AccountService } from './services/accountService';
import {
  BotDifficulty,
  GameMode,
  Pawn,
  Player,
  PlayerColor,
} from './types/ludo';
import { UserProfile } from './types/user';
import { soundFX } from './utils/audio';
import {
  findCapturablePawns,
  getMovablePawns,
  selectBestBotMove,
} from './utils/ludoRules';

interface WaitingPlayer {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  isBot: boolean;
  color: 'RED' | 'GREEN' | 'YELLOW' | 'BLUE';
}

export default function App() {
  // Current user state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    AccountService.getCurrentUser()
  );

  // Modals state
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showDailyRewardsModal, setShowDailyRewardsModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  const [showWaitingRoomModal, setShowWaitingRoomModal] = useState(false);

  // Online Room metadata
  const [activeRoomData, setActiveRoomData] = useState<{
    roomCode: string;
    betAmount: number;
    playersCount: 2 | 4;
  }>({
    roomCode: 'FG-8821',
    betAmount: 1000,
    playersCount: 4,
  });

  // Sound state
  const [soundMuted, setSoundMuted] = useState(() => soundFX.getMuted());

  // Lobby Setup state
  const [inGame, setInGame] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('vs_bot');
  const [playersCount, setPlayersCount] = useState<2 | 3 | 4>(4);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [quickMode, setQuickMode] = useState(false);

  // In-Game match state
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [canRoll, setCanRoll] = useState(true);
  const [movablePawnIds, setMovablePawnIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('Welcome to FG Ludu MAX');
  const [podium, setPodium] = useState<PlayerColor[]>([]);
  const [matchStartTime, setMatchStartTime] = useState<number>(0);
  const [userCapturesThisMatch, setUserCapturesThisMatch] = useState(0);
  const [userSixesThisMatch, setUserSixesThisMatch] = useState(0);

  // Turn tracking ref to prevent stale state issues in setTimeout callbacks
  const gameStateRef = useRef({
    inGame,
    isRolling,
    canRoll,
    activePlayerIndex,
    players,
    diceValue,
    movablePawnIds,
    quickMode,
    botDifficulty,
    podium,
  });

  useEffect(() => {
    gameStateRef.current = {
      inGame,
      isRolling,
      canRoll,
      activePlayerIndex,
      players,
      diceValue,
      movablePawnIds,
      quickMode,
      botDifficulty,
      podium,
    };
  });

  const toggleSound = () => {
    const muted = soundFX.toggleMute();
    setSoundMuted(muted);
  };

  // Helper to initialize players
  const initializePlayers = (
    mode: GameMode,
    count: 2 | 3 | 4,
    user: UserProfile,
    customWaitingPlayers?: WaitingPlayer[]
  ): Player[] => {
    if (customWaitingPlayers && customWaitingPlayers.length > 0) {
      return customWaitingPlayers.map((wp, idx) => ({
        id: `player_${wp.color}`,
        name: wp.name,
        color: wp.color,
        isBot: wp.isBot,
        avatar: wp.avatar,
        pawns: [0, 1, 2, 3].map((pIdx) => ({
          id: `${wp.color}_${pIdx}`,
          color: wp.color,
          index: pIdx,
          step: -1,
          isHome: false,
        })),
        consecutiveSixes: 0,
      }));
    }

    let colors: PlayerColor[] = ['RED', 'GREEN', 'YELLOW', 'BLUE'];
    if (count === 2) {
      colors = ['RED', 'YELLOW'];
    } else if (count === 3) {
      colors = ['RED', 'GREEN', 'YELLOW'];
    }

    return colors.map((color, idx) => {
      const isHuman = idx === 0 || mode === 'pass_and_play';
      const pawns: Pawn[] = [0, 1, 2, 3].map((pIdx) => ({
        id: `${color}_${pIdx}`,
        color,
        index: pIdx,
        step: -1,
        isHome: false,
      }));

      let name = '';
      let avatar = 'avatar_king';

      if (idx === 0) {
        name = user.name || 'Player 1';
        avatar = user.avatar || 'avatar_king';
      } else if (mode === 'pass_and_play') {
        name = `Player ${idx + 1}`;
        avatar = idx === 1 ? 'avatar_tiger' : idx === 2 ? 'avatar_falcon' : 'avatar_dragon';
      } else if (mode === 'online_sim') {
        const botNames = ['Alex Global', 'Sultana Pro', 'Chen Master', 'Vikram 99'];
        name = botNames[idx - 1] || `Contender ${idx}`;
        avatar = idx === 1 ? 'avatar_girl' : idx === 2 ? 'avatar_boy' : 'avatar_falcon';
      } else {
        const botNames = ['Bot Alpha', 'Bot Blitz', 'Bot Titan', 'Bot Master'];
        name = botNames[idx - 1] || `Bot ${color}`;
        avatar = 'avatar_robot';
      }

      return {
        id: `player_${color}`,
        name,
        color,
        isBot: !isHuman,
        avatar,
        pawns,
        consecutiveSixes: 0,
      };
    });
  };

  // Start new match
  const startMatch = (customPlayers?: WaitingPlayer[]) => {
    soundFX.playClick();
    const newPlayers = initializePlayers(gameMode, playersCount, currentUser, customPlayers);
    setPlayers(newPlayers);
    setActivePlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setCanRoll(true);
    setMovablePawnIds([]);
    setPodium([]);
    setUserCapturesThisMatch(0);
    setUserSixesThisMatch(0);
    setMatchStartTime(Date.now());
    setStatusMessage(`${newPlayers[0].name}'s turn - Roll the dice!`);
    setInGame(true);
  };

  // Check victory condition
  const checkPlayerFinished = useCallback((player: Player, isQuick: boolean) => {
    const requiredHomePawns = isQuick ? 2 : 4;
    const homeCount = player.pawns.filter((p) => p.step === 56 || p.isHome).length;
    return homeCount >= requiredHomePawns;
  }, []);

  // Next Turn logic
  const passTurn = useCallback(() => {
    const current = gameStateRef.current;
    if (!current.inGame) return;

    let nextIndex = (current.activePlayerIndex + 1) % current.players.length;
    let attempts = 0;

    // Skip already ranked/finished players
    while (current.players[nextIndex].rank !== undefined && attempts < current.players.length) {
      nextIndex = (nextIndex + 1) % current.players.length;
      attempts++;
    }

    setActivePlayerIndex(nextIndex);
    setDiceValue(null);
    setMovablePawnIds([]);
    setCanRoll(true);

    const nextPlayer = current.players[nextIndex];
    setStatusMessage(`${nextPlayer.name}'s turn (${nextPlayer.color})`);
  }, []);

  // Move a specific pawn
  const executePawnMove = useCallback((pawnToMove: Pawn) => {
    const current = gameStateRef.current;
    const activePlayer = current.players[current.activePlayerIndex];
    const rolledVal = current.diceValue;

    if (!rolledVal) return;

    setMovablePawnIds([]);
    setCanRoll(false);
    soundFX.playPawnStep();

    const targetStep = pawnToMove.step === -1 ? 0 : pawnToMove.step + rolledVal;
    const isNowHome = targetStep === 56;

    // Check for captures
    const capturedPawns = findCapturablePawns(pawnToMove, targetStep, current.players);

    if (capturedPawns.length > 0) {
      soundFX.playCapture();
      if (!activePlayer.isBot) {
        setUserCapturesThisMatch((prev) => prev + capturedPawns.length);
      }
    } else if (isNowHome) {
      soundFX.playHomeCelebration();
    } else if (targetStep === 0 || pawnToMove.step === -1) {
      soundFX.playSafeSpot();
    }

    // Update players state
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        // Update active player's pawn
        if (player.color === pawnToMove.color) {
          const updatedPawns = player.pawns.map((p) => {
            if (p.id === pawnToMove.id) {
              return {
                ...p,
                step: targetStep,
                isHome: isNowHome,
              };
            }
            return p;
          });
          return { ...player, pawns: updatedPawns };
        }

        // Reset any captured pawns to base (-1)
        if (capturedPawns.some((c) => c.color === player.color)) {
          const updatedPawns = player.pawns.map((p) => {
            if (capturedPawns.some((c) => c.id === p.id)) {
              return { ...p, step: -1, isHome: false };
            }
            return p;
          });
          return { ...player, pawns: updatedPawns };
        }

        return player;
      });
    });

    // Check if active player just won/finished
    setTimeout(() => {
      const refreshedState = gameStateRef.current;
      const updatedActivePlayer = refreshedState.players[refreshedState.activePlayerIndex];
      const hasFinished = checkPlayerFinished(updatedActivePlayer, refreshedState.quickMode);

      if (hasFinished && updatedActivePlayer.rank === undefined) {
        const newRank = refreshedState.podium.length + 1;
        const newPodium = [...refreshedState.podium, updatedActivePlayer.color];
        setPodium(newPodium);

        setPlayers((prev) =>
          prev.map((p) =>
            p.color === updatedActivePlayer.color ? { ...p, rank: newRank } : p
          )
        );

        setStatusMessage(`🎉 ${updatedActivePlayer.name} finished #${newRank}!`);

        if (newPodium.length === 1 || newPodium.length >= refreshedState.players.length - 1) {
          setTimeout(() => {
            // Record match result in user profile
            const isUserWinner = updatedActivePlayer.color === refreshedState.players[0].color;
            const coinsEarned = isUserWinner ? 600 : 150;
            const xpEarned = isUserWinner ? 250 : 80;
            const duration = Math.round((Date.now() - matchStartTime) / 1000);

            const updatedUser = AccountService.recordMatchResult({
              mode: refreshedState.inGame ? gameMode : 'vs_bot',
              playersCount,
              rank: (newPodium.indexOf(refreshedState.players[0].color) + 1 || 4) as 1 | 2 | 3 | 4,
              coinsEarned,
              xpEarned,
              durationSeconds: duration,
              winnerName: updatedActivePlayer.name,
              capturesMade: userCapturesThisMatch,
              sixesMade: userSixesThisMatch,
            });

            setCurrentUser(updatedUser);
            setShowVictoryModal(true);
          }, 1200);
          return;
        }
      }

      const getsExtraTurn =
        rolledVal === 6 || capturedPawns.length > 0 || isNowHome;

      if (getsExtraTurn && updatedActivePlayer.rank === undefined) {
        let reason = 'Rolled a 6';
        if (capturedPawns.length > 0) reason = 'Captured an opponent';
        if (isNowHome) reason = 'Pawn reached Home';

        setStatusMessage(`${reason}! ${updatedActivePlayer.name} rolls again!`);
        setCanRoll(true);
        setDiceValue(null);
      } else {
        passTurn();
      }
    }, 400);
  }, [checkPlayerFinished, gameMode, matchStartTime, passTurn, playersCount, userCapturesThisMatch, userSixesThisMatch]);

  // Roll Dice logic
  const handleRollDice = useCallback(() => {
    const current = gameStateRef.current;
    if (!current.canRoll || current.isRolling) return;

    soundFX.playDiceRoll();
    setIsRolling(true);
    setCanRoll(false);
    setMovablePawnIds([]);

    const activePlayer = current.players[current.activePlayerIndex];

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      setIsRolling(false);

      if (!activePlayer.isBot && rolled === 6) {
        setUserSixesThisMatch((prev) => prev + 1);
      }

      let consecutiveSixes = activePlayer.consecutiveSixes;
      if (rolled === 6) {
        soundFX.playSixRolled();
        consecutiveSixes += 1;
      } else {
        consecutiveSixes = 0;
      }

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === current.activePlayerIndex ? { ...p, consecutiveSixes } : p
        )
      );

      if (consecutiveSixes === 3) {
        setStatusMessage(`Three 6s in a row! Turn forfeited for ${activePlayer.name}.`);
        setTimeout(() => passTurn(), 1200);
        return;
      }

      const movable = getMovablePawns(activePlayer, rolled);

      if (movable.length === 0) {
        setStatusMessage(`No legal moves for ${activePlayer.name} with roll ${rolled}.`);
        setTimeout(() => passTurn(), 1000);
      } else if (activePlayer.isBot) {
        setMovablePawnIds(movable.map((p) => p.id));
        setTimeout(() => {
          const bestMove = selectBestBotMove(
            activePlayer,
            rolled,
            current.players,
            current.botDifficulty
          );
          if (bestMove) {
            executePawnMove(bestMove);
          } else {
            passTurn();
          }
        }, 700);
      } else {
        setMovablePawnIds(movable.map((p) => p.id));
        setStatusMessage(`Select a highlighted pawn to move (${rolled})`);

        if (movable.length === 1) {
          setTimeout(() => {
            const latest = gameStateRef.current;
            if (latest.movablePawnIds.length === 1) {
              executePawnMove(movable[0]);
            }
          }, 500);
        }
      }
    }, 600);
  }, [executePawnMove, passTurn]);

  // Automated bot turn trigger
  useEffect(() => {
    if (!inGame || isRolling || !canRoll) return;

    const activePlayer = players[activePlayerIndex];
    if (activePlayer && activePlayer.isBot && activePlayer.rank === undefined) {
      const timer = setTimeout(() => {
        handleRollDice();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [inGame, activePlayerIndex, canRoll, isRolling, players, handleRollDice]);

  // Send Emote
  const handleSendEmote = (emoteText: string) => {
    soundFX.playClick();
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, activeEmote: { text: emoteText, timestamp: Date.now() } } : p
      )
    );
  };

  const activePlayer = players[activePlayerIndex];
  const unreadNotifsCount = (currentUser.notifications || []).filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* 1. TOP BAR (Strict 3-zone contract) */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-800/80 bg-[#08090f]/90 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-400/80 shadow-md flex items-center justify-center bg-slate-900">
            <img
              src="/src/assets/images/fg_metallic_logo_1790954500818.jpg"
              alt="FG Ludu MAX"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            type="button"
            onClick={() => setInGame(false)}
            className="text-lg font-black tracking-tight text-white hover:text-amber-400 transition-colors font-display"
          >
            FG Ludu MAX
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            type="button"
            onClick={() => setShowDailyRewardsModal(true)}
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>🎁</span>
            <span>Daily Rewards</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFriendsModal(true)}
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>👥</span>
            <span>Friends</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLeaderboardModal(true)}
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>🏆</span>
            <span>Leaderboard</span>
          </button>
          <button
            type="button"
            onClick={() => setShowShopModal(true)}
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>🛍️</span>
            <span>Custom Shop</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Account, Notifications, Sound) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Icon Button */}
          <button
            type="button"
            onClick={() => setShowNotificationsModal(true)}
            aria-label="Open Notifications"
            className="relative w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            <span>🔔</span>
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Sound toggle button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle Sound Effects"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>

          {/* Settings button */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            aria-label="Open Settings"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            <span>⚙️</span>
          </button>

          {/* Account Profile Button */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setShowAccountModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/15 to-amber-600/25 hover:from-amber-500/25 hover:to-amber-600/35 text-amber-300 border border-amber-500/50 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <span className="text-sm">👑</span>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight text-white">{currentUser.name}</div>
              <div className="text-[10px] text-amber-400 font-mono">
                🪙 {currentUser.coins.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] sm:hidden font-mono font-bold text-amber-300">
              🪙 {currentUser.coins.toLocaleString()}
            </span>
          </button>
        </div>
      </header>

      {/* 2. MAIN VIEWPORT (HOME or ACTIVE GAME) */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full">
        {!inGame ? (
          /* ================= HOME SCREEN ================= */
          <div className="w-full max-w-4xl space-y-5 animate-fade-in my-auto py-2">
            {/* Hero Banner with Powerful Metallic FG Logo */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/50 bg-gradient-to-b from-[#131622] via-[#0d0f17] to-[#07080d] p-6 sm:p-8 shadow-2xl text-center">
              {/* Fiery ember glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* 3D Metallic FG Logo Asset */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 mb-3 bg-[#0d0f17] ring-4 ring-amber-400/20">
                  <img
                    src="/src/assets/images/fg_metallic_logo_1790954500818.jpg"
                    alt="FG Ludu MAX Metallic Monogram Logo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-widest uppercase mb-1 border border-amber-500/30">
                  Prestige Esports Edition
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight drop-shadow-md">
                  FG Ludu MAX
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-1.5 leading-relaxed">
                  Enter the premier competitive arena. Play vs intelligent AI bots or host custom room tournaments with your phone account!
                </p>

                {/* Player Profile Snapshot Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-300 font-mono shadow">
                    <span>📞 {currentUser.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-400 font-mono font-bold shadow">
                    <span>🪙 {currentUser.coins.toLocaleString()} Coins</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sky-400 font-mono font-bold shadow">
                    <span>💎 {currentUser.diamonds} Gems</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Large Premium PLAY Button */}
                <div className="mt-6 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => startMatch()}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg font-display rounded-2xl shadow-xl shadow-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 border-t border-white/40"
                  >
                    <span className="text-xl">🎲</span>
                    <span>PLAY CHAMPIONSHIP NOW</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Game Modes Selection Grid */}
            <div>
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Game Modes & Arenas
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  Mode: <strong className="capitalize">{gameMode.replace('_', ' ')}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setGameMode('vs_bot');
                    setQuickMode(false);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    gameMode === 'vs_bot'
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                      : 'bg-[#0d0f17]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">🤖</span>
                  <h3 className="font-bold text-sm text-white mt-2">Vs Computer AI</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Battle calibrated bots (Easy, Medium, Master).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setGameMode('pass_and_play');
                    setQuickMode(false);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    gameMode === 'pass_and_play'
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                      : 'bg-[#0d0f17]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">👥</span>
                  <h3 className="font-bold text-sm text-white mt-2">Pass & Play</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Local tournament on one screen with friends.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setGameMode('quick_rush');
                    setQuickMode(true);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    gameMode === 'quick_rush'
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                      : 'bg-[#0d0f17]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-bold text-sm text-white mt-2">Quick Rush</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Fast 5-min round! First to bring 2 pawns home wins.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setGameMode('online_sim');
                    setShowCreateRoomModal(true);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    gameMode === 'online_sim'
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                      : 'bg-[#0d0f17]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">🌐</span>
                  <h3 className="font-bold text-sm text-white mt-2">Online Arena Room</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Host or join competitive room matches.
                  </p>
                </button>
              </div>
            </div>

            {/* Online Room Actions (Create / Join) */}
            <div className="p-4 rounded-2xl bg-[#0d0f17]/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Custom Match Rooms
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Play with friends with custom stakes & private room code
                </p>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(true)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                >
                  + Create Room
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinRoomModal(true)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 hover:border-amber-400 cursor-pointer transition-all whitespace-nowrap"
                >
                  Join Room Code
                </button>
              </div>
            </div>

            {/* Player Count & AI Difficulty Selector */}
            <div className="p-4 rounded-2xl bg-[#0d0f17]/90 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Number of Players:
                </span>
                <div className="flex items-center gap-2">
                  {([2, 3, 4] as const).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setPlayersCount(num);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        playersCount === num
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {num} Players
                    </button>
                  ))}
                </div>
              </div>

              {gameMode === 'vs_bot' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Bot AI Difficulty:
                  </span>
                  <div className="flex items-center gap-2">
                    {(['easy', 'medium', 'master'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => {
                          soundFX.playClick();
                          setBotDifficulty(diff);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          botDifficulty === diff
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shortcuts Row on Mobile */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 md:hidden">
              <button
                type="button"
                onClick={() => setShowDailyRewardsModal(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-300 hover:text-white"
              >
                <div>🎁</div>
                <div className="text-[10px] mt-1 font-semibold">Rewards</div>
              </button>
              <button
                type="button"
                onClick={() => setShowFriendsModal(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-300 hover:text-white"
              >
                <div>👥</div>
                <div className="text-[10px] mt-1 font-semibold">Friends</div>
              </button>
              <button
                type="button"
                onClick={() => setShowLeaderboardModal(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-300 hover:text-white"
              >
                <div>🏆</div>
                <div className="text-[10px] mt-1 font-semibold">Ranks</div>
              </button>
              <button
                type="button"
                onClick={() => setShowShopModal(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-300 hover:text-white"
              >
                <div>🛍️</div>
                <div className="text-[10px] mt-1 font-semibold">Shop</div>
              </button>
              <button
                type="button"
                onClick={() => setShowNotificationsModal(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-300 hover:text-white"
              >
                <div>🔔</div>
                <div className="text-[10px] mt-1 font-semibold">Inbox</div>
              </button>
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-300 hover:text-white"
              >
                <div>⚙️</div>
                <div className="text-[10px] mt-1 font-semibold">Settings</div>
              </button>
            </div>
          </div>
        ) : (
          /* ================= ACTIVE GAME SCREEN ================= */
          <div className="w-full max-w-5xl flex flex-col items-center space-y-3 animate-fade-in">
            {/* In-Game Top Match Bar */}
            <div className="w-full flex items-center justify-between px-3 py-2 bg-[#0d0f17]/90 border border-slate-800 rounded-2xl text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="font-semibold text-slate-200 font-display text-sm tracking-wide">
                  {statusMessage}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRulesModal(true)}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Rules
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setInGame(false);
                  }}
                  className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Surrender
                </button>
              </div>
            </div>

            {/* Board & Player Pods Layout */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              {/* Left Column Pods (Player 1 Red & Player 4 Blue) */}
              <div className="lg:col-span-3 flex lg:flex-col gap-2 order-2 lg:order-1">
                {players[0] && (
                  <div className="flex-1 lg:flex-none">
                    <PlayerPod
                      player={players[0]}
                      isActive={activePlayerIndex === 0}
                      canRoll={canRoll && activePlayerIndex === 0}
                      diceValue={activePlayerIndex === 0 ? diceValue : null}
                      isRolling={isRolling && activePlayerIndex === 0}
                      diceSkin={currentUser.inventory.equippedDice}
                      onRollDice={handleRollDice}
                    />
                  </div>
                )}
                {players[3] && (
                  <div className="flex-1 lg:flex-none">
                    <PlayerPod
                      player={players[3]}
                      isActive={activePlayerIndex === 3}
                      canRoll={canRoll && activePlayerIndex === 3}
                      diceValue={activePlayerIndex === 3 ? diceValue : null}
                      isRolling={isRolling && activePlayerIndex === 3}
                      diceSkin={currentUser.inventory.equippedDice}
                      onRollDice={handleRollDice}
                    />
                  </div>
                )}
              </div>

              {/* Center Board (15x15) */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
                <LudoBoard
                  players={players}
                  activeColor={activePlayer?.color || 'RED'}
                  movablePawnIds={movablePawnIds}
                  diceValue={diceValue}
                  onPawnClick={executePawnMove}
                  pawnSkin={currentUser.inventory.equippedPawn}
                />

                {/* Mobile / Direct Touch Dice Roll Trigger Bar */}
                {canRoll && !activePlayer?.isBot && (
                  <div className="mt-3 w-full max-w-[320px] flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRollDice}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 font-display"
                    >
                      <Dice3D
                        value={diceValue}
                        isRolling={isRolling}
                        canRoll={false}
                        skin={currentUser.inventory.equippedDice}
                        size="sm"
                      />
                      <span>TAP TO ROLL DICE</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column Pods (Player 2 Green & Player 3 Yellow) */}
              <div className="lg:col-span-3 flex lg:flex-col gap-2 order-3">
                {players[1] && (
                  <div className="flex-1 lg:flex-none">
                    <PlayerPod
                      player={players[1]}
                      isActive={activePlayerIndex === 1}
                      canRoll={canRoll && activePlayerIndex === 1}
                      diceValue={activePlayerIndex === 1 ? diceValue : null}
                      isRolling={isRolling && activePlayerIndex === 1}
                      diceSkin={currentUser.inventory.equippedDice}
                      onRollDice={handleRollDice}
                    />
                  </div>
                )}
                {players[2] && (
                  <div className="flex-1 lg:flex-none">
                    <PlayerPod
                      player={players[2]}
                      isActive={activePlayerIndex === 2}
                      canRoll={canRoll && activePlayerIndex === 2}
                      diceValue={activePlayerIndex === 2 ? diceValue : null}
                      isRolling={isRolling && activePlayerIndex === 2}
                      diceSkin={currentUser.inventory.equippedDice}
                      onRollDice={handleRollDice}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* In-Game Emote Reactions Bar */}
            <div className="w-full max-w-xl mt-1">
              <EmoteBar onSendEmote={handleSendEmote} />
            </div>
          </div>
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="px-6 py-3 border-t border-slate-800/80 bg-[#08090f] text-center text-xs text-slate-400">
        <span>FG Ludu MAX</span>
        <span aria-hidden="true" className="mx-2">·</span>
        <span>Dedicated to Ferdous Gazi (FG)</span>
        <span aria-hidden="true" className="mx-2">·</span>
        <span>Official Esports Championship</span>
      </footer>

      {/* MODALS & DIALOGS */}
      <AccountModal
        currentUser={currentUser}
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onUserUpdated={(usr) => setCurrentUser(usr)}
      />

      <ShopModal
        currentUser={currentUser}
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        onUserUpdated={(usr) => setCurrentUser(usr)}
      />

      <LeaderboardModal
        currentUser={currentUser}
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
      />

      <DailyRewardsModal
        currentUser={currentUser}
        isOpen={showDailyRewardsModal}
        onClose={() => setShowDailyRewardsModal(false)}
        onUserUpdated={(usr) => setCurrentUser(usr)}
      />

      <FriendsModal
        currentUser={currentUser}
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        onUserUpdated={(usr) => setCurrentUser(usr)}
        onInviteToRoom={() => {
          setShowFriendsModal(false);
          setShowCreateRoomModal(true);
        }}
      />

      <NotificationsModal
        currentUser={currentUser}
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onUserUpdated={(usr) => setCurrentUser(usr)}
      />

      <SettingsModal
        currentUser={currentUser}
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onUserUpdated={(usr) => setCurrentUser(usr)}
        onOpenRules={() => setShowRulesModal(true)}
      />

      <CreateRoomModal
        currentUser={currentUser}
        isOpen={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
        onCreateRoom={(data) => {
          setActiveRoomData(data);
          setShowCreateRoomModal(false);
          setShowWaitingRoomModal(true);
        }}
      />

      <JoinRoomModal
        currentUser={currentUser}
        isOpen={showJoinRoomModal}
        onClose={() => setShowJoinRoomModal(false)}
        onJoinRoom={(data) => {
          setActiveRoomData({
            roomCode: data.roomCode,
            betAmount: data.betAmount,
            playersCount: data.playersCount,
          });
          setShowJoinRoomModal(false);
          setShowWaitingRoomModal(true);
        }}
      />

      <WaitingRoomModal
        currentUser={currentUser}
        isOpen={showWaitingRoomModal}
        roomCode={activeRoomData.roomCode}
        betAmount={activeRoomData.betAmount}
        playersCount={activeRoomData.playersCount}
        onClose={() => setShowWaitingRoomModal(false)}
        onStartMatch={(waitingList) => {
          setShowWaitingRoomModal(false);
          setGameMode('online_sim');
          setPlayersCount(waitingList.length as 2 | 4);
          startMatch(waitingList);
        }}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      <VictoryModal
        podium={podium}
        players={players}
        coinsReward={podium[0] === players[0]?.color ? 600 : 150}
        xpReward={podium[0] === players[0]?.color ? 250 : 80}
        isOpen={showVictoryModal}
        onPlayAgain={() => {
          setShowVictoryModal(false);
          startMatch();
        }}
        onBackToLobby={() => {
          setShowVictoryModal(false);
          setInGame(false);
        }}
      />
    </div>
  );
}
