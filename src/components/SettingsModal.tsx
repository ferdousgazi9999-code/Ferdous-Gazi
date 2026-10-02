import React from 'react';
import { AccountService } from '../services/accountService';
import { UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface SettingsModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserProfile) => void;
  onOpenRules: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated,
  onOpenRules,
}) => {
  if (!isOpen) return null;

  const settings = currentUser.settings || {
    sfxVolume: 80,
    bgmVolume: 50,
    vibration: true,
    fastMode: false,
  };

  const updateSetting = (key: keyof typeof settings, value: number | boolean) => {
    soundFX.playClick();
    const updated = AccountService.updateSettings({ [key]: value });
    onUserUpdated(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚙️</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight">
                Game Settings
              </h2>
              <p className="text-xs text-slate-400">Audio, gameplay preferences & tournament rules</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Audio Controls */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Audio & Haptics
            </h3>

            {/* SFX Volume */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Sound Effects (SFX)</span>
                <p className="text-[11px] text-slate-400">Dice rattles, moves & captures</p>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onChange={(e) => updateSetting('sfxVolume', Number(e.target.value))}
                className="w-24 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <span className="font-bold text-white">Vibration & Haptics</span>
                <p className="text-[11px] text-slate-400">Tactile buzz on critical turns</p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting('vibration', !settings.vibration)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.vibration ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.vibration ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Gameplay Preferences */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Match Preferences
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Fast Turn Timer</span>
                <p className="text-[11px] text-slate-400">10s lightning turn speed</p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting('fastMode', !settings.fastMode)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.fastMode ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.fastMode ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRules();
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl border border-slate-800 hover:border-amber-400/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📖</span>
                <span>View Official Game Rules & Guide</span>
              </button>
            </div>
          </div>

          {/* About & Branding */}
          <div className="text-center p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 text-[11px] space-y-1">
            <p className="font-bold text-white font-display">FG Ludu MAX · Version 2.0 Pro</p>
            <p>Designed and crafted for Ferdous Gazi (FG)</p>
            <p className="text-slate-500">All data saved locally with phone account persistence</p>
          </div>
        </div>
      </div>
    </div>
  );
};
