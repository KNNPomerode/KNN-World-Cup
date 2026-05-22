import { ChevronRight, Activity, Gauge, Shield } from 'lucide-react';
import ProgramHeader from '../ProgramHeader.jsx';
import { opponentTier, scoutAttributes } from '../../lib/simulation.js';

function ScoutBar({ value }) {
  return (
    <div className="border-2 border-stone-900 h-3 relative overflow-hidden" style={{ backgroundColor: '#F0E5CC' }}>
      <div
        className="anim-rating h-full"
        style={{
          width: `${value}%`,
          backgroundColor: '#1A1A1A',
        }}
      />
    </div>
  );
}

function ScoutRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-stone-700" />
      <span className="f-mono text-[10px] uppercase tracking-widest w-12 text-stone-700">{label}</span>
      <div className="flex-1"><ScoutBar value={value} /></div>
      <span className="f-mono text-xs font-bold w-8 text-right">{value}</span>
    </div>
  );
}

export default function PreMatchScreen({ match, opponent, matchIndex, total, onStart, stats }) {
  const tier = opponentTier(opponent.rating);
  const attrs = scoutAttributes(opponent.short, opponent.rating);

  return (
    <div className="paper min-h-screen relative">
      <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />
      <div className="relative z-10 px-10 py-10">
        <ProgramHeader subtitle={`match ${matchIndex + 1} of ${total} · ${match.date}`} />

        <div className="text-center mb-8 anim-slide-up stagger-1">
          <div className="f-mono text-xs uppercase tracking-widest text-stone-600">
            match {String(matchIndex + 1).padStart(2, '0')} · {match.stage}
          </div>
          <div className="f-serif-i text-stone-700 text-lg mt-1">{match.city}</div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4 my-12">
          <div className="text-center anim-slide-up stagger-2">
            <div className="text-7xl anim-flag">🇧🇷</div>
            <div className="f-display text-5xl mt-3">BRA</div>
            <div className="f-serif-i text-stone-700">a Seleção</div>
          </div>

          <div className="text-center anim-slide-up stagger-3">
            <div className="f-display text-8xl text-stone-400">vs</div>
            <div className="f-mono text-xs uppercase mt-2 tracking-widest" style={{ color: tier.accent }}>
              {tier.label}
            </div>
          </div>

          <div className="text-center anim-slide-up stagger-4">
            <div className="text-7xl anim-flag">{opponent.flag}</div>
            <div className="f-display text-5xl mt-3">{opponent.short}</div>
            <div className="f-serif-i text-stone-700">{opponent.name}</div>
          </div>
        </div>

        {/* Scout Report */}
        <div className="max-w-2xl mx-auto border-2 border-stone-900 anim-slide-up stagger-4" style={{ backgroundColor: '#F0E5CC' }}>
          <div className="border-b-2 border-stone-900 px-5 py-2 flex items-center justify-between" style={{ backgroundColor: '#FFD500' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="f-mono text-xs uppercase tracking-widest font-bold">scout report · {opponent.short}</span>
            </div>
            <span className="f-mono text-xs font-bold">{opponent.confederation}</span>
          </div>
          <div className="px-5 py-4 space-y-3">
            <ScoutRow icon={Gauge}    label="rating" value={opponent.rating} />
            <ScoutRow icon={Activity} label="pace"   value={attrs.pace} />
            <ScoutRow icon={Activity} label="flair"  value={attrs.flair} />
            <ScoutRow icon={Activity} label="grit"   value={attrs.grit} />
          </div>
        </div>

        {/* Mood editorial */}
        <div className="max-w-2xl mx-auto mt-6 border-l-4 pl-5 py-2 anim-slide-up stagger-5" style={{ borderColor: '#D62828' }}>
          <div className="f-mono text-xs uppercase mb-1" style={{ color: '#D62828' }}>the story</div>
          <p className="f-serif text-lg leading-snug text-stone-800">{match.mood}</p>
        </div>

        {/* Placar acumulado */}
        <div className="max-w-md mx-auto mt-8 anim-slide-up stagger-5 grid grid-cols-3 gap-3 text-center">
          <div className="border-2 border-stone-900 py-2">
            <div className="f-mono text-[10px] uppercase">wins</div>
            <div className="f-display text-2xl">{stats.wins}</div>
          </div>
          <div className="border-2 border-stone-900 py-2" style={{ backgroundColor: '#FFD500' }}>
            <div className="f-mono text-[10px] uppercase">accuracy</div>
            <div className="f-display text-2xl">{stats.total ? Math.round((stats.correct / stats.total) * 100) : 0}%</div>
          </div>
          <div className="border-2 border-stone-900 py-2">
            <div className="f-mono text-[10px] uppercase">goals</div>
            <div className="f-display text-2xl">{stats.goalsFor}</div>
          </div>
        </div>

        <div className="text-center mt-10 anim-slide-up stagger-5">
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition"
          >
            <span className="f-display text-2xl">ENTER THE PITCH</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </div>
  );
}
