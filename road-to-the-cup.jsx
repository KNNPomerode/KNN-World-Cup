import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ChevronRight, Star, Zap, Target, Award, RefreshCw, Sparkles, X, Check, Volleyball } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// 🎨 STYLES — fontes, texturas e animações
// Em produção, você pode mover isso para um arquivo .css separado.
// ════════════════════════════════════════════════════════════════════════════

const STYLES_CSS = `
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

  .anim-shake     { animation: shake 0.55s ease; }
  .anim-goal      { animation: goal-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .anim-slide-up  { animation: slide-up 0.55s ease-out forwards; }
  .anim-fade-in   { animation: fade-in 0.45s ease-out forwards; }
  .anim-ball      { animation: ball-bounce 1.3s ease-in-out infinite; }
  .anim-glow      { animation: glow-pulse 1.6s infinite; }
  .anim-confetti  { animation: confetti 3.2s linear forwards; }
  .anim-flag      { animation: flag-wave 2.5s ease-in-out infinite; }
  .anim-ticker    { animation: ticker 35s linear infinite; }

  .stagger-1 { animation-delay: 0.08s; opacity: 0; }
  .stagger-2 { animation-delay: 0.16s; opacity: 0; }
  .stagger-3 { animation-delay: 0.24s; opacity: 0; }
  .stagger-4 { animation-delay: 0.32s; opacity: 0; }
  .stagger-5 { animation-delay: 0.40s; opacity: 0; }
`;

// ════════════════════════════════════════════════════════════════════════════
// 📊 GAME DATA
//
// ⚽ ADICIONE MAIS JORNADAS AQUI (1958, 1970, 1994, etc.)
//    Cada match precisa de: stage, opponent, flag, city, target (placar real)
// ════════════════════════════════════════════════════════════════════════════

const JOURNEYS = {
  brazil2002: {
    id: 'brazil2002',
    name: 'BRASIL',
    year: 2002,
    edition: 'XVII',
    location: 'Korea & Japan',
    motto: 'Em busca do Penta',
    matches: [
      { id: 1, stage: 'Group Stage',  stageShort: 'Grupo C',  opponent: 'Turkey',     opponentShort: 'TUR', flag: '🇹🇷', city: 'Ulsan',     historical: '2–1', context: 'Rivaldo decides it deep into stoppage time. The campaign begins with drama.' },
      { id: 2, stage: 'Group Stage',  stageShort: 'Grupo C',  opponent: 'China',      opponentShort: 'CHN', flag: '🇨🇳', city: 'Seogwipo',  historical: '4–0', context: 'Four different scorers. Roberto Carlos unleashes a free-kick thunderbolt.' },
      { id: 3, stage: 'Group Stage',  stageShort: 'Grupo C',  opponent: 'Costa Rica', opponentShort: 'CRC', flag: '🇨🇷', city: 'Suwon',     historical: '5–2', context: 'Brazil seals top spot. Ronaldo and Rivaldo light up the scoreboard.' },
      { id: 4, stage: 'Round of 16',  stageShort: 'Oitavas',  opponent: 'Belgium',    opponentShort: 'BEL', flag: '🇧🇪', city: 'Kobe',      historical: '2–0', context: 'Rivaldo and Ronaldo punch the ticket to the quarterfinals.' },
      { id: 5, stage: 'Quarterfinal', stageShort: 'Quartas',  opponent: 'England',    opponentShort: 'ENG', flag: '🏴',  city: 'Shizuoka',  historical: '2–1', context: 'Ronaldinho lofts a free-kick over Seaman. The moment of the tournament.' },
      { id: 6, stage: 'Semifinal',    stageShort: 'Semi',     opponent: 'Turkey',     opponentShort: 'TUR', flag: '🇹🇷', city: 'Saitama',   historical: '1–0', context: 'A Ronaldo toe-poke. Brazil reaches a record-extending seventh final.' },
      { id: 7, stage: 'FINAL',        stageShort: 'Final',    opponent: 'Germany',    opponentShort: 'GER', flag: '🇩🇪', city: 'Yokohama',  historical: '2–0', context: 'O Fenômeno scores twice. The Penta is real. The redemption is complete.' },
    ],
  },
  // 📌 EXTENSÃO: adicione 'brazil1970', 'brazil1958', 'brazil1994' aqui seguindo o mesmo schema.
};

