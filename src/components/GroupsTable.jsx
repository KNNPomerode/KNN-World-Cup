import { X } from 'lucide-react';
import { GROUPS, TEAMS } from '../data/teams.js';

export default function GroupsTable({ onClose, highlightGroup }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 anim-fade-in"
      style={{ backgroundColor: 'rgba(20, 12, 0, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="paper relative max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-stone-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="sticky top-0 z-10 border-b-2 border-stone-900 px-6 py-3 flex items-center justify-between" style={{ backgroundColor: '#FFD500' }}>
          <div className="flex items-baseline gap-3">
            <span className="f-display text-2xl">GROUPS</span>
            <span className="f-serif-i text-sm text-stone-700">FIFA World Cup 2026 · USA · Canadá · México</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="border-2 border-stone-900 p-1.5 hover:bg-stone-900 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grade dos 12 grupos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {Object.entries(GROUPS).map(([letter, teamKeys]) => {
            const isHighlight = letter === highlightGroup;
            return (
              <div
                key={letter}
                className="border-2 border-stone-900"
                style={isHighlight ? { backgroundColor: '#FFD500' } : { backgroundColor: '#F0E5CC' }}
              >
                <div className="border-b-2 border-stone-900 px-3 py-1.5 flex items-center justify-between">
                  <span className="f-display text-2xl">GRUPO {letter}</span>
                  {isHighlight && (
                    <span className="f-mono text-[10px] uppercase tracking-widest font-bold">★ BRASIL</span>
                  )}
                </div>
                <ul>
                  {teamKeys.map((key) => {
                    const t = TEAMS[key];
                    if (!t) {
                      return (
                        <li key={key} className="flex items-center gap-3 px-3 py-2 border-b border-stone-900/20 last:border-b-0">
                          <span className="text-2xl">❔</span>
                          <span className="f-mono text-sm text-stone-500">{key} (não cadastrado)</span>
                        </li>
                      );
                    }
                    return (
                      <li key={key} className="flex items-center gap-3 px-3 py-2 border-b border-stone-900/20 last:border-b-0">
                        <span className="text-2xl select-none">{t.flag}</span>
                        <span className="f-body text-sm font-bold flex-1">{t.name}</span>
                        <span className="f-mono text-[10px] uppercase tracking-widest text-stone-600">{t.confederation}</span>
                        <span className="f-mono text-xs font-bold w-7 text-right">{t.rating}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-stone-900/30 px-6 py-3 f-serif-i text-xs text-stone-600 text-center">
          composição plausível baseada nos pots por rating · clique fora pra fechar
        </div>
      </div>
    </div>
  );
}
