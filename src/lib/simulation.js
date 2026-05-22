// ════════════════════════════════════════════════════════════════════════════
// 🎲 SIMULATION — funções puras de simulação. Sem React, sem estado.
// ════════════════════════════════════════════════════════════════════════════

import { TEAMS } from '../data/teams.js';

// ── Acerto do aluno → gol direto OU oportunidade ────────────────────────────
//
// Regra (baseada no rating do adversário):
//   < 70    → 90% gol direto, 10% chance
//   70–85   → 60% gol direto, 40% chance
//   > 85    → 40% gol direto, 60% chance
//
// "Chance" é uma oportunidade pendente que será convertida no próximo acerto.
// Decisão de design: ver `App.jsx` (conversão de chance permite acertos
// consecutivos marcarem 2 gols).
export function resolveAnswer(opponentRating) {
  const goalChance =
    opponentRating < 70 ? 0.90 :
    opponentRating <= 85 ? 0.60 :
    0.40;
  return Math.random() < goalChance ? 'goal' : 'chance';
}

// ── Erro do aluno → adversário marca? ───────────────────────────────────────
//
// Probabilidade do adversário converter o ataque, função do rating dele:
//   < 70    → 30%
//   70–85   → 55%
//   > 85    → 80%
export function opponentGoalRoll(opponentRating) {
  const scoreChance =
    opponentRating < 70 ? 0.30 :
    opponentRating <= 85 ? 0.55 :
    0.80;
  return Math.random() < scoreChance;
}

// ── simulateOpponent(stage, excludedKeys) ──────────────────────────────────
//
// Sorteia um adversário plausível para a fase de mata-mata informada,
// evitando seleções já enfrentadas e o próprio Brasil.
//
// Faixas de rating por fase (quanto mais avançada, mais forte tende a ser):
//   'Round of 16'  → 70–84
//   'Quarterfinal' → 76–88
//   'Semifinal'    → 82–92
//   'FINAL'        → 86–92
//
// Se nenhum candidato cair na faixa, expande pra ±5 e tenta de novo.
export function simulateOpponent(stage, excludedKeys = []) {
  const ranges = {
    'Round of 16':  [70, 84],
    'Quarterfinal': [76, 88],
    'Semifinal':    [82, 92],
    'FINAL':        [86, 92],
  };

  const exclude = new Set([...excludedKeys, 'BRA']);
  const [min, max] = ranges[stage] ?? [70, 92];

  const inRange = (lo, hi) => Object.entries(TEAMS).filter(
    ([key, t]) => !exclude.has(key) && t.rating >= lo && t.rating <= hi
  );

  let pool = inRange(min, max);
  if (pool.length === 0) pool = inRange(min - 5, max + 5);
  if (pool.length === 0) pool = Object.entries(TEAMS).filter(([key]) => !exclude.has(key));

  // Sorteio ponderado por rating (times mais fortes têm prob proporcional).
  const weights = pool.map(([, t]) => t.rating);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i][0];
  }
  return pool[pool.length - 1][0];
}

// ── Tier do adversário (usado pelo scout report da pré-partida) ────────────
export function opponentTier(rating) {
  if (rating >= 88) return { label: 'ELITE',     accent: '#D62828' };
  if (rating >= 82) return { label: 'CONTENDER', accent: '#B86E00' };
  if (rating >= 75) return { label: 'SOLID',     accent: '#1B7F3E' };
  return { label: 'UNDERDOG', accent: '#1A1A1A' };
}

// ── Atributos cosméticos (Pace / Flair / Grit) pro scout report ────────────
//
// Derivados pseudo-deterministicamente do rating + hash do nome,
// pra ter números que variam entre times mas não mudam entre renders.
export function scoutAttributes(teamKey, rating) {
  const seed = [...teamKey].reduce((a, c) => a + c.charCodeAt(0), 0);
  const wiggle = (offset) => ((seed * (offset + 7)) % 17) - 8; // -8..+8
  const clamp = (v) => Math.max(40, Math.min(99, Math.round(v)));
  return {
    pace:  clamp(rating + wiggle(1)),
    flair: clamp(rating + wiggle(2)),
    grit:  clamp(rating + wiggle(3)),
  };
}
