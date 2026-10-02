import React from 'react';

interface Dice3DProps {
  value: number | null;
  isRolling: boolean;
  canRoll: boolean;
  skin?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Dice3D: React.FC<Dice3DProps> = ({
  value,
  isRolling,
  canRoll,
  skin = 'dice_classic',
  onClick,
  size = 'md',
}) => {
  // Dot configurations for values 1 to 6
  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-inner" />;
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 self-center" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-1.5 gap-2 justify-items-center items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full relative p-1.5">
            <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-600" />
            <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-slate-900" />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 p-1.5 gap-1.5 justify-items-center items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
          </div>
        );
      default:
        return <div className="text-xs font-bold text-slate-400">ROLL</div>;
    }
  };

  // Dimensions
  const dim = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-10 h-10' : 'w-13 h-13';

  // Skin background styling
  let skinStyles = 'bg-gradient-to-b from-white via-slate-50 to-slate-200 border-2 border-slate-300 shadow-lg';
  if (skin === 'dice_golden') {
    skinStyles = 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-300 shadow-amber-500/40 shadow-lg text-amber-950';
  } else if (skin === 'dice_ruby') {
    skinStyles = 'bg-gradient-to-b from-rose-400 via-red-600 to-red-800 border-2 border-rose-300 shadow-red-500/40 shadow-lg text-white';
  } else if (skin === 'dice_sapphire') {
    skinStyles = 'bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-800 border-2 border-sky-300 shadow-blue-500/40 shadow-lg text-white';
  } else if (skin === 'dice_cyber') {
    skinStyles = 'bg-gradient-to-b from-orange-400 via-amber-500 to-red-600 border-2 border-amber-300 shadow-orange-500/50 shadow-lg text-white';
  }

  return (
    <button
      type="button"
      onClick={canRoll ? onClick : undefined}
      disabled={!canRoll && !isRolling}
      aria-label="Roll Dice"
      className={`relative ${dim} rounded-xl flex items-center justify-center cursor-pointer transition-all duration-150 select-none
        ${skinStyles}
        ${canRoll ? 'animate-pulse hover:scale-105 active:scale-95 ring-4 ring-amber-400/70 shadow-amber-400/30' : 'opacity-90'}
        ${isRolling ? 'animate-spin' : ''}
      `}
      style={{
        boxShadow: canRoll
          ? '0 10px 25px -5px rgba(245, 158, 11, 0.4), 0 8px 10px -6px rgba(245, 158, 11, 0.4)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="w-full h-full flex items-center justify-center p-1">
        {value !== null ? renderDots(value) : <span className="text-xs font-bold text-slate-500 tracking-wider">TAP</span>}
      </div>
      {canRoll && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-black text-white items-center justify-center">!</span>
        </span>
      )}
    </button>
  );
};