// ════════════════════════════════════════════════════════════════════════════
// ❓ QUESTION BANK
//
// 📚 ADICIONE MAIS PERGUNTAS AQUI. Schema:
//    { id, difficulty: 'easy'|'medium'|'hard', category, q, options: [4], correct: 0..3, hint?: string }
//
// ✏️ Categorias atuais: Vocabulary, Grammar, Reading, Idioms.
//    Você pode criar novas (Listening, Pronunciation, Culture, etc.)
// ════════════════════════════════════════════════════════════════════════════

const QUESTIONS = [
  // ─── EASY · Vocabulary ───
  { id: 1,  difficulty: 'easy',   category: 'Vocabulary', q: 'What does "ball" mean in Portuguese?',                     options: ['bola', 'sapato', 'mesa', 'casa'],                       correct: 0 },
  { id: 2,  difficulty: 'easy',   category: 'Vocabulary', q: 'Choose the English word for "campo":',                    options: ['kitchen', 'field', 'beach', 'forest'],                  correct: 1 },
  { id: 3,  difficulty: 'easy',   category: 'Vocabulary', q: 'Who plays inside the goal?',                              options: ['the striker', 'the coach', 'the goalkeeper', 'the referee'], correct: 2 },
  { id: 4,  difficulty: 'easy',   category: 'Vocabulary', q: 'The man with the whistle is the…',                         options: ['fan', 'referee', 'captain', 'doctor'],                  correct: 1 },
  { id: 5,  difficulty: 'easy',   category: 'Vocabulary', q: '"Torcida" in English is…',                                 options: ['team', 'crowd', 'goal', 'jersey'],                      correct: 1 },
  { id: 6,  difficulty: 'easy',   category: 'Vocabulary', q: 'What is the past tense of "win"?',                         options: ['winned', 'wun', 'won', 'wins'],                         correct: 2 },

  // ─── EASY · Grammar ───
  { id: 7,  difficulty: 'easy',   category: 'Grammar',    q: 'Brazil ___ five World Cups.',                              options: ['have', 'has', 'is', 'are'],                              correct: 1 },
  { id: 8,  difficulty: 'easy',   category: 'Grammar',    q: 'I ___ a Brazil supporter.',                                options: ['am', 'is', 'are', 'be'],                                 correct: 0 },
  { id: 9,  difficulty: 'easy',   category: 'Grammar',    q: 'Ronaldo ___ very fast.',                                   options: ['run', 'runs', 'running', 'ran'],                         correct: 1 },
  { id: 10, difficulty: 'easy',   category: 'Grammar',    q: 'Choose the correct article: ___ goalkeeper is tall.',     options: ['A', 'An', 'The', '— (no article)'],                      correct: 2 },
  { id: 11, difficulty: 'easy',   category: 'Grammar',    q: 'They ___ playing football right now.',                     options: ['is', 'am', 'are', 'be'],                                 correct: 2 },
  { id: 12, difficulty: 'easy',   category: 'Grammar',    q: 'Pick the plural: one match, two ___.',                     options: ['matchs', 'matches', 'matchies', 'match'],                correct: 1 },

  // ─── MEDIUM · Vocabulary ───
  { id: 13, difficulty: 'medium', category: 'Vocabulary', q: 'A "draw" in football means…',                              options: ['a victory', 'a tie', 'a foul', 'a substitution'],        correct: 1 },
  { id: 14, difficulty: 'medium', category: 'Vocabulary', q: 'Which verb means "to score a goal"?',                      options: ['to defend', 'to net', 'to tackle', 'to pass'],           correct: 1 },
  { id: 15, difficulty: 'medium', category: 'Vocabulary', q: '"Stoppage time" is also called…',                          options: ['halftime', 'extra time', 'injury time', 'penalty time'], correct: 2 },
  { id: 16, difficulty: 'medium', category: 'Vocabulary', q: 'A player who never gives up is…',                          options: ['lazy', 'tireless', 'careless', 'fearful'],               correct: 1 },
  { id: 17, difficulty: 'medium', category: 'Vocabulary', q: 'The captain wears the…',                                   options: ['boots', 'armband', 'gloves', 'medal'],                   correct: 1 },

  // ─── MEDIUM · Grammar ───
  { id: 18, difficulty: 'medium', category: 'Grammar',    q: 'I ___ never been to a World Cup final.',                  options: ['have', 'has', 'am', 'was'],                              correct: 0 },
  { id: 19, difficulty: 'medium', category: 'Grammar',    q: 'Brazil won the Cup ___ 2002.',                             options: ['on', 'at', 'in', 'since'],                               correct: 2 },
  { id: 20, difficulty: 'medium', category: 'Grammar',    q: 'If we score, we ___ the match.',                           options: ['win', 'will win', 'won', 'would win'],                   correct: 1 },
  { id: 21, difficulty: 'medium', category: 'Grammar',    q: 'Ronaldo ___ two goals in the final.',                      options: ['scored', 'scores', 'has scoring', 'is scored'],          correct: 0 },
  { id: 22, difficulty: 'medium', category: 'Grammar',    q: 'The match ___ at 8 PM tomorrow.',                          options: ['start', 'starts', 'will starting', 'is start'],          correct: 1 },
  { id: 23, difficulty: 'medium', category: 'Grammar',    q: 'She ___ football since she was five.',                     options: ['plays', 'is playing', 'has played', 'played'],           correct: 2 },

  // ─── HARD · Grammar ───
  { id: 24, difficulty: 'hard',   category: 'Grammar',    q: 'If Brazil ___ the penalty, they would have won earlier.', options: ['scored', 'had scored', 'has scored', 'were scoring'],   correct: 1 },
  { id: 25, difficulty: 'hard',   category: 'Grammar',    q: 'The trophy ___ by the captain.',                           options: ['lifted', 'was lifted', 'has lifting', 'lifts'],         correct: 1 },
  { id: 26, difficulty: 'hard',   category: 'Grammar',    q: 'The coach insisted that every player ___ his best.',      options: ['gives', 'give', 'gave', 'is giving'],                    correct: 1 },
  { id: 27, difficulty: 'hard',   category: 'Grammar',    q: 'By the time the final whistle blew, Brazil ___ five times.', options: ['scored', 'has scored', 'had scored', 'was scoring'], correct: 2 },

  // ─── HARD · Idioms & Reading ───
  { id: 28, difficulty: 'hard',   category: 'Idioms',     q: '"To score against the run of play" means to score…',      options: ['easily', 'when not dominating', 'after a penalty', 'in the last minute'], correct: 1 },
  { id: 29, difficulty: 'hard',   category: 'Idioms',     q: '"It\'s a game of two halves" suggests that…',              options: ['the score is even', 'matches can change suddenly', 'extra time is needed', 'both teams scored'], correct: 1 },
  { id: 30, difficulty: 'hard',   category: 'Idioms',     q: '"To park the bus" tactically means to…',                   options: ['attack non-stop', 'play very defensively', 'rotate the squad', 'argue with the ref'], correct: 1 },
  { id: 31, difficulty: 'hard',   category: 'Vocabulary', q: 'A "screamer" in football is…',                             options: ['an angry fan', 'a long-range goal', 'a yellow card', 'the referee'],     correct: 1 },
  { id: 32, difficulty: 'hard',   category: 'Reading',    q: '"Brazil dominated possession but could not break through." It means Brazil…', options: ['scored many goals', 'controlled the ball but did not score', 'lost the match', 'played defensively'], correct: 1 },
  { id: 33, difficulty: 'hard',   category: 'Vocabulary', q: 'A "comeback" in a match is…',                              options: ['a substitution', 'recovering from being behind', 'a foul', 'injury time'], correct: 1 },
];

