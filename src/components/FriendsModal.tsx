import React, { useState } from 'react';
import { AccountService } from '../services/accountService';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface FriendsModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserProfile) => void;
  onInviteToRoom?: (friendName: string) => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated,
  onInviteToRoom,
}) => {
  const [friendName, setFriendName] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    const res = AccountService.addFriend(friendName, friendPhone);
    if (res.success && res.user) {
      onUserUpdated(res.user);
      setNotice({ type: 'success', message: res.message });
      setFriendName('');
      setFriendPhone('');
    } else {
      setNotice({ type: 'error', message: res.message });
    }
  };

  const handleSendGift = (friendId: string) => {
    soundFX.playClick();
    const res = AccountService.sendFriendGift(friendId);
    if (res.success && res.user) {
      soundFX.playSafeSpot();
      onUserUpdated(res.user);
      setNotice({ type: 'success', message: res.message });
    } else {
      setNotice({ type: 'error', message: res.message });
    }
  };

  const friends = currentUser.friends || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">👥</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight flex items-center gap-2">
                <span>Friends Hub</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  {friends.length} Friends
                </span>
              </h2>
              <p className="text-xs text-slate-400">Connect, send free daily coins & invite to games</p>
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
        {notice && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs font-semibold border text-center ${
              notice.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : 'bg-rose-950/80 text-rose-300 border-rose-700'
            }`}
          >
            {notice.message}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Friend Form */}
          <form onSubmit={handleAddFriend} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Add Friend by Phone Number
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Friend's Name"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-amber-400"
              />
              <input
                type="tel"
                required
                placeholder="Phone (+880 17...)"
                value={friendPhone}
                onChange={(e) => setFriendPhone(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 hover:border-amber-400 transition-colors cursor-pointer"
            >
              + Add to Friends
            </button>
          </form>

          {/* Friends List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Friends
            </h3>
            {friends.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                No friends added yet. Add a friend by phone number above!
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                        {friend.avatar === 'avatar_king' ? '👑' : friend.avatar === 'avatar_tiger' ? '🐯' : '💎'}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 ${
                          friend.status === 'online'
                            ? 'bg-emerald-400'
                            : friend.status === 'in_game'
                            ? 'bg-amber-400'
                            : 'bg-slate-500'
                        }`}
                        title={friend.status}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">{friend.name}</h4>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-mono">
                          LVL {friend.level}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{friend.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendGift(friend.id)}
                      className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      title="Send 100 free coins"
                    >
                      🪙 Gift
                    </button>
                    <button
                      type="button"
                      onClick={() => onInviteToRoom && onInviteToRoom(friend.name)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
