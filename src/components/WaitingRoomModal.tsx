import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface WaitingPlayer {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  isBot: boolean;
  color: 'RED' | 'GREEN' | 'YELLOW' | 'BLUE';
}

interface WaitingRoomModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  roomCode: string;
  betAmount: number;
  playersCount: 2 | 4;
  onClose: () => void;
  onStartMatch: (players: WaitingPlayer[]) => void;
}

export const WaitingRoomModal: React.FC<WaitingRoomModalProps> = ({
  currentUser,
  isOpen,
  roomCode,
  betAmount,
  playersCount,
  onClose,
  onStartMatch,
}) => {
  const [copied, setCopied] = useState(false);
  const [waitingPlayers, setWaitingPlayers] = useState<WaitingPlayer[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Initialize room with host
  useEffect(() => {
    if (isOpen) {
      const colors: ('RED' | 'GREEN' | 'YELLOW' | 'BLUE')[] =
        playersCount === 2 ? ['RED', 'YELLOW'] : ['RED', 'GREEN', 'YELLOW', 'BLUE'];

      const initial: WaitingPlayer[] = [
        {
          id: 'host',
          name: currentUser.name,
          avatar: currentUser.avatar || 'avatar_king',
          isReady: true,
          isBot: false,
          color: colors[0],
        },
      ];

      // Add a simulated opponent or leave open
      if (playersCount === 2) {
        initial.push({
          id: 'player_2',
          name: 'Elena Star',
          avatar: 'avatar_diamond',
          isReady: true,
          isBot: false,
          color: colors[1],
        });
      } else {
        initial.push(
          {
            id: 'player_2',
            name: 'Rahim Tiger',
            avatar: 'avatar_tiger',
            isReady: true,
            isBot: false,
            color: colors[1],
          }
        );
      }

      setWaitingPlayers(initial);
      setCountdown(null);
    }
  }, [isOpen, currentUser, playersCount]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    soundFX.playClick();
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBot = (color: 'RED' | 'GREEN' | 'YELLOW' | 'BLUE') => {
    soundFX.playClick();
    const botNames = ['Titan Bot', 'Alpha Bot', 'Blitz Bot', 'Cyber Bot'];
    const newBot: WaitingPlayer = {
      id: 'bot_' + Date.now(),
      name: botNames[waitingPlayers.length % botNames.length],
      avatar: 'avatar_robot',
      isReady: true,
      isBot: true,
      color,
    };
    setWaitingPlayers((prev) => [...prev, newBot]);
  };

  const colorsList: ('RED' | 'GREEN' | 'YELLOW' | 'BLUE')[] =
    playersCount === 2 ? ['RED', 'YELLOW'] : ['RED', 'GREEN', 'YELLOW', 'BLUE'];

  const allFilled = waitingPlayers.length === playersCount;

  const handleStart = () => {
    soundFX.playClick();
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          onStartMatch(waitingPlayers);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0d0f17] border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Glow backdrop */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              FG Tournament Match Lobby
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <h2 className="text-xl font-black text-white font-display">
                Room Code: <span className="text-amber-400 font-mono">{roomCode}</span>
              </h2>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-lg text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                {copied ? 'Copied ✓' : '📋 Copy'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              Bet: {betAmount.toLocaleString()} 🪙
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-400 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 4 Pedestals / Player slots */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colorsList.map((col) => {
              const player = waitingPlayers.find((p) => p.color === col);

              let borderColor = 'border-red-500/40';
              let badgeColor = 'bg-red-500';
              if (col === 'GREEN') {
                borderColor = 'border-emerald-500/40';
                badgeColor = 'bg-emerald-500';
              } else if (col === 'YELLOW') {
                borderColor = 'border-amber-500/40';
                badgeColor = 'bg-amber-500';
              } else if (col === 'BLUE') {
                borderColor = 'border-blue-500/40';
                badgeColor = 'bg-blue-500';
              }

              return (
                <div
                  key={col}
                  className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center min-h-[170px] transition-all ${
                    player
                      ? `bg-slate-950/80 ${borderColor} shadow-lg`
                      : 'bg-slate-950/30 border-slate-800/80 border-dashed'
                  }`}
                >
                  <span className={`text-[9px] font-black uppercase text-slate-950 px-2 py-0.5 rounded-full ${badgeColor} shadow-sm font-mono`}>
                    {col}
                  </span>

                  {player ? (
                    <>
                      <div className="my-2 relative">
                        <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-400/80 flex items-center justify-center text-2xl shadow-md">
                          {player.avatar === 'avatar_king' ? '👑' : player.avatar === 'avatar_tiger' ? '🐯' : player.avatar === 'avatar_diamond' ? '💎' : '🤖'}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border border-slate-900" />
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[100px]">
                          {player.name}
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mt-0.5">
                          {player.isBot ? 'Bot Ready' : 'Ready ✓'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="my-3 w-12 h-12 rounded-full border border-slate-700 border-dashed flex items-center justify-center text-slate-600 text-lg">
                        +
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddBot(col)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-amber-300 rounded-lg border border-slate-800 hover:border-amber-400/50 cursor-pointer transition-colors"
                      >
                        + Add Bot
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Countdown announcement or start button */}
          <div className="pt-2">
            {countdown !== null ? (
              <div className="w-full py-4 bg-amber-500 text-slate-950 font-black text-2xl rounded-2xl text-center animate-pulse font-display">
                Starting Match in {countdown}...
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                disabled={!allFilled && waitingPlayers.length < 2}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer font-display flex items-center justify-center gap-2"
              >
                <span>⚔️</span>
                <span>{allFilled ? 'Start Championship Match' : 'Fill Empty Slots with AI & Start'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
