import React, { useState } from 'react';
import { AccountService } from '../services/accountService';
import { ShopItem, UserProfile } from '../types/user';
import { soundFX } from '../utils/audio';

interface ShopModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserProfile) => void;
}

const DICE_ITEMS: ShopItem[] = [
  {
    id: 'dice_classic',
    type: 'dice',
    name: 'Classic Ivory',
    description: 'The timeless standard white bone dice with deep black dots.',
    price: 0,
    currency: 'coins',
    previewColor: '#f8fafc',
    previewAccent: '#0f172a',
  },
  {
    id: 'dice_golden',
    type: 'dice',
    name: 'Golden Royale',
    description: 'Forged from 24K solid gold with radiant ember sheen.',
    price: 1500,
    currency: 'coins',
    previewColor: '#f59e0b',
    previewAccent: '#78350f',
    badge: 'Popular',
  },
  {
    id: 'dice_cyber',
    type: 'dice',
    name: 'Cyber Fire',
    description: 'Lava-forged titanium dice that leaves a trail of molten sparks.',
    price: 2500,
    currency: 'coins',
    previewColor: '#ea580c',
    previewAccent: '#7c2d12',
    badge: 'Fiery',
  },
  {
    id: 'dice_ruby',
    type: 'dice',
    name: 'Ruby Dragon',
    description: 'Crystallized crimson ruby imbued with fiery luck.',
    price: 3500,
    currency: 'coins',
    previewColor: '#e11d48',
    previewAccent: '#881337',
    badge: 'Epic',
  },
  {
    id: 'dice_sapphire',
    type: 'dice',
    name: 'Sapphire Frost',
    description: 'Deep celestial azure dice with icy glowing corners.',
    price: 5000,
    currency: 'coins',
    previewColor: '#2563eb',
    previewAccent: '#1e3a8a',
    badge: 'Mythic',
  },
];

const PAWN_ITEMS: ShopItem[] = [
  {
    id: 'pawn_royal',
    type: 'pawn',
    name: 'Imperial Triangle',
    description: 'Standard competitive tournament pawn tokens with aerodynamic gloss.',
    price: 0,
    currency: 'coins',
    previewColor: '#ef4444',
    previewAccent: '#ffffff',
  },
  {
    id: 'pawn_crystal',
    type: 'pawn',
    name: 'Prism Crystal',
    description: 'Cut diamond prism tokens that refract light across the track.',
    price: 2000,
    currency: 'coins',
    previewColor: '#38bdf8',
    previewAccent: '#ffffff',
    badge: 'Glow',
  },
  {
    id: 'pawn_sphere',
    type: 'pawn',
    name: 'Orb of Destiny',
    description: 'Weighted polished marble spheres that roll smoothly on each step.',
    price: 3500,
    currency: 'coins',
    previewColor: '#a855f7',
    previewAccent: '#ffffff',
    badge: 'Legendary',
  },
];

const COIN_BUNDLES = [
  { coins: 5000, price: 10, bonus: '+10% Bonus' },
  { coins: 15000, price: 25, bonus: '+25% Bonus', popular: true },
  { coins: 50000, price: 60, bonus: '+50% Mega Pack' },
];

export const ShopModal: React.FC<ShopModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [shopTab, setShopTab] = useState<'dice' | 'pawns' | 'coins'>('dice');

  if (!isOpen) return null;

  const handleBuy = (item: ShopItem) => {
    soundFX.playClick();
    const res = AccountService.purchaseItem(item.id, item.type, item.price, item.currency);
    if (res.success && res.user) {
      soundFX.playHomeCelebration();
      onUserUpdated(res.user);
    }
  };

  const handleEquip = (item: ShopItem) => {
    soundFX.playClick();
    const updated = AccountService.equipItem(item.id, item.type);
    onUserUpdated(updated);
  };

  const handleExchangeDiamonds = (bundle: (typeof COIN_BUNDLES)[0]) => {
    soundFX.playClick();
    if (currentUser.diamonds < bundle.price) {
      alert(`You need ${bundle.price} diamonds for this pack!`);
      return;
    }
    const updated: UserProfile = {
      ...currentUser,
      diamonds: currentUser.diamonds - bundle.price,
      coins: currentUser.coins + bundle.coins,
    };
    AccountService.saveCurrentUser(updated);
    soundFX.playHomeCelebration();
    onUserUpdated(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛍️</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight">
                FG Ludu MAX Shop
              </h2>
              <p className="text-xs text-slate-400">Unlock custom tournament dice & pawn styles</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
              🪙 {currentUser.coins.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-sky-400 font-mono bg-sky-500/10 px-2.5 py-1 rounded-xl border border-sky-500/20">
              💎 {currentUser.diamonds}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-[#08090f]/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setShopTab('dice')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              shopTab === 'dice' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dice Skins ({DICE_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => setShopTab('pawns')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              shopTab === 'pawns' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pawn Tokens ({PAWN_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => setShopTab('coins')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              shopTab === 'coins' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Coin Packs 🪙
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Section 1: Dice Skins */}
          {shopTab === 'dice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DICE_ITEMS.map((item) => {
                const isUnlocked = currentUser.inventory.unlockedDice.includes(item.id);
                const isEquipped = currentUser.inventory.equippedDice === item.id;
                const canAfford = currentUser.coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow font-black text-lg border-2 border-slate-700"
                          style={{
                            backgroundColor: item.previewColor,
                            color: item.previewAccent,
                          }}
                        >
                          🎲
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">{item.name}</h4>
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {item.price === 0 ? 'Free Default' : `${item.price.toLocaleString()} 🪙`}
                      </span>

                      {isEquipped ? (
                        <span className="text-xs font-bold text-amber-400 bg-amber-400/20 px-2.5 py-1 rounded">
                          Equipped
                        </span>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleEquip(item)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg cursor-pointer transition-colors"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                          className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Unlock
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section 2: Pawn Styles */}
          {shopTab === 'pawns' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAWN_ITEMS.map((item) => {
                const isUnlocked = currentUser.inventory.unlockedPawns.includes(item.id);
                const isEquipped = currentUser.inventory.equippedPawn === item.id;
                const canAfford = currentUser.coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shadow font-black text-lg border-2 border-white/60"
                          style={{
                            backgroundColor: item.previewColor,
                            color: item.previewAccent,
                          }}
                        >
                          {item.id === 'pawn_crystal' ? '◆' : item.id === 'pawn_sphere' ? '●' : '▲'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">{item.name}</h4>
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {item.price === 0 ? 'Free Default' : `${item.price.toLocaleString()} 🪙`}
                      </span>

                      {isEquipped ? (
                        <span className="text-xs font-bold text-amber-400 bg-amber-400/20 px-2.5 py-1 rounded">
                          Equipped
                        </span>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleEquip(item)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg cursor-pointer transition-colors"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                          className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Unlock
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section 3: Coin Packs */}
          {shopTab === 'coins' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Exchange earned Diamonds for instant Coin Bundles:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COIN_BUNDLES.map((bundle) => {
                  const canAfford = currentUser.diamonds >= bundle.price;
                  return (
                    <div
                      key={bundle.coins}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                        bundle.popular
                          ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {bundle.bonus}
                      </span>
                      <div className="my-2 text-3xl">🪙</div>
                      <div className="text-base font-black text-white font-mono">
                        +{bundle.coins.toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleExchangeDiamonds(bundle)}
                        disabled={!canAfford}
                        className={`mt-3 w-full py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {bundle.price} 💎 Exchange
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
