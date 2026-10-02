import React, { useState } from 'react';
import { Pawn, Player, PlayerColor } from '../types/ludo';
import {
  COLOR_CONFIGS,
  getPawnBoardCoordinate,
  isSafeCoordinate,
  SAFE_TRACK_INDICES,
  TRACK_COORDINATES,
} from '../utils/ludoRules';

interface LudoBoardProps {
  players: Player[];
  activeColor: PlayerColor;
  movablePawnIds: string[];
  diceValue: number | null;
  onPawnClick: (pawn: Pawn) => void;
  pawnSkin?: string;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  activeColor,
  movablePawnIds,
  diceValue,
  onPawnClick,
  pawnSkin = 'pawn_royal',
}) => {
  const [hoveredPawn, setHoveredPawn] = useState<Pawn | null>(null);

  // Group all pawns by (row, col)
  const pawnsByCoord: Record<string, { pawns: { pawn: Pawn; player: Player }[] }> = {};

  for (const player of players) {
    for (const pawn of player.pawns) {
      const coord = getPawnBoardCoordinate(pawn);
      const key = `${coord.row}_${coord.col}`;
      if (!pawnsByCoord[key]) {
        pawnsByCoord[key] = { pawns: [] };
      }
      pawnsByCoord[key].pawns.push({ pawn, player });
    }
  }

  // Calculate destination preview for hovered pawn
  let destinationCoordKey: string | null = null;
  if (hoveredPawn && diceValue !== null && movablePawnIds.includes(hoveredPawn.id)) {
    const targetStep = hoveredPawn.step === -1 ? 0 : hoveredPawn.step + diceValue;
    if (targetStep <= 56) {
      const tempPawn = { ...hoveredPawn, step: targetStep };
      const coord = getPawnBoardCoordinate(tempPawn);
      destinationCoordKey = `${coord.row}_${coord.col}`;
    }
  }

  // Helper to determine cell type and color
  const getCellMeta = (r: number, c: number) => {
    // 1. Red Base (0..5, 0..5)
    if (r <= 5 && c <= 5) return { type: 'BASE', color: 'RED' };
    // 2. Green Base (0..5, 9..14)
    if (r <= 5 && c >= 9) return { type: 'BASE', color: 'GREEN' };
    // 3. Yellow Base (9..14, 9..14)
    if (r >= 9 && c >= 9) return { type: 'BASE', color: 'YELLOW' };
    // 4. Blue Base (9..14, 0..5)
    if (r >= 9 && c <= 5) return { type: 'BASE', color: 'BLUE' };

    // 5. Center Home (6..8, 6..8)
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
      return { type: 'CENTER' };
    }

    // 6. Home lanes (colored tracks to center)
    if (r === 7 && c >= 1 && c <= 5) return { type: 'HOME_LANE', color: 'RED' };
    if (c === 7 && r >= 1 && r <= 5) return { type: 'HOME_LANE', color: 'GREEN' };
    if (r === 7 && c >= 9 && c <= 13) return { type: 'HOME_LANE', color: 'YELLOW' };
    if (c === 7 && r >= 9 && r <= 13) return { type: 'HOME_LANE', color: 'BLUE' };

    // 7. Start squares
    if (r === 6 && c === 1) return { type: 'START', color: 'RED' };
    if (r === 1 && c === 8) return { type: 'START', color: 'GREEN' };
    if (r === 8 && c === 13) return { type: 'START', color: 'YELLOW' };
    if (r === 13 && c === 6) return { type: 'START', color: 'BLUE' };

    // 8. Safe Stars
    if (isSafeCoordinate(r, c)) {
      return { type: 'SAFE_STAR' };
    }

    return { type: 'TRACK' };
  };

  // Render a pawn token
  const renderPawnToken = (pawn: Pawn, player: Player, isStack: boolean = false, indexInStack: number = 0) => {
    const isMovable = movablePawnIds.includes(pawn.id);

    let skinClass = 'from-red-500 via-rose-600 to-red-800 shadow-red-900/80';
    if (pawn.color === 'GREEN') skinClass = 'from-emerald-400 via-emerald-600 to-emerald-800 shadow-emerald-900/80';
    if (pawn.color === 'YELLOW') skinClass = 'from-amber-300 via-amber-500 to-amber-700 shadow-amber-900/80 text-slate-950';
    if (pawn.color === 'BLUE') skinClass = 'from-sky-400 via-blue-600 to-blue-800 shadow-blue-900/80';

    const tokenSize = isStack ? 'w-4 h-4' : 'w-6 h-6 sm:w-7 sm:h-7';

    return (
      <button
        key={pawn.id}
        type="button"
        onClick={() => isMovable && onPawnClick(pawn)}
        onMouseEnter={() => isMovable && setHoveredPawn(pawn)}
        onMouseLeave={() => setHoveredPawn(null)}
        disabled={!isMovable}
        className={`relative ${tokenSize} rounded-full bg-gradient-to-b ${skinClass} border-2 border-white shadow-lg flex items-center justify-center transition-all duration-150 select-none
          ${isMovable ? 'cursor-pointer animate-bounce z-30 scale-110 ring-2 ring-amber-300 shadow-amber-400/80' : 'z-10'}
          ${isStack ? '-ml-1.5 first:ml-0' : ''}
        `}
        style={{
          boxShadow: isMovable
            ? '0 0 14px 4px rgba(245, 158, 11, 0.9), 0 4px 6px -1px rgba(0, 0, 0, 0.6)'
            : '0 3px 6px rgba(0, 0, 0, 0.5)',
        }}
        title={`${player.name} (${pawn.color} #${pawn.index + 1})`}
      >
        <span className="text-[10px] font-black drop-shadow-md">
          {pawnSkin === 'pawn_crystal' ? '◆' : pawnSkin === 'pawn_sphere' ? '●' : '▲'}
        </span>
      </button>
    );
  };

  return (
    <div className="relative w-full max-w-[560px] aspect-square rounded-3xl bg-[#090b12] p-2.5 sm:p-3.5 shadow-2xl border-2 border-amber-500/50 select-none">
      {/* Metallic Gold Corner Brackets */}
      <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

      {/* 15x15 Grid Layout */}
      <div className="w-full h-full grid grid-cols-15 grid-rows-15 gap-[1px] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner">
        {Array.from({ length: 15 }).map((_, row) =>
          Array.from({ length: 15 }).map((_, col) => {
            const meta = getCellMeta(row, col);
            const key = `${row}_${col}`;
            const cellOccupants = pawnsByCoord[key]?.pawns || [];
            const isDestination = destinationCoordKey === key;

            // 1. Quadrant Bases
            if (meta.type === 'BASE') {
              const isBasePawnSlot =
                (row === 2 || row === 3) &&
                (col === 2 || col === 3 || col === 11 || col === 12);

              let baseBg = 'bg-red-950/70 border-red-500/20';
              if (meta.color === 'GREEN') baseBg = 'bg-emerald-950/70 border-emerald-500/20';
              if (meta.color === 'YELLOW') baseBg = 'bg-amber-950/70 border-amber-500/20';
              if (meta.color === 'BLUE') baseBg = 'bg-blue-950/70 border-blue-500/20';

              return (
                <div
                  key={key}
                  className={`relative flex items-center justify-center transition-colors ${baseBg}
                    ${isBasePawnSlot ? 'bg-white/10 ring-1 ring-white/30 rounded-full' : ''}
                  `}
                >
                  {/* Labels */}
                  {row === 1 && col === 1 && (
                    <span className="absolute left-1.5 top-1.5 text-[9px] font-black text-red-300 font-mono tracking-widest drop-shadow">
                      RED
                    </span>
                  )}
                  {row === 1 && col === 13 && (
                    <span className="absolute right-1.5 top-1.5 text-[9px] font-black text-emerald-300 font-mono tracking-widest drop-shadow">
                      GREEN
                    </span>
                  )}
                  {row === 13 && col === 13 && (
                    <span className="absolute right-1.5 bottom-1.5 text-[9px] font-black text-amber-300 font-mono tracking-widest drop-shadow">
                      YELLOW
                    </span>
                  )}
                  {row === 13 && col === 1 && (
                    <span className="absolute left-1.5 bottom-1.5 text-[9px] font-black text-blue-300 font-mono tracking-widest drop-shadow">
                      BLUE
                    </span>
                  )}

                  {cellOccupants.map(({ pawn, player }) => renderPawnToken(pawn, player))}
                </div>
              );
            }

            // 2. Center Victory Apex (6..8, 6..8)
            if (meta.type === 'CENTER') {
              const isApex = row === 7 && col === 7;
              return (
                <div
                  key={key}
                  className="relative flex items-center justify-center bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 shadow-inner overflow-hidden"
                >
                  {/* Triangle directional wedges */}
                  {row === 6 && col === 7 && <div className="absolute inset-0 bg-emerald-500/50" />}
                  {row === 8 && col === 7 && <div className="absolute inset-0 bg-blue-500/50" />}
                  {row === 7 && col === 6 && <div className="absolute inset-0 bg-red-500/50" />}
                  {row === 7 && col === 8 && <div className="absolute inset-0 bg-amber-500/50" />}

                  {isApex && (
                    <div className="z-10 w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-300 flex items-center justify-center shadow-xl">
                      <span className="text-[10px] font-black text-amber-400 tracking-tighter">FG</span>
                    </div>
                  )}

                  {/* Pawns that reached Home */}
                  {cellOccupants.length > 0 && (
                    <div className="absolute z-20 flex flex-wrap items-center justify-center gap-0.5">
                      {cellOccupants.slice(0, 4).map(({ pawn, player }, idx) =>
                        renderPawnToken(pawn, player, true, idx)
                      )}
                    </div>
                  )}
                </div>
              );
            }

            // 3. Track Cells & Home Lanes
            let cellStyle = 'bg-slate-100 text-slate-900';

            if (meta.type === 'HOME_LANE') {
              if (meta.color === 'RED') cellStyle = 'bg-red-600 text-white font-black';
              if (meta.color === 'GREEN') cellStyle = 'bg-emerald-600 text-white font-black';
              if (meta.color === 'YELLOW') cellStyle = 'bg-amber-400 text-slate-950 font-black';
              if (meta.color === 'BLUE') cellStyle = 'bg-blue-600 text-white font-black';
            } else if (meta.type === 'START') {
              if (meta.color === 'RED') cellStyle = 'bg-red-600 text-white font-black';
              if (meta.color === 'GREEN') cellStyle = 'bg-emerald-600 text-white font-black';
              if (meta.color === 'YELLOW') cellStyle = 'bg-amber-400 text-slate-950 font-black';
              if (meta.color === 'BLUE') cellStyle = 'bg-blue-600 text-white font-black';
            }

            return (
              <div
                key={key}
                className={`relative flex items-center justify-center text-xs transition-colors duration-150 select-none
                  ${cellStyle}
                  ${isDestination ? 'ring-2 ring-amber-400 bg-amber-200' : ''}
                `}
              >
                {/* Safe Star Icon */}
                {meta.type === 'SAFE_STAR' && (
                  <span className="text-[12px] text-amber-600 font-black select-none drop-shadow">
                    ★
                  </span>
                )}

                {/* Start Arrow */}
                {meta.type === 'START' && (
                  <span className="text-[10px] font-black drop-shadow select-none">
                    {meta.color === 'RED' ? '▶' : meta.color === 'GREEN' ? '▼' : meta.color === 'YELLOW' ? '◀' : '▲'}
                  </span>
                )}

                {/* Destination landing ring preview */}
                {isDestination && (
                  <div className="absolute inset-0 rounded-sm border-2 border-amber-500 animate-ping opacity-75 pointer-events-none" />
                )}

                {/* Pawns on this cell */}
                {cellOccupants.length === 1 &&
                  renderPawnToken(cellOccupants[0].pawn, cellOccupants[0].player)}

                {cellOccupants.length > 1 && (
                  <div className="relative flex items-center justify-center">
                    {cellOccupants.map(({ pawn, player }, idx) =>
                      renderPawnToken(pawn, player, true, idx)
                    )}
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-slate-950 text-white font-mono font-bold text-[8px] flex items-center justify-center border border-amber-400">
                      {cellOccupants.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