// ════════════════════════════════════════════════════════════════════════════
// 🛠️ HELPERS
// ════════════════════════════════════════════════════════════════════════════

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Sorteia N perguntas balanceando dificuldade
const pickQuestions = (count = 5) => {
  // Estratégia simples: 40% easy, 40% medium, 20% hard
  const easy   = shuffle(QUESTIONS.filter(q => q.difficulty === 'easy'));
  const medium = shuffle(QUESTIONS.filter(q => q.difficulty === 'medium'));
  const hard   = shuffle(QUESTIONS.filter(q => q.difficulty === 'hard'));
  const nE = Math.ceil(count * 0.4);
  const nM = Math.ceil(count * 0.4);
  const nH = count - nE - nM;
  return shuffle([...easy.slice(0, nE), ...medium.slice(0, nM), ...hard.slice(0, nH)]);
};

// ════════════════════════════════════════════════════════════════════════════
// 🎮 COMPONENTES
// ════════════════════════════════════════════════════════════════════════════

// ── Cabeçalho do programa (recorrente em várias telas) ────────────────────
const ProgramHeader = ({ subtitle }) => (
  <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2 mb-6">
    <div className="flex items-baseline gap-3">
      <div className="f-display text-2xl">ROAD&nbsp;TO&nbsp;THE&nbsp;CUP</div>
      <div className="f-serif-i text-sm text-stone-600">an English challenge</div>
    </div>
    <div className="f-mono text-xs uppercase text-stone-600">{subtitle}</div>
  </div>
);

