import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface CreateRoomModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: { roomCode: string; playersCount: 2 | 4; betAmount: number; isPrivate: boolean }) => void;
}

const BET_OPTIONS = [500, 1000, 2500, 5000, 10000];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onCreateRoom,
}) => {
  const [playersCount, setPlayersCount] = useState<2 | 4>(4);
  const [betAmount, setBetAmount] = useState(1000);
  const [isPrivate, setIsPrivate] = useState(true);

  if (!isOpen) return null;

  const handleCreate = () => {
    soundFX.playClick();
    if (currentUser.coins < betAmount) {
      alert(`You need at least ${betAmount.toLocaleString()} coins to create this room!`);
      return;
    }
    // Generate clean 6-character room code like FG-8291
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const roomCode = `FG-${randomDigits}`;
    onCreateRoom({ roomCode, playersCount, betAmount, isPrivate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚔️</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight">
                Create Arena Room
              </h2>
              <p className="text-xs text-slate-400">Host your custom FG Ludu MAX tournament</p>
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

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Player Count */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Select Number of Players
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([2, 4] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setPlayersCount(count);
                  }}
                  className={`py-3 rounded-xl font-bold border transition-all cursor-pointer ${
                    playersCount === count
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {count} Players {count === 2 ? '(1v1)' : '(Classic 4)'}
                </button>
              ))}
            </div>
          </div>

          {/* Bet Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Entry Stake (Coins)
              </label>
              <span className="text-amber-400 font-mono font-bold">
                Balance: {currentUser.coins.toLocaleString()} 🪙
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {BET_OPTIONS.map((amt) => {
                const canAfford = currentUser.coins >= amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setBetAmount(amt);
                    }}
                    disabled={!canAfford}
                    className={`py-2 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                      betAmount === amt
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                        : canAfford
                        ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-amber-400/50'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {amt >= 1000 ? `${amt / 1000}K` : amt} 🪙
                  </button>
                );
              })}
            </div>
          </div>

          {/* Private Room Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-bold text-white">Private Room Code</span>
              <p className="text-[11px] text-slate-400">Only friends with room code can enter</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isPrivate ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  isPrivate ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Prize Pool Preview */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              Total Winner Prize Pool
            </span>
            <p className="text-xl font-black text-amber-400 font-mono mt-0.5">
              {(betAmount * playersCount * 0.9).toLocaleString()} 🪙
            </p>
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={handleCreate}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer font-display"
          >
            Create Room & Open Lobby 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
