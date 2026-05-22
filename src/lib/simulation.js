// ════════════════════════════════════════════════════════════════════════════
// 🎲 SIMULATION — funções puras de simulação. Sem React, sem estado.
// ════════════════════════════════════════════════════════════════════════════

import { TEAMS } from '../data/teams.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
    'Round of 32':  [65, 80],
    'Round of 16':  [72, 86],
    'Quarterfinal': [78, 90],
    'Semifinal':    [83, 92],
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

// ── Curva de probabilidade de vitória pela diferença de rating ─────────────
//
// Ancoras pedidas pelo usuário:
//   diff   0  → 50%  (jogo parelho)
//   diff  10 → 85%
//   diff  20 → 93%
//   diff  30+ → 99%
//
// Interpolação linear por seções (suave o suficiente, sem degraus bruscos).
function probWinUnsigned(absDiff) {
  if (absDiff >= 30) return 0.99;
  if (absDiff >= 20) return 0.93 + (absDiff - 20) * (0.99 - 0.93) / 10;
  if (absDiff >= 10) return 0.85 + (absDiff - 10) * (0.93 - 0.85) / 10;
  return 0.50 + absDiff * (0.85 - 0.50) / 10;
}

// Probabilidades W/D/L da perspectiva do time A (signed diff = ratingA - ratingB).
// Empate decai exponencialmente com |diff|: muito comum em jogos parelhos,
// raro em jogos muito desequilibrados. Simétrico em diff=0.
export function outcomeProbs(diff) {
  const absDiff = Math.abs(diff);
  const wStrong = probWinUnsigned(absDiff);  // prob do mais forte ganhar
  let d = 0.22 * Math.exp(-absDiff / 15);
  d = Math.min(d, 1 - wStrong);              // garante L >= 0
  const lWeak = 1 - wStrong - d;
  if (diff > 0) return { w: wStrong, d, l: lWeak };
  if (diff < 0) return { w: lWeak,   d, l: wStrong };
  // diff === 0: simétrico
  return { w: (1 - d) / 2, d, l: (1 - d) / 2 };
}

// Placar plausível pra um resultado. Diferenças maiores tendem a goleadas.
function generateScore(result, diff) {
  if (result === 'D') {
    const g = Math.floor(Math.random() * 3); // 0, 1 ou 2
    return [g, g];
  }
  const strengthBonus = Math.min(2, Math.floor(Math.abs(diff) / 10));
  const winnerGoals = 1 + Math.floor(Math.random() * (3 + strengthBonus));
  const loserGoals = Math.floor(Math.random() * winnerGoals);
  return result === 'W' ? [winnerGoals, loserGoals] : [loserGoals, winnerGoals];
}

// Simula uma partida e retorna { goalsA, goalsB }.
export function simulateMatch(ratingA, ratingB) {
  const diff = ratingA - ratingB;
  const { w, d } = outcomeProbs(diff);
  const roll = Math.random();
  let result;
  if (roll < w) result = 'W';
  else if (roll < w + d) result = 'D';
  else result = 'L';
  const [goalsA, goalsB] = generateScore(result, diff);
  return { goalsA, goalsB };
}

// ── Fixtures de grupo (3 rodadas, 2 jogos por rodada) ─────────────────────
//
// Padrão clássico:
//   Rodada 0: [0]vs[1], [2]vs[3]
//   Rodada 1: [0]vs[2], [1]vs[3]
//   Rodada 2: [0]vs[3], [1]vs[2]
//
// No Grupo C, o time[0] é o Brasil, então:
//   R0: BRA vs MAR (oficial)
//   R1: BRA vs HAI (oficial — apesar de ser o time[2])
//   R2: BRA vs SCO (oficial)
//
// Pra ficar consistente com a ordem real da jornada, o Grupo C usa fixtures
// específicas (ver `BRAZIL_GROUP_FIXTURES`).
export const GROUP_FIXTURES = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

// No Grupo C, o Brasil joga MAR, HAI, SCO nessa ordem (matches.json).
// As fixtures abaixo refletem isso: time[0]=BRA, time[1]=MAR, time[2]=HAI, time[3]=SCO.
//   R0: BRA vs MAR, HAI vs SCO
//   R1: BRA vs HAI, MAR vs SCO
//   R2: BRA vs SCO, MAR vs HAI
export const BRAZIL_GROUP_FIXTURES = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

// ── Mata-mata: simula uma rodada inteira ──────────────────────────────────
//
// pool: array de team keys ainda na competição.
// brazilOpponentKey: já escolhido por simulateOpponent ANTES de chamar isto.
// brazilG / brazilOpp: placar real do Brasil nessa rodada.
//
// Retorna { games, survivors }:
//   games[0] é o jogo do Brasil; outros são pares aleatórios de não-Brasil.
//   survivors são os vencedores que avançam para a próxima rodada.
//
// Empate no mata-mata → pênaltis. Vantagem leve pro time de rating maior.
export function simulateKnockoutRound(pool, brazilOpponentKey, brazilG, brazilOpp) {
  const cleanPool = [...new Set([...pool, 'BRA', brazilOpponentKey])];
  const others = cleanPool.filter((k) => k !== 'BRA' && k !== brazilOpponentKey);
  const shuffled = shuffle(others);

  // Jogo do Brasil — placar real
  const brazilGame = {
    home: 'BRA',
    away: brazilOpponentKey,
    homeGoals: brazilG,
    awayGoals: brazilOpp,
    isBrazil: true,
  };
  const games = [brazilGame];
  // Em mata-mata, empate na vida real iria pra prorrogação/pênaltis.
  // No nosso jogo, o MatchEndScreen já obrigou um vencedor (REPLAY ou
  // CONCEDE). Aqui é só consequência: se empata, Brasil avança por default
  // (proteção; raríssimo de ocorrer dado o fluxo da campanha).
  const brazilSurvived = brazilG >= brazilOpp ? 'BRA' : brazilOpponentKey;
  const survivors = [brazilSurvived];

  for (let i = 0; i + 1 < shuffled.length; i += 2) {
    const home = shuffled[i];
    const away = shuffled[i + 1];
    const ratingH = TEAMS[home].rating;
    const ratingA = TEAMS[away].rating;
    const { goalsA: gH, goalsB: gA } = simulateMatch(ratingH, ratingA);

    let penaltiesH, penaltiesA;
    let winner;
    if (gH === gA) {
      const probHome = 0.5 + (ratingH - ratingA) * 0.01;
      const homeWins = Math.random() < probHome;
      if (homeWins) {
        penaltiesH = 5;
        penaltiesA = 3 + Math.floor(Math.random() * 2);
        winner = home;
      } else {
        penaltiesH = 3 + Math.floor(Math.random() * 2);
        penaltiesA = 5;
        winner = away;
      }
    } else {
      winner = gH > gA ? home : away;
    }

    games.push({
      home,
      away,
      homeGoals: gH,
      awayGoals: gA,
      penaltiesHome: penaltiesH,
      penaltiesAway: penaltiesA,
    });
    survivors.push(winner);
  }

  return { games, survivors };
}

// Escolhe um adversário do Brasil DENTRO de um pool dado (sobreviventes da
// rodada anterior do mata-mata). Mantém o critério de ponderação por rating.
export function pickOpponentFromPool(pool, excludeKeys = []) {
  const exclude = new Set([...excludeKeys, 'BRA']);
  const candidates = pool.filter((k) => !exclude.has(k) && TEAMS[k]);
  if (candidates.length === 0) return null;

  const weights = candidates.map((k) => TEAMS[k].rating);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}