// ── Ticker decorativo (rolagem horizontal infinita) ──────────────────────
const Ticker = ({ items }) => {
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-stone-900" style={{ backgroundColor: '#FFD500' }}>
      <div className="anim-ticker inline-flex whitespace-nowrap py-1.5">
        {repeated.map((it, i) => (
          <span key={i} className="f-display text-lg uppercase mx-6 inline-flex items-center gap-3">
            {it}
            <span className="text-stone-900">★</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Tela 1 · Boas-vindas / Capa do programa ──────────────────────────────
const WelcomeScreen = ({ onStart, journey }) => (
  <div className="paper min-h-screen flex flex-col relative overflow-hidden">
    {/* Bordas decorativas */}
    <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />
    <div className="absolute inset-6 border border-stone-900/40 pointer-events-none" />

    <div className="relative z-10 px-10 pt-10 pb-6">
      <div className="flex items-center justify-between mb-12">
        <div className="f-mono text-xs uppercase tracking-widest">
          edition <span className="font-bold">{journey.edition}</span> · the official programme
        </div>
        <div className="f-mono text-xs uppercase tracking-widest">№ 01</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <div className="f-serif-i text-xl text-stone-700 mb-2 anim-slide-up stagger-1">presents a journey</div>
          <h1 className="f-display text-[10rem] leading-[0.85] anim-slide-up stagger-2" style={{ color: '#1A1A1A' }}>
            ROAD<br/>TO&nbsp;THE<br/>CUP
          </h1>
          <div className="mt-4 f-serif-i text-2xl text-stone-700 anim-slide-up stagger-3">
            an English-language challenge
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
          <div className="anim-slide-up stagger-3">
            <div className="f-mono text-xs uppercase mb-1">starring</div>
            <div className="f-display text-7xl leading-none">{journey.name}</div>
            <div className="f-display text-5xl leading-none" style={{ color: '#D62828' }}>{journey.year}</div>
            <div className="f-serif-i mt-1 text-stone-700">{journey.location}</div>
          </div>

          <div className="anim-slide-up stagger-4 mt-6 p-4 border-2 border-stone-900" style={{ backgroundColor: '#FFD500' }}>
            <div className="f-mono text-xs uppercase mb-1">the mission</div>
            <div className="f-serif text-lg font-bold leading-tight">
              {journey.matches.length} matches. {journey.matches.length * 5} questions. One trophy.
            </div>
          </div>
        </div>
      </div>
    </div>

    <Ticker items={['answer correctly', 'score a goal', 'win the match', 'lift the trophy', 'speak english', 'become the penta']} />

    <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-10">
      <div className="text-center anim-slide-up stagger-5">
        <div className="f-serif-i text-lg text-stone-700 mb-4">When you're ready…</div>
        <button
          onClick={onStart}
          className="anim-glow group inline-flex items-center gap-4 px-10 py-5 border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition"
        >
          <Volleyball className="w-7 h-7 anim-ball" />
          <span className="f-display text-3xl">KICK OFF</span>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition" />
        </button>
        <div className="f-mono text-xs uppercase tracking-widest mt-6 text-stone-600">
          7 matches · group stage → final
        </div>
      </div>
    </div>

    <div className="relative z-10 px-10 pb-6">
      <div className="border-t border-stone-900/30 pt-3 flex items-center justify-between f-mono text-[10px] uppercase tracking-widest text-stone-600">
        <span>{journey.motto}</span>
        <span>★ english · sports · victory ★</span>
        <span>vol. 1</span>
      </div>
    </div>
  </div>
);

// ── Tela 2 · Pré-jogo · Programa da partida ──────────────────────────────
const PreMatchScreen = ({ match, matchIndex, total, onStart, stats }) => (
  <div className="paper min-h-screen relative">
    <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />
    <div className="relative z-10 px-10 py-10">
      <ProgramHeader subtitle={`match ${matchIndex + 1} of ${total}`} />

      <div className="text-center mb-8 anim-slide-up stagger-1">
        <div className="f-mono text-xs uppercase tracking-widest text-stone-600">match {String(matchIndex + 1).padStart(2, '0')} · {match.stage}</div>
        <div className="f-serif-i text-stone-700 text-lg mt-1">{match.city}</div>
      </div>

      <div className="grid grid-cols-3 items-center gap-4 my-12">
        {/* Brasil */}
        <div className="text-center anim-slide-up stagger-2">
          <div className="text-7xl anim-flag">🇧🇷</div>
          <div className="f-display text-5xl mt-3">BRA</div>
          <div className="f-serif-i text-stone-700">a Seleção</div>
        </div>

        <div className="text-center anim-slide-up stagger-3">
          <div className="f-display text-8xl text-stone-400">vs</div>
          <div className="f-mono text-xs uppercase mt-2">historical result: {match.historical}</div>
        </div>

        {/* Adversário */}
        <div className="text-center anim-slide-up stagger-4">
          <div className="text-7xl anim-flag">{match.flag}</div>
          <div className="f-display text-5xl mt-3">{match.opponentShort}</div>
          <div className="f-serif-i text-stone-700">{match.opponent}</div>
        </div>
      </div>

      {/* Contexto editorial */}
      <div className="max-w-2xl mx-auto border-l-4 pl-5 py-2 anim-slide-up stagger-4" style={{ borderColor: '#D62828' }}>
        <div className="f-mono text-xs uppercase mb-1" style={{ color: '#D62828' }}>the story</div>
        <p className="f-serif text-lg leading-snug text-stone-800">{match.context}</p>
      </div>

      {/* Placar acumulado */}
      <div className="max-w-md mx-auto mt-8 anim-slide-up stagger-5 grid grid-cols-3 gap-3 text-center">
        <div className="border-2 border-stone-900 py-2"><div className="f-mono text-[10px] uppercase">wins</div><div className="f-display text-2xl">{stats.wins}</div></div>
        <div className="border-2 border-stone-900 py-2" style={{ backgroundColor: '#FFD500' }}><div className="f-mono text-[10px] uppercase">accuracy</div><div className="f-display text-2xl">{stats.total ? Math.round((stats.correct / stats.total) * 100) : 0}%</div></div>
        <div className="border-2 border-stone-900 py-2"><div className="f-mono text-[10px] uppercase">goals</div><div className="f-display text-2xl">{stats.goalsFor}</div></div>
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

// ── Tela 3 · Gameplay · Partida em andamento ─────────────────────────────
const MatchScreen = ({ match, questions, brazilGoals, opponentGoals, currentQ, lastAnswer, showGoal, onAnswer }) => {
  const question = questions[currentQ];

  return (
    <div className="paper-dark min-h-screen text-stone-100 relative overflow-hidden scanlines">
      {/* Estádio: arquibancada estilizada */}
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
            <span className={`f-display text-5xl ${lastAnswer === 'correct' ? 'anim-goal' : ''}`} style={{ color: '#FFD500' }}>{brazilGoals}</span>
            <span className="text-stone-100/40 text-2xl">–</span>
            <span className={`f-display text-5xl ${lastAnswer === 'wrong' ? 'anim-goal' : ''}`} style={{ color: '#FF6B6B' }}>{opponentGoals}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="f-display text-3xl">{match.opponentShort}</span>
            <span className="text-3xl">{match.flag}</span>
          </div>
        </div>

        {/* Mini info bar */}
        <div className="max-w-5xl mx-auto mt-2 flex items-center justify-between f-mono text-[10px] uppercase tracking-widest text-stone-100/60">
          <span>{match.stage} · {match.city}</span>
          <span>question {currentQ + 1} of {questions.length}</span>
          <span className="flex gap-1">
            {questions.map((_, i) => (
              <span key={i} className={`w-2 h-2 ${i < currentQ ? 'bg-stone-100/70' : i === currentQ ? 'bg-yellow-400' : 'bg-stone-100/20'}`} />
            ))}
          </span>
        </div>
      </div>

      {/* Overlay: GOAL ou MISSED */}
      {lastAnswer && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none anim-fade-in">
          <div className={`f-display text-[12rem] leading-none ${lastAnswer === 'correct' ? 'anim-goal' : 'anim-shake'}`}
               style={{ color: lastAnswer === 'correct' ? '#FFD500' : '#FF6B6B', textShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
            {lastAnswer === 'correct' ? 'GOOOAL!' : 'MISSED!'}
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
                <span className="f-mono text-xs uppercase tracking-widest font-bold">{question.category}</span>
              </div>
              <span className="f-mono text-xs uppercase tracking-widest font-bold">
                {question.difficulty === 'easy' ? '★ rookie' : question.difficulty === 'medium' ? '★★ pro' : '★★★ legend'}
              </span>
            </div>

            {/* Pergunta */}
            <div className="px-6 py-6 border-b-2 border-stone-900">
              <div className="f-mono text-[10px] uppercase text-stone-500 mb-2">the question</div>
              <h3 className="f-serif text-2xl font-bold leading-snug">{question.q}</h3>
            </div>

            {/* Opções */}
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
            Choose carefully — correct answers find the net.
          </div>
        </div>
      )}

      {/* Linha do gol decorativa (ao fundo) */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-stone-100/40" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-12 border-2 border-t-0 border-stone-100/40" />
    </div>
  );
};

// ── Tela 4 · Fim de partida (vitória, empate, derrota) ────────────────────
const MatchEndScreen = ({ match, brazilGoals, opponentGoals, isFinal, onNext, onRetry }) => {
  const won = brazilGoals > opponentGoals;
  const draw = brazilGoals === opponentGoals;
  const verdict = won ? 'VICTORY' : draw ? 'DRAW' : 'DEFEAT';
  const accent = won ? '#1B7F3E' : draw ? '#A38400' : '#B83227';

  return (
    <div className="paper min-h-screen flex flex-col relative">
      <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />

      {/* Confete quando vence */}
      {won && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
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
          <div className="f-mono text-xs uppercase tracking-widest mb-3 anim-slide-up stagger-1">full time · {match.stage}</div>

          <div className="f-display leading-none anim-slide-up stagger-2" style={{ fontSize: '8rem', color: accent }}>
            {verdict}
          </div>

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
              <div className="text-6xl">{match.flag}</div>
              <div className="f-display text-4xl mt-2">{match.opponentShort}</div>
            </div>
          </div>

          <div className="border-y-2 border-stone-900 py-3 px-4 max-w-xl mx-auto anim-slide-up stagger-4">
            <div className="f-serif-i text-stone-700">historical result was</div>
            <div className="f-display text-3xl">{match.historical}</div>
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
};

// ── Tela 5 · Trophy / Tela final ────────────────────────────────────────
const TrophyScreen = ({ stats, journey, onRestart }) => {
  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  const isPenta = stats.wins === journey.matches.length;

  return (
    <div className="paper min-h-screen relative overflow-hidden">
      <div className="absolute inset-4 border-2 border-stone-900 pointer-events-none" />

      {/* Confete contínuo */}
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
        <div className="f-mono text-xs uppercase tracking-widest mb-2 anim-slide-up stagger-1">final whistle · {journey.location} · {journey.year}</div>
        <div className="f-serif-i text-2xl text-stone-700 anim-slide-up stagger-2">Brasil are…</div>
        <h1 className="f-display anim-slide-up stagger-3 leading-none" style={{ fontSize: '10rem', color: isPenta ? '#1B7F3E' : '#1A1A1A' }}>
          {isPenta ? 'CAMPEÕES!' : 'FINALISTS'}
        </h1>
        <div className="anim-slide-up stagger-3 text-7xl">🏆</div>

        <div className="max-w-3xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 anim-slide-up stagger-4">
          <StatBox label="matches won"  value={stats.wins} accent="#1B7F3E" />
          <StatBox label="goals scored" value={stats.goalsFor} accent="#FFD500" />
          <StatBox label="accuracy"     value={`${accuracy}%`} accent="#D62828" />
          <StatBox label="questions"    value={stats.total} accent="#1A1A1A" />
        </div>

        <div className="max-w-xl mx-auto mt-10 f-serif-i text-xl text-stone-700 anim-slide-up stagger-5">
          {isPenta
            ? `"O Penta is real. Five stars on the chest. Your English carried Brasil home."`
            : `"A noble campaign. The journey continues — try again to lift the trophy."`}
        </div>

        <button onClick={onRestart} className="anim-slide-up stagger-5 mt-10 inline-flex items-center gap-3 px-8 py-4 border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition">
          <RefreshCw className="w-5 h-5" />
          <span className="f-display text-2xl">NEW CAMPAIGN</span>
        </button>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, accent }) => (
  <div className="border-2 border-stone-900 p-4 text-center">
    <div className="f-mono text-[10px] uppercase tracking-widest text-stone-600 mb-1">{label}</div>
    <div className="f-display text-5xl leading-none" style={{ color: accent }}>{value}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 🚀 MAIN APP — gerencia o estado do jogo
// ════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [phase, setPhase] = useState('welcome'); // welcome · preMatch · inMatch · matchEnd · trophy
  const [matchIndex, setMatchIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [brazilGoals, setBrazilGoals] = useState(0);
  const [opponentGoals, setOpponentGoals] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 });

  const journey = JOURNEYS.brazil2002;
  const currentMatch = journey.matches[matchIndex];

  // Inicia partida
  const startMatch = () => {
    setQuestions(pickQuestions(5));
    setCurrentQ(0);
    setBrazilGoals(0);
    setOpponentGoals(0);
    setLastAnswer(null);
    setPhase('inMatch');
  };

  // Processa resposta
  const handleAnswer = (selectedIndex) => {
    const q = questions[currentQ];
    const correct = selectedIndex === q.correct;
    setLastAnswer(correct ? 'correct' : 'wrong');

    if (correct) {
      setBrazilGoals(g => g + 1);
      setStats(s => ({ ...s, correct: s.correct + 1, total: s.total + 1, goalsFor: s.goalsFor + 1 }));
    } else {
      setOpponentGoals(g => g + 1);
      setStats(s => ({ ...s, total: s.total + 1, goalsAgainst: s.goalsAgainst + 1 }));
    }

    setTimeout(() => {
      setLastAnswer(null);
      if (currentQ + 1 >= questions.length) {
        // Encerra a partida
        if (correct ? brazilGoals + 1 > opponentGoals : brazilGoals > opponentGoals + 1 || brazilGoals > opponentGoals) {
          // Vitória
          setStats(s => ({ ...s, wins: s.wins + 1 }));
        }
        setPhase('matchEnd');
      } else {
        setCurrentQ(q => q + 1);
      }
    }, 1700);
  };

  const nextMatch = () => {
    if (matchIndex + 1 >= journey.matches.length) {
      setPhase('trophy');
    } else {
      setMatchIndex(i => i + 1);
      setPhase('preMatch');
    }
  };

  const retryMatch = () => {
    // Remove a vitória que foi contabilizada se o usuário tinha ganhado? Aqui só repete.
    setPhase('preMatch');
  };

  const restart = () => {
    setPhase('welcome');
    setMatchIndex(0);
    setStats({ correct: 0, total: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 });
  };

  return (
    <>
      <style>{STYLES_CSS}</style>

      {phase === 'welcome'  && <WelcomeScreen onStart={() => setPhase('preMatch')} journey={journey} />}
      {phase === 'preMatch' && <PreMatchScreen match={currentMatch} matchIndex={matchIndex} total={journey.matches.length} stats={stats} onStart={startMatch} />}
      {phase === 'inMatch'  && <MatchScreen match={currentMatch} questions={questions} brazilGoals={brazilGoals} opponentGoals={opponentGoals} currentQ={currentQ} lastAnswer={lastAnswer} onAnswer={handleAnswer} />}
      {phase === 'matchEnd' && <MatchEndScreen match={currentMatch} brazilGoals={brazilGoals} opponentGoals={opponentGoals} isFinal={matchIndex === journey.matches.length - 1 && brazilGoals > opponentGoals} onNext={nextMatch} onRetry={retryMatch} />}
      {phase === 'trophy'   && <TrophyScreen stats={stats} journey={journey} onRestart={restart} />}
    </>
  );
}
