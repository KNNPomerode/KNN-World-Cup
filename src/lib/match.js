// ════════════════════════════════════════════════════════════════════════════
// 🛠️ MATCH HELPERS — funções puras de partida.
// ════════════════════════════════════════════════════════════════════════════

import { QUESTIONS } from '../data/questions.js';

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Sorteia `count` perguntas tentando ter ao menos uma de cada tipo,
// completa o restante aleatoriamente, e embaralha a ordem final.
//
// `excludeIds`: array ou Set de IDs já usados (nas partidas anteriores
// da mesma campanha). Garantia: nenhuma das `count` perguntas retornadas
// estará em `excludeIds`, nem se repetirá entre si.
//
// Se o filtro deixar o pool menor que `count` (banco esgotado), faz
// fallback ignorando o exclude — o jogo continua jogável.
export function pickQuestions(count = 5, excludeIds) {
  const exclude = excludeIds instanceof Set ? excludeIds : new Set(excludeIds || []);

  let pool = QUESTIONS.filter((q) => !exclude.has(q.id));
  if (pool.length < count) pool = QUESTIONS; // fallback

  const byType = pool.reduce((acc, q) => {
    (acc[q.type] = acc[q.type] || []).push(q);
    return acc;
  }, {});

  const types = Object.keys(byType);
  const picked = [];
  const seen = new Set();

  // 1 de cada tipo (até esgotar tipos disponíveis ou bater o count)
  for (const t of types) {
    if (picked.length >= count) break;
    const shuffled = shuffle(byType[t]);
    const q = shuffled.find((x) => !seen.has(x.id));
    if (q) {
      picked.push(q);
      seen.add(q.id);
    }
  }

  // Completa com perguntas aleatórias do pool filtrado
  const remaining = shuffle(pool.filter((q) => !seen.has(q.id)));
  while (picked.length < count && remaining.length) {
    const q = remaining.shift();
    picked.push(q);
    seen.add(q.id);
  }

  return shuffle(picked);
}
