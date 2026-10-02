import React from 'react';
import { AccountService } from '../services/accountService';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface NotificationsModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserProfile) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  if (!isOpen) return null;

  const handleClaim = (notifId: string) => {
    soundFX.playHomeCelebration();
    const updated = AccountService.claimNotification(notifId);
    onUserUpdated(updated);
  };

  const notifications = currentUser.notifications || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔔</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight flex items-center gap-2">
                <span>Game Inbox</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  {notifications.filter((n) => !n.read).length} New
                </span>
              </h2>
              <p className="text-xs text-slate-400">System updates, tournament announcements & gifts</p>
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
              No notifications right now. You're all caught up!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  !item.read
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5">
                      {item.type === 'gift' ? '🎁' : item.type === 'challenge' ? '⚔️' : '📢'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{item.title}</span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {item.rewardCoins && !item.claimed && (
                    <button
                      type="button"
                      onClick={() => handleClaim(item.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow cursor-pointer whitespace-nowrap"
                    >
                      Claim +{item.rewardCoins} 🪙
                    </button>
                  )}
                  {item.rewardCoins && item.claimed && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-1 rounded-lg">
                      Claimed ✓
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
