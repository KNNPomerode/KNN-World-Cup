import { Star, Zap } from 'lucide-react';
import { TYPE_LABELS } from '../../data/questions.js';

export default function MatchScreen({
  match,
  opponent,
  questions,
  brazilGoals,
  opponentGoals,
  currentQ,
  lastAnswer,        // 'goal' | 'chance' | 'wrong' | null
  pendingChance,     // bool — oportunidade ativa que vira gol no próximo acerto
  onAnswer,
}) {
  const question = questions[currentQ];
  const typeLabel = question ? TYPE_LABELS[question.type] : null;

  const overlayConfig = {
    goal:   { text: 'GOOOAL!', color: '#FFD500', anim: 'anim-goal'  },
    chance: { text: 'CHANCE!', color: '#7CFFAA', anim: 'anim-goal'  },
    wrong:  { text: 'MISSED!', color: '#FF6B6B', anim: 'anim-shake' },
  };
  const overlay = lastAnswer ? overlayConfig[lastAnswer] : null;

  return (
    <div className="paper-dark min-h-screen text-stone-100 relative overflow-hidden scanlines">
      {/* Arquibancada estilizada */}
      <div className="absolute top-0 left-0 right-0 h-24 crowd-dots text-stone-100/30" />
      <div className="absolute top-24 left-0 right-0 h-1 bg-stone-100/40" />

      {/* Scoreboard */}
      <div className="relative z-10 pt-6 px-6">
        <div className="max-w-5xl mx-auto border-2 border-stone-100/30 p-4 flex items-center justify-between" style={{ backgroundColor: '#0F1F14' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇧🇷</span>
            <span className="f-display text-3xl">BRA</span>
          </div>
          <div className="flex items-center gap-5 f-mono">
            <span className={`f-display text-5xl ${lastAnswer === 'goal' ? 'anim-goal' : ''}`} style={{ color: '#FFD500' }}>
              {brazilGoals}
            </span>
            <span className="text-stone-100/40 text-2xl">–</span>
            <span className={`f-display text-5xl ${lastAnswer === 'wrong' ? 'anim-goal' : ''}`} style={{ color: '#FF6B6B' }}>
              {opponentGoals}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="f-display text-3xl">{opponent.short}</span>
            <span className="text-3xl">{opponent.flag}</span>
          </div>
        </div>

        {/* Mini info bar */}
        <div className="max-w-5xl mx-auto mt-2 flex items-center justify-between f-mono text-[10px] uppercase tracking-widest text-stone-100/60">
          <span>{match.stage} · {match.city.split(' · ')[0]}</span>
          <span>question {currentQ + 1} of {questions.length}</span>
          <span className="flex gap-1">
            {questions.map((_, i) => (
              <span key={i} className={`w-2 h-2 ${i < currentQ ? 'bg-stone-100/70' : i === currentQ ? 'bg-yellow-400' : 'bg-stone-100/20'}`} />
            ))}
          </span>
        </div>

        {/* Badge de oportunidade ativa */}
        {pendingChance && !lastAnswer && (
          <div className="max-w-5xl mx-auto mt-2 flex justify-center">
            <div className="anim-chance inline-flex items-center gap-2 px-4 py-1.5 border-2" style={{ backgroundColor: '#7CFFAA', color: '#0F1F14', borderColor: '#0F1F14' }}>
              <Zap className="w-4 h-4" />
              <span className="f-mono text-xs font-bold uppercase tracking-widest">chance pendente · acerte pra converter</span>
            </div>
          </div>
        )}
      </div>

      {/* Overlay GOAL / CHANCE / MISSED */}
      {overlay && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none anim-fade-in">
          <div
            className={`f-display text-[12rem] leading-none ${overlay.anim}`}
            style={{ color: overlay.color, textShadow: '0 0 40px rgba(0,0,0,0.5)' }}
          >
            {overlay.text}
          </div>
        </div>
      )}

      {/* Question Card */}
      {question && !lastAnswer && (
        <div className="relative z-20 max-w-3xl mx-auto px-6 mt-10 anim-slide-up" key={currentQ}>
          <div className="paper text-stone-900 border-2 border-stone-100/40 shadow-2xl">
            {/* Cabeçalho do card */}
            <div className="flex items-center justify-between border-b-2 border-stone-900 px-5 py-2.5" style={{ backgroundColor: '#FFD500' }}>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="f-mono text-xs uppercase tracking-widest font-bold">
                  {typeLabel ? `${typeLabel.icon} ${typeLabel.text}` : 'QUESTION'}
                </span>
              </div>
              <span className="f-mono text-xs uppercase tracking-widest font-bold">BOOK 1</span>
            </div>

            <div className="px-6 py-6 border-b-2 border-stone-900">
              <div className="f-mono text-[10px] uppercase text-stone-500 mb-2">the question</div>
              <h3 className="f-serif text-2xl font-bold leading-snug">{question.q}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onAnswer(i)}
                  className="text-left px-5 py-4 border-b-2 md:border-r-2 border-stone-900/80 last:border-b-0 md:[&:nth-child(2)]:border-r-0 md:[&:nth-child(4)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 hover:bg-stone-900 hover:text-white transition group"
                >
                  <div className="flex items-start gap-3">
                    <span className="f-display text-2xl shrink-0 w-8 group-hover:translate-x-0.5 transition" style={{ color: '#D62828' }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="f-body text-base font-medium pt-1">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 f-serif-i text-center text-stone-100/60 text-sm">
            Choose carefully — correct answers create chances, chances find the net.
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-stone-100/40" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-12 border-2 border-t-0 border-stone-100/40" />
    </div>
  );
}
