import React, { useState } from 'react';
import { AccountService } from '../services/accountService';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface AccountModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserProfile) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'register' | 'switch'>('profile');

  // Form states
  const [phoneInput, setPhoneInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('avatar_king');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Backup state
  const [backupText, setBackupText] = useState('');
  const [showBackup, setShowBackup] = useState(false);

  if (!isOpen) return null;

  const avatars = [
    { id: 'avatar_king', emoji: '👑', label: 'Emperor' },
    { id: 'avatar_tiger', emoji: '🐯', label: 'Tiger' },
    { id: 'avatar_falcon', emoji: '🦅', label: 'Falcon' },
    { id: 'avatar_dragon', emoji: '🐉', label: 'Dragon' },
    { id: 'avatar_robot', emoji: '🤖', label: 'Cyborg' },
    { id: 'avatar_girl', emoji: '👩‍🦰', label: 'Queen' },
    { id: 'avatar_boy', emoji: '🧑', label: 'Ace' },
    { id: 'avatar_diamond', emoji: '💎', label: 'Gem' },
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setFeedback(null);

    const res = AccountService.register(phoneInput, nameInput, pinInput, avatarInput);
    if (res.success && res.user) {
      setFeedback({ type: 'success', message: res.message });
      onUserUpdated(res.user);
      setTimeout(() => {
        setActiveTab('profile');
        setFeedback(null);
      }, 1000);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setFeedback(null);

    const res = AccountService.login(phoneInput, pinInput);
    if (res.success && res.user) {
      setFeedback({ type: 'success', message: res.message });
      onUserUpdated(res.user);
      setTimeout(() => {
        setActiveTab('profile');
        setFeedback(null);
      }, 1000);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleSwitchTo = (phone: string, pin: string) => {
    soundFX.playClick();
    const res = AccountService.login(phone, pin);
    if (res.success && res.user) {
      onUserUpdated(res.user);
      setActiveTab('profile');
    }
  };

  const handleExport = () => {
    const data = AccountService.exportAccountData();
    setBackupText(data);
    setShowBackup(true);
  };

  const handleImport = () => {
    if (!backupText.trim()) return;
    const res = AccountService.importAccountData(backupText);
    if (res.success && res.user) {
      onUserUpdated(res.user);
      setFeedback({ type: 'success', message: res.message });
      setShowBackup(false);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const allRegisteredUsers = Object.values(AccountService.getAllUsers());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📱</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight">Player Account Center</h2>
              <p className="text-xs text-slate-400">Save progress & stats with your Phone Number</p>
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('profile');
              setFeedback(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center
              ${activeTab === 'profile' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}
            `}
          >
            My Profile
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('login');
              setFeedback(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center
              ${activeTab === 'login' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}
            `}
          >
            Phone Login
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('register');
              setFeedback(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center
              ${activeTab === 'register' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}
            `}
          >
            New Account (+500🪙)
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('switch');
              setFeedback(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center
              ${activeTab === 'switch' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}
            `}
          >
            Switch ({allRegisteredUsers.length})
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs font-semibold border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : 'bg-rose-950/80 text-rose-300 border-rose-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  {currentUser.avatar === 'avatar_king' ? '👑' : currentUser.avatar === 'avatar_tiger' ? '🐯' : '💎'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white truncate">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">
                      LVL {currentUser.level}
                    </span>
                  </div>
                  <p className="text-xs text-amber-400/90 font-mono mt-0.5 flex items-center gap-1.5">
                    <span>📞 {currentUser.phoneNumber}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Joined: {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-amber-400 font-mono">
                    🪙 {currentUser.coins.toLocaleString()}
                  </div>
                  <div className="text-xs font-black text-sky-400 font-mono">
                    💎 {currentUser.diamonds}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Match Records & Performance
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Games Won</span>
                    <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                      {currentUser.stats.gamesWon} / {currentUser.stats.gamesPlayed}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Win Rate</span>
                    <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                      {currentUser.stats.winRate}%
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Best Streak</span>
                    <p className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                      🔥 {currentUser.stats.bestStreak}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Pawns Captured</span>
                    <p className="text-lg font-bold text-sky-400 font-mono mt-0.5">
                      🎯 {currentUser.stats.captures}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Sixes Rolled</span>
                    <p className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
                      🎲 {currentUser.stats.sixesRolled}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Current XP</span>
                    <p className="text-lg font-bold text-purple-400 font-mono mt-0.5">
                      ⚡ {currentUser.xp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Match History Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Recent Matches
                </h4>
                {currentUser.matchHistory.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                    No matches played yet. Roll the dice to begin your saga!
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {currentUser.matchHistory.map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${
                              rec.rank === 1
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            #{rec.rank}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-200 capitalize">
                              {rec.mode.replace('_', ' ')}
                            </span>
                            <span className="text-slate-500 text-[10px] ml-2">{rec.date}</span>
                          </div>
                        </div>
                        <span
                          className={`font-mono font-bold ${
                            rec.coinsEarned >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {rec.coinsEarned >= 0 ? `+${rec.coinsEarned}` : rec.coinsEarned} 🪙
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Backup & Restore Section */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleExport}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer mr-4"
                >
                  Export Data Backup (JSON)
                </button>
                <button
                  type="button"
                  onClick={() => setShowBackup(!showBackup)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium underline cursor-pointer"
                >
                  Import Account Backup
                </button>

                {showBackup && (
                  <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <textarea
                      rows={4}
                      value={backupText}
                      onChange={(e) => setBackupText(e.target.value)}
                      placeholder="Paste JSON account backup text here..."
                      className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleImport}
                        className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Restore Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Registered Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1712-345678"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Security PIN (4 digits)</label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-colors"
              >
                Log In to Account
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-xs text-amber-300">
                🎉 Create an account with your phone number and get <strong>500 Bonus Coins</strong> instantly!
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Your Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1712-345678"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Player Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ferdous Gazi"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Create Security PIN (4-6 digits)</label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Choose Avatar</label>
                <div className="grid grid-cols-4 gap-2">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatarInput(av.id)}
                      className={`p-2 rounded-xl border text-xl flex flex-col items-center cursor-pointer transition-all ${
                        avatarInput === av.id
                          ? 'border-amber-400 bg-amber-500/20 scale-105'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <span>{av.emoji}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                Create Account & Save Data
              </button>
            </form>
          )}

          {/* TAB 4: SWITCH ACCOUNTS */}
          {activeTab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Easily switch between different phone profiles on this device:
              </p>
              {allRegisteredUsers.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-950 rounded-xl">
                  No other phone accounts saved on this device yet.
                </div>
              ) : (
                allRegisteredUsers.map((usr) => (
                  <div
                    key={usr.phoneNumber}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      usr.phoneNumber === currentUser.phoneNumber
                        ? 'bg-amber-500/10 border-amber-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                        {usr.avatar === 'avatar_king' ? '👑' : '💎'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{usr.name}</h4>
                        <p className="text-xs text-slate-400 font-mono">{usr.phoneNumber}</p>
                      </div>
                    </div>

                    {usr.phoneNumber === currentUser.phoneNumber ? (
                      <span className="text-xs text-amber-400 font-bold px-2.5 py-1 rounded bg-amber-400/20">
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSwitchTo(usr.phoneNumber, usr.pin)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg cursor-pointer"
                      >
                        Switch To
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
