import { ChevronRight, RefreshCw, Sparkles } from 'lucide-react';

export default function MatchEndScreen({
  match,
  opponent,
  brazilGoals,
  opponentGoals,
  correctCount,        // 0..5
  isFinal,
  onNext,
  onRetry,
}) {
  const won  = brazilGoals > opponentGoals;
  const draw = brazilGoals === opponentGoals;
  const perfectMatch = correctCount === 5; // garantia: vitória limpa
  const verdict = perfectMatch ? 'FLAWLESS' : won ? 'VICTORY' : draw ? 'DRAW' : 'DEFEAT';
  const accent =
    perfectMatch ? '#1B7F3E' :
    won ? '#1B7F3E' :
    draw ? '#A38400' :
    '#B83227';

  return (
    <div className="paper min-h-screen flex flex-col relative">
      <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />

      {/* Confete extra quando 5/5 */}
      {(won || perfectMatch) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: perfectMatch ? 60 : 30 }).map((_, i) => (
            <div
              key={i}
              className="anim-confetti absolute w-2 h-3"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                backgroundColor: ['#FFD500', '#D62828', '#1B7F3E', '#1A1A1A'][i % 4],
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex-1 flex items-center justify-center px-10">
        <div className="text-center max-w-3xl w-full">
          <div className="f-mono text-xs uppercase tracking-widest mb-3 anim-slide-up stagger-1">
            full time · {match.stage}
          </div>

          <div className="f-display leading-none anim-slide-up stagger-2" style={{ fontSize: '8rem', color: accent }}>
            {verdict}
          </div>

          {perfectMatch && (
            <div className="anim-slide-up stagger-2 inline-flex items-center gap-2 mt-2 px-4 py-1.5 border-2 border-stone-900" style={{ backgroundColor: '#FFD500' }}>
              <Sparkles className="w-4 h-4" />
              <span className="f-mono text-xs uppercase tracking-widest font-bold">5/5 · perfect english · clean win</span>
            </div>
          )}

          <div className="my-8 grid grid-cols-3 items-center gap-4 anim-slide-up stagger-3">
            <div className="text-center">
              <div className="text-6xl">🇧🇷</div>
              <div className="f-display text-4xl mt-2">BRA</div>
            </div>
            <div className="f-display text-7xl">
              <span style={{ color: '#1B7F3E' }}>{brazilGoals}</span>
              <span className="text-stone-400 mx-3">–</span>
              <span style={{ color: '#B83227' }}>{opponentGoals}</span>
            </div>
            <div className="text-center">
              <div className="text-6xl">{opponent.flag}</div>
              <div className="f-display text-4xl mt-2">{opponent.short}</div>
            </div>
          </div>

          <div className="border-y-2 border-stone-900 py-3 px-4 max-w-xl mx-auto anim-slide-up stagger-4">
            <div className="f-serif-i text-stone-700">accuracy this match</div>
            <div className="f-display text-3xl">{correctCount} / 5</div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4 anim-slide-up stagger-5">
            {won ? (
              <button onClick={onNext} className="inline-flex items-center gap-3 px-8 py-4 border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition">
                <span className="f-display text-2xl">{isFinal ? 'LIFT THE TROPHY' : 'NEXT MATCH'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button onClick={onRetry} className="inline-flex items-center gap-3 px-8 py-4 border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition">
                  <RefreshCw className="w-5 h-5" />
                  <span className="f-display text-2xl">REPLAY MATCH</span>
                </button>
                <button onClick={onNext} className="inline-flex items-center gap-3 px-8 py-4 border-2 border-stone-900 hover:bg-stone-900 hover:text-white transition">
                  <span className="f-display text-2xl">CONCEDE & MOVE ON</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
