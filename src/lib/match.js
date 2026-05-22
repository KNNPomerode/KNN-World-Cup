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
export function pickQuestions(count = 5) {
  const byType = QUESTIONS.reduce((acc, q) => {
    (acc[q.type] = acc[q.type] || []).push(q);
    return acc;
  }, {});

  const types = Object.keys(byType);
  const picked = [];
  const seen = new Set();

  // 1 de cada tipo (até esgotar tipos disponíveis)
  for (const t of types) {
    if (picked.length >= count) break;
    const pool = shuffle(byType[t]);
    const q = pool.find((x) => !seen.has(x.id));
    if (q) {
      picked.push(q);
      seen.add(q.id);
    }
  }

  // Completa com perguntas aleatórias do banco inteiro
  const remaining = shuffle(QUESTIONS.filter((q) => !seen.has(q.id)));
  while (picked.length < count && remaining.length) {
    const q = remaining.shift();
    picked.push(q);
    seen.add(q.id);
  }

  return shuffle(picked);
}
