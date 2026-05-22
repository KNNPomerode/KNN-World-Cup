// ════════════════════════════════════════════════════════════════════════════
// 🎨 STYLES — fontes Google + texturas + animações.
//    Mantido como string CSS inline pra preservar 100% as animações
//    calibradas. App.jsx injeta via <style>{STYLES_CSS}</style>.
// ════════════════════════════════════════════════════════════════════════════

export const STYLES_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

  .f-display { font-family: 'Anton', sans-serif; letter-spacing: 0.005em; }
  .f-serif   { font-family: 'Fraunces', serif; }
  .f-serif-i { font-family: 'Fraunces', serif; font-style: italic; }
  .f-body    { font-family: 'Manrope', sans-serif; }
  .f-mono    { font-family: 'IBM Plex Mono', monospace; }

  body { font-family: 'Manrope', sans-serif; }

  /* Fundo de papel envelhecido */
  .paper {
    background-color: #F0E5CC;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(120, 80, 0, 0.05) 1px, transparent 1.5px),
      radial-gradient(circle at 70% 60%, rgba(50, 30, 0, 0.06) 1px, transparent 1.2px),
      radial-gradient(circle at 90% 10%, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
    background-size: 9px 9px, 13px 13px, 17px 17px;
  }

  .paper-dark {
    background-color: #1A2A1F;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.025) 1px, transparent 1.5px),
      radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.02) 1px, transparent 1.2px);
    background-size: 11px 11px, 15px 15px;
  }

  /* Padrão estilo torcida */
  .crowd-dots {
    background-image: radial-gradient(circle, currentColor 1.2px, transparent 1.5px);
    background-size: 7px 7px;
  }

  /* Listras sutis tipo TV antiga */
  .scanlines::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.04) 3px, transparent 4px);
    background-size: 100% 4px;
    pointer-events: none;
  }

  /* Animações */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-7px) rotate(-1deg); }
    40% { transform: translateX(7px) rotate(1deg); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  @keyframes goal-pop {
    0%   { transform: scale(0) rotate(-25deg); opacity: 0; }
    55%  { transform: scale(1.35) rotate(8deg); }
    75%  { transform: scale(0.92) rotate(-3deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes slide-up { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fade-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ball-bounce { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(180deg); } }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 200, 0, 0.55); }
    50%      { box-shadow: 0 0 0 16px rgba(255, 200, 0, 0); }
  }
  @keyframes confetti {
    0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes flag-wave {
    0%, 100% { transform: rotate(-2deg) translateY(0); }
    50%      { transform: rotate(2deg) translateY(-2px); }
  }
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes chance-pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.06); }
  }
  @keyframes rating-fill {
    from { width: 0%; }
  }

  .anim-shake     { animation: shake 0.55s ease; }
  .anim-goal      { animation: goal-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .anim-slide-up  { animation: slide-up 0.55s ease-out forwards; }
  .anim-fade-in   { animation: fade-in 0.45s ease-out forwards; }
  .anim-ball      { animation: ball-bounce 1.3s ease-in-out infinite; }
  .anim-glow      { animation: glow-pulse 1.6s infinite; }
  .anim-confetti  { animation: confetti 3.2s linear forwards; }
  .anim-flag      { animation: flag-wave 2.5s ease-in-out infinite; }
  .anim-ticker    { animation: ticker 35s linear infinite; }
  .anim-chance    { animation: chance-pulse 1.1s ease-in-out infinite; }
  .anim-rating    { animation: rating-fill 0.9s ease-out; }

  .stagger-1 { animation-delay: 0.08s; opacity: 0; }
  .stagger-2 { animation-delay: 0.16s; opacity: 0; }
  .stagger-3 { animation-delay: 0.24s; opacity: 0; }
  .stagger-4 { animation-delay: 0.32s; opacity: 0; }
  .stagger-5 { animation-delay: 0.40s; opacity: 0; }
`;
