import React from 'react';

interface EmoteBarProps {
  onSendEmote: (emojiText: string) => void;
}

const EMOTES = [
  { text: '🍀 Good Luck!', icon: '🍀' },
  { text: '👏 Well Played!', icon: '👏' },
  { text: '🔥 On Fire!', icon: '🔥' },
  { text: '😂 Haha!', icon: '😂' },
  { text: '😱 Oh No!', icon: '😱' },
  { text: '👑 FG King!', icon: '👑' },
  { text: '⏰ Hurry Up!', icon: '⏰' },
  { text: '💪 GG!', icon: '💪' },
];

export const EmoteBar: React.FC<EmoteBarProps> = ({ onSendEmote }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-2 bg-slate-900/80 backdrop-blur rounded-xl border border-slate-800 shadow-md">
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0 mr-1">
        Chat:
      </span>
      {EMOTES.map((em) => (
        <button
          key={em.text}
          type="button"
          onClick={() => onSendEmote(em.text)}
          className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-xs text-slate-200 rounded-lg border border-slate-700 hover:border-amber-400 transition-all duration-150 whitespace-nowrap cursor-pointer shrink-0"
        >
          {em.text}
        </button>
      ))}
    </div>
  );
};
