import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface JoinRoomModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomData: { roomCode: string; hostName: string; betAmount: number; playersCount: 2 | 4 }) => void;
}

const PUBLIC_ROOMS = [
  { roomCode: 'FG-9842', hostName: 'Ferdous Gazi (FG)', betAmount: 2500, playersCount: 4 as const, joined: 2 },
  { roomCode: 'FG-5120', hostName: 'Rahim Tiger', betAmount: 1000, playersCount: 4 as const, joined: 3 },
  { roomCode: 'FG-3319', hostName: 'Elena Star', betAmount: 500, playersCount: 2 as const, joined: 1 },
  { roomCode: 'FG-7740', hostName: 'Vikram Pro', betAmount: 5000, playersCount: 4 as const, joined: 1 },
];

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onJoinRoom,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualJoin = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    const clean = inputCode.trim().toUpperCase();
    if (clean.length < 4) {
      setErrorMsg('Please enter a valid room code (e.g., FG-8492).');
      return;
    }
    onJoinRoom({
      roomCode: clean.startsWith('FG-') ? clean : `FG-${clean}`,
      hostName: 'Arena Host',
      betAmount: 1000,
      playersCount: 4,
    });
  };

  const handleSelectRoom = (room: (typeof PUBLIC_ROOMS)[0]) => {
    soundFX.playClick();
    if (currentUser.coins < room.betAmount) {
      setErrorMsg(`You need ${room.betAmount.toLocaleString()} coins to join this room.`);
      return;
    }
    onJoinRoom({
      roomCode: room.roomCode,
      hostName: room.hostName,
      betAmount: room.betAmount,
      playersCount: room.playersCount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚪</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight">
                Join Arena Room
              </h2>
              <p className="text-xs text-slate-400">Enter a code or join an open online match</p>
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

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-300 font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Form to enter room code */}
          <form onSubmit={handleManualJoin} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Enter 6-Digit Room Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. FG-8492"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-center tracking-widest text-sm outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer transition-colors"
              >
                Join
              </button>
            </div>
          </form>

          {/* Live Open Rooms */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                Active Public Rooms
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live
              </span>
            </div>

            <div className="space-y-2">
              {PUBLIC_ROOMS.map((room) => (
                <div
                  key={room.roomCode}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{room.hostName}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold px-1.5 py-0.2 bg-amber-500/10 rounded border border-amber-500/20">
                        {room.roomCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>Stake: <strong className="text-amber-300 font-mono">{room.betAmount.toLocaleString()} 🪙</strong></span>
                      <span>·</span>
                      <span>Players: <strong className="text-white font-mono">{room.joined}/{room.playersCount}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectRoom(room)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-95"
                  >
                    Enter Room
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
