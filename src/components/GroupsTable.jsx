import { X } from 'lucide-react';
import { GROUPS, TEAMS } from '../data/teams.js';
import { calculateStandings } from '../lib/standings.js';

function GroupCard({ letter, teamKeys, results, isHighlight }) {
  const hasGames = (results || []).some((r) => r && r.length > 0);
  const standings = calculateStandings(teamKeys, results || []);

  return (
    <div
      className="border-2 border-stone-900 flex flex-col"
      style={isHighlight ? { backgroundColor: '#FFD500' } : { backgroundColor: '#F0E5CC' }}
    >
      <div className="border-b-2 border-stone-900 px-3 py-1.5 flex items-center justify-between">
        <span className="f-display text-xl">GRUPO {letter}</span>
        {isHighlight && (
          <span className="f-mono text-[10px] uppercase tracking-widest font-bold">★ BRASIL</span>
        )}
      </div>

      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-[1fr_22px_22px_22px_22px_28px] gap-1 px-3 py-1 text-[9px] uppercase tracking-widest text-stone-600 border-b border-stone-900/20 f-mono">
        <span>time</span>
        <span className="text-right">{hasGames ? 'pts' : 'ovr'}</span>
        <span className="text-right">v</span>
        <span className="text-right">e</span>
        <span className="text-right">d</span>
        <span className="text-right">sg</span>
      </div>

      {/* Linhas de classificação */}
      {standings.map((row, idx) => {
        const t = TEAMS[row.team];
        if (!t) return null;
        const isBrazil = row.team === 'BRA';
        const qualified = hasGames && idx < 2; // top 2 classificam direto
        return (
          <div
            key={row.team}
            className={`grid grid-cols-[1fr_22px_22px_22px_22px_28px] gap-1 px-3 py-1 text-xs border-b border-stone-900/15 last:border-b-0 ${qualified ? 'bg-emerald-100/40' : ''} ${isBrazil ? 'font-black' : ''}`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <span className="text-base leading-none select-none">{t.flag}</span>
              <span className="f-body text-[11px] truncate">{t.short}</span>
            </span>
            <span className="text-right f-mono font-bold">
              {hasGames ? row.pts : t.rating}
            </span>
            <span className="text-right f-mono">{hasGames ? row.w : '—'}</span>
            <span className="text-right f-mono">{hasGames ? row.d : '—'}</span>
            <span className="text-right f-mono">{hasGames ? row.l : '—'}</span>
            <span className="text-right f-mono">
              {hasGames ? (row.gd > 0 ? `+${row.gd}` : row.gd) : '—'}
            </span>
          </div>
        );
      })}

      {/* Resultados por rodada */}
      {hasGames && (
        <div className="border-t-2 border-stone-900 bg-white/40 px-2 py-1.5 flex-1">
          {results.map((round, ri) => (
            <div key={ri} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="f-mono text-[9px] uppercase tracking-widest text-stone-500 w-5">
                R{ri + 1}
              </span>
              {round.map((g, gi) => (
                <span key={gi} className="f-mono text-[10px] whitespace-nowrap">
                  {g.home}{' '}
                  <span className="font-black">
                    {g.homeGoals}–{g.awayGoals}
                  </span>{' '}
                  {g.away}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GroupsTable({ onClose, highlightGroup, groupResults }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 anim-fade-in"
      style={{ backgroundColor: 'rgba(20, 12, 0, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="paper relative max-w-6xl w-full max-h-[92vh] overflow-y-auto border-2 border-stone-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 border-b-2 border-stone-900 px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: '#FFD500' }}
        >
          <div className="flex items-baseline gap-3">
            <span className="f-display text-2xl">GROUPS</span>
            <span className="f-serif-i text-sm text-stone-700">
              FIFA World Cup 2026 · USA · Canadá · México
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="border-2 border-stone-900 p-1.5 hover:bg-stone-900 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
          {Object.entries(GROUPS).map(([letter, teamKeys]) => (
            <GroupCard
              key={letter}
              letter={letter}
              teamKeys={teamKeys}
              results={(groupResults || {})[letter]}
              isHighlight={letter === highlightGroup}
            />
          ))}
        </div>

        <div className="border-t border-stone-900/30 px-6 py-3 f-serif-i text-xs text-stone-600 text-center">
          fundo verde = 2 melhores classificam direto · clique fora pra fechar
        </div>
      </div>
    </div>
  );
}
