import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player, PlayerColor } from '../types/ludo';
import { COLOR_CONFIGS } from '../utils/ludoRules';
import { soundFX } from '../utils/audio';

interface VictoryModalProps {
  podium: PlayerColor[];
  players: Player[];
  coinsReward: number;
  xpReward: number;
  isOpen: boolean;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  podium,
  players,
  coinsReward,
  xpReward,
  isOpen,
  onPlayAgain,
  onBackToLobby,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFX.playVictoryFanfare();
      // Confetti cannon blast
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti error', err);
      }
    }
  }, [isOpen]);

  if (!isOpen || podium.length === 0) return null;

  const winnerColor = podium[0];
  const winnerPlayer = players.find((p) => p.color === winnerColor);
  const config = COLOR_CONFIGS[winnerColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0f17] border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-center p-6 space-y-5">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Victory Trophy Asset */}
        <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-400 bg-slate-950 flex items-center justify-center">
          <img
            src="/src/assets/images/fg_victory_trophy_1790951502203.jpg"
            alt="FG Ludu MAX Victory Trophy"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Grand Champion of FG Ludu MAX
          </span>
          <h2 className="text-2xl font-black text-white font-display mt-1">
            {winnerPlayer?.name} Won!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Color: <strong style={{ color: config.themeColor }}>{winnerColor}</strong>
          </p>
        </div>

        {/* Rewards Earned Card */}
        <div className="flex items-center justify-around p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Coins Won</span>
            <p className="text-lg font-black text-amber-400 font-mono mt-0.5">
              +{coinsReward.toLocaleString()} 🪙
            </p>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">XP Gained</span>
            <p className="text-lg font-black text-sky-400 font-mono mt-0.5">
              +{xpReward} ⚡
            </p>
          </div>
        </div>

        {/* Podium Rankings */}
        <div className="space-y-1.5 text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Final Standings
          </span>
          {podium.map((col, idx) => {
            const plyr = players.find((p) => p.color === col);
            const clrConfig = COLOR_CONFIGS[col];

            return (
              <div
                key={col}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : 'bg-amber-700 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-white">{plyr?.name}</span>
                </div>
                <span className="font-mono text-xs font-bold" style={{ color: clrConfig.themeColor }}>
                  {col}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/30 cursor-pointer transition-all active:scale-95"
          >
            Play Again 🎲
          </button>
          <button
            type="button"
            onClick={onBackToLobby}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Lobby
          </button>
        </div>
      </div>
    </div>
  );
};
