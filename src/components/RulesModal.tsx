import React from 'react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📖</span>
            <div>
              <h2 className="text-base font-black text-white font-display tracking-tight">How to Play FG Ludu MAX</h2>
              <p className="text-xs text-slate-400">Official Tournament Rules & Mechanics</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <span>🎲</span> Rolling a Six (6)
            </h4>
            <p>
              • A roll of <strong>6</strong> allows you to move a pawn out of your Home Base onto your colored Starting tile.
            </p>
            <p>
              • Rolling a <strong>6</strong> grants you an <strong>extra turn</strong>!
            </p>
            <p>
              • Rolling <strong>three consecutive sixes</strong> forfeits the turn and passes directly to the next player.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-sky-400 text-sm flex items-center gap-2">
              <span>⚔️</span> Capturing Opponent Pawns
            </h4>
            <p>
              • Landing on an opponent’s pawn on an unsafe tile captures it and sends it straight back to their Base!
            </p>
            <p>
              • Capturing an opponent grants an immediate <strong>bonus roll</strong>!
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <span>★</span> Safe Star Squares
            </h4>
            <p>
              • There are <strong>8 Safe Star Squares</strong> on the board (marked with a star ★).
            </p>
            <p>
              • Any pawn resting on a safe star square cannot be captured by any opponent.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-rose-400 text-sm flex items-center gap-2">
              <span>👑</span> Entering Home & Winning
            </h4>
            <p>
              • Once your pawn loops the full 52-cell track, it enters your colored Home Lane.
            </p>
            <p>
              • An <strong>exact roll</strong> is required to enter the center triangle Home.
            </p>
            <p>
              • In <strong>Classic Mode</strong>, the first player to guide all 4 pawns home wins! In <strong>Quick Rush Mode</strong>, first to get 2 pawns home wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
