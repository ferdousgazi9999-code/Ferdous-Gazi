import React from 'react';
import { UserProfile } from '../types/user';

interface LeaderboardModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

interface RankedPlayer {
  rank: number;
  name: string;
  phoneSnippet: string;
  avatar: string;
  wins: number;
  winRate: number;
  trophies: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Hall of Fame Leaderboard featuring Ferdous Gazi (FG) as legendary top grand champion
  const topPlayers: RankedPlayer[] = [
    {
      rank: 1,
      name: 'Ferdous Gazi (FG)',
      phoneSnippet: '+880 1799-***999',
      avatar: '👑',
      wins: 1482,
      winRate: 88,
      trophies: 9850,
      badge: 'FG Mastermind',
    },
    {
      rank: 2,
      name: 'Rahim Tiger',
      phoneSnippet: '+880 1812-***452',
      avatar: '🐯',
      wins: 964,
      winRate: 74,
      trophies: 7420,
      badge: 'Grandmaster',
    },
    {
      rank: 3,
      name: 'Elena Knight',
      phoneSnippet: '+1 415-***8921',
      avatar: '💎',
      wins: 830,
      winRate: 71,
      trophies: 6890,
      badge: 'Master',
    },
    {
      rank: 4,
      name: 'Tariq Falcon',
      phoneSnippet: '+880 1914-***112',
      avatar: '🦅',
      wins: 620,
      winRate: 65,
      trophies: 5410,
    },
    {
      rank: 5,
      name: 'Amina Blaze',
      phoneSnippet: '+91 9820-***633',
      avatar: '👩‍🦰',
      wins: 490,
      winRate: 62,
      trophies: 4620,
    },
    {
      rank: 6,
      name: currentUser.name,
      phoneSnippet: currentUser.phoneNumber.slice(0, 8) + '***',
      avatar: currentUser.avatar === 'avatar_king' ? '👑' : '💎',
      wins: currentUser.stats.gamesWon,
      winRate: currentUser.stats.winRate,
      trophies: currentUser.stats.gamesWon * 50 + currentUser.stats.captures * 5,
      isCurrentUser: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏆</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight">
                FG Ludu MAX Leaderboard
              </h2>
              <p className="text-xs text-slate-400">Global Champions & Top Scorers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {topPlayers.map((player) => (
            <div
              key={player.rank + player.name}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                player.isCurrentUser
                  ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/40'
                  : player.rank === 1
                  ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-amber-400/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow ${
                    player.rank === 1
                      ? 'bg-amber-400 text-slate-950'
                      : player.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : player.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{player.rank}
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                  {player.avatar}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white truncate">{player.name}</h4>
                    {player.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-sans shadow-sm shrink-0">
                        {player.badge}
                      </span>
                    )}
                    {player.isCurrentUser && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 shrink-0">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <span>{player.phoneSnippet}</span>
                    <span>·</span>
                    <span>Win Rate: {player.winRate}%</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-amber-400 font-mono">
                  🏆 {player.trophies.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono">{player.wins} Wins</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
