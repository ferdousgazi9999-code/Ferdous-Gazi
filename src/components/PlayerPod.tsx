import React from 'react';
import { Player } from '../types/ludo';
import { COLOR_CONFIGS } from '../utils/ludoRules';
import { Dice3D } from './Dice3D';

interface PlayerPodProps {
  player: Player;
  isActive: boolean;
  canRoll: boolean;
  diceValue: number | null;
  isRolling: boolean;
  diceSkin?: string;
  onRollDice?: () => void;
  timerSeconds?: number;
}

export const PlayerPod: React.FC<PlayerPodProps> = ({
  player,
  isActive,
  canRoll,
  diceValue,
  isRolling,
  diceSkin,
  onRollDice,
}) => {
  const config = COLOR_CONFIGS[player.color];

  // Count pawns at home, on track, and in base
  const pawnsHome = player.pawns.filter((p) => p.isHome || p.step === 56).length;
  const pawnsOnTrack = player.pawns.filter((p) => p.step >= 0 && p.step < 56).length;
  const pawnsInBase = player.pawns.filter((p) => p.step === -1).length;

  const getAvatarEmoji = (avatar: string) => {
    switch (avatar) {
      case 'avatar_king':
        return '👑';
      case 'avatar_tiger':
        return '🐯';
      case 'avatar_falcon':
        return '🦅';
      case 'avatar_dragon':
        return '🐉';
      case 'avatar_robot':
        return '🤖';
      case 'avatar_girl':
        return '👩‍🦰';
      case 'avatar_boy':
        return '🧑';
      case 'avatar_diamond':
        return '💎';
      default:
        return '👑';
    }
  };

  return (
    <div
      className={`relative flex items-center gap-2 p-2.5 rounded-2xl border transition-all duration-200 select-none ${
        isActive
          ? 'bg-[#111420] border-amber-400/90 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40 scale-[1.02]'
          : 'bg-[#090b12]/90 border-slate-800/80 opacity-80'
      }`}
      style={{
        borderLeftColor: config.themeColor,
        borderLeftWidth: '4px',
      }}
    >
      {/* Speech Emote Bubble */}
      {player.activeEmote && Date.now() - player.activeEmote.timestamp < 3500 && (
        <div className="absolute -top-9 left-2 z-30 bg-slate-900 text-amber-300 border border-amber-400 font-bold text-xs px-3 py-1 rounded-full shadow-2xl animate-bounce flex items-center gap-1">
          <span>{player.activeEmote.text}</span>
          <div className="absolute left-4 -bottom-1 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-amber-400" />
        </div>
      )}

      {/* Avatar Container */}
      <div className="relative shrink-0">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-md border-2 transition-transform ${
            isActive
              ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
              : 'border-slate-700/80'
          }`}
          style={{ backgroundColor: config.darkColor }}
        >
          {getAvatarEmoji(player.avatar)}
        </div>

        {/* Finished Rank Badge */}
        {player.rank && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-[10px] flex items-center justify-center border border-white shadow">
            #{player.rank}
          </div>
        )}

        {/* Active turn indicator dot */}
        {isActive && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-950 animate-ping" />
        )}
      </div>

      {/* Info & Pawns status */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-white truncate max-w-[95px]">{player.name}</span>
          {player.isBot && (
            <span className="text-[9px] text-slate-400 font-mono px-1 py-0.2 rounded bg-slate-800">
              BOT
            </span>
          )}
        </div>

        {/* Pawns mini tracker */}
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-0.5" title="Pawns in Home">
            <span className="text-amber-400">★</span>
            <span className="font-mono text-amber-300 font-bold">{pawnsHome}</span>
          </span>
          <span className="flex items-center gap-0.5" title="Pawns on Track">
            <span className="text-sky-400">●</span>
            <span className="font-mono text-slate-300">{pawnsOnTrack}</span>
          </span>
          <span className="flex items-center gap-0.5" title="Pawns in Base">
            <span className="text-slate-600">○</span>
            <span className="font-mono text-slate-500">{pawnsInBase}</span>
          </span>
        </div>
      </div>

      {/* Turn Dice Controller */}
      {isActive && (
        <div className="shrink-0 flex items-center gap-1">
          <Dice3D
            value={diceValue}
            isRolling={isRolling}
            canRoll={canRoll && !player.isBot}
            skin={diceSkin}
            onClick={onRollDice}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};
