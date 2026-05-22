import { RefreshCw } from 'lucide-react';
import StatBox from '../StatBox.jsx';

export default function TrophyScreen({ stats, journey, onRestart }) {
  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  const isHexa = stats.wins === journey.matches.length;

  return (
    <div className="paper min-h-screen relative overflow-hidden">
      <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="anim-confetti absolute w-2 h-3"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-5%',
              backgroundColor: ['#FFD500', '#D62828', '#1B7F3E', '#1A1A1A', '#F0E5CC'][i % 5],
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-10 py-10 text-center">
        <div className="f-mono text-xs uppercase tracking-widest mb-2 anim-slide-up stagger-1">
          final whistle · {journey.location} · {journey.year}
        </div>
        <div className="f-serif-i text-2xl text-stone-700 anim-slide-up stagger-2">Brasil are…</div>
        <h1 className="f-display anim-slide-up stagger-3 leading-none" style={{ fontSize: '10rem', color: isHexa ? '#1B7F3E' : '#1A1A1A' }}>
          {isHexa ? 'HEXA!' : 'FINALISTS'}
        </h1>
        <div className="anim-slide-up stagger-3 text-7xl">🏆</div>

        <div className="max-w-3xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 anim-slide-up stagger-4">
          <StatBox label="matches won"  value={stats.wins} accent="#1B7F3E" />
          <StatBox label="goals scored" value={stats.goalsFor} accent="#FFD500" />
          <StatBox label="accuracy"     value={`${accuracy}%`} accent="#D62828" />
          <StatBox label="questions"    value={stats.total} accent="#1A1A1A" />
        </div>

        <div className="max-w-xl mx-auto mt-10 f-serif-i text-xl text-stone-700 anim-slide-up stagger-5">
          {isHexa
            ? `"Hexa. Seis estrelas no peito. O inglês carregou a Seleção até o topo."`
            : `"Uma campanha digna. A jornada continua — recomece e levante a taça."`}
        </div>

        <button onClick={onRestart} className="anim-slide-up stagger-5 mt-10 inline-flex items-center gap-3 px-8 py-4 border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition">
          <RefreshCw className="w-5 h-5" />
          <span className="f-display text-2xl">NEW CAMPAIGN</span>
        </button>
      </div>
    </div>
  );
}
