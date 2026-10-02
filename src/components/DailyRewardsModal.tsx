import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AccountService } from '../services/accountService';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface DailyRewardsModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserProfile) => void;
}

const REWARDS_SCHEDULE = [
  { day: 1, coins: 250, diamonds: 0, icon: '🪙', label: '250 Coins' },
  { day: 2, coins: 500, diamonds: 2, icon: '🪙', label: '500 Coins + 2 💎' },
  { day: 3, coins: 800, diamonds: 3, icon: '🪙', label: '800 Coins + 3 💎' },
  { day: 4, coins: 1200, diamonds: 5, icon: '🎁', label: '1,200 Coins + 5 💎' },
  { day: 5, coins: 2000, diamonds: 8, icon: '⚡', label: '2,000 Coins + 8 💎' },
  { day: 6, coins: 3000, diamonds: 10, icon: '💎', label: '3,000 Coins + 10 💎' },
  { day: 7, coins: 5000, diamonds: 25, icon: '👑', label: '5,000 Coins + 25 💎 + Mystery Dice', highlight: true },
];

export const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDay = currentUser.dailyReward?.currentDay || 1;
  const lastClaimed = currentUser.dailyReward?.lastClaimedDate || '';
  const today = new Date().toDateString();
  const canClaimToday = lastClaimed !== today;

  const handleClaim = () => {
    soundFX.playClick();
    const reward = REWARDS_SCHEDULE[currentDay - 1];
    const updated = AccountService.claimDailyReward(reward.coins, reward.diamonds);
    soundFX.playHomeCelebration();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    }

    onUserUpdated(updated);
    setClaimedNotice(`Claimed Day ${currentDay} Reward! +${reward.coins.toLocaleString()} 🪙 ${reward.diamonds ? `+${reward.diamonds} 💎` : ''}`);
    setTimeout(() => {
      setClaimedNotice(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎁</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight flex items-center gap-1.5">
                <span>Daily Rewards</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  Day {currentDay}/7
                </span>
              </h2>
              <p className="text-xs text-slate-400">Log in daily to claim escalating FG gifts!</p>
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

        {/* Notice */}
        {claimedNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold text-center animate-fade-in">
            {claimedNotice}
          </div>
        )}

        {/* 7-Day Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {REWARDS_SCHEDULE.map((item) => {
              const isPast = item.day < currentDay;
              const isCurrent = item.day === currentDay;

              return (
                <div
                  key={item.day}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                    item.highlight ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                      : isPast
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-bold font-mono text-slate-400">
                    Day {item.day}
                  </span>
                  <div className="my-2 text-2xl drop-shadow">{item.icon}</div>
                  <div className="text-[11px] font-bold text-amber-400 font-mono">
                    +{item.coins}
                  </div>
                  {item.diamonds > 0 && (
                    <div className="text-[9px] font-bold text-sky-400 font-mono">
                      +{item.diamonds} 💎
                    </div>
                  )}
                  {isPast && (
                    <span className="mt-1 text-[9px] font-bold text-emerald-400">Claimed ✓</span>
                  )}
                  {isCurrent && canClaimToday && (
                    <span className="mt-1 text-[9px] font-bold text-amber-300 animate-pulse">Ready!</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="pt-2">
            {canClaimToday ? (
              <button
                type="button"
                onClick={handleClaim}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer font-display"
              >
                Claim Day {currentDay} Reward 🎁
              </button>
            ) : (
              <div className="w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs font-semibold text-slate-400">
                Come back tomorrow for Day {currentDay} reward!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
