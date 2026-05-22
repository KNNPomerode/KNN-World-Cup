// ════════════════════════════════════════════════════════════════════════════
// 🏅 QUALIFICATION — calcula os 32 classificados após a fase de grupos.
//
// Regra Copa 2026:
//   • Top 2 de cada um dos 12 grupos     → 24 times
//   • 8 melhores 3ºs colocados de 12      →  8 times
//   • Total                               → 32 times no R32 (16-avos)
//
// O Brasil é GARANTIDO na lista (mesmo se concedeu derrotas), pra
// não quebrar a campanha. Se ele já estaria classificado, ok; se não,
// substitui a última vaga.
// ════════════════════════════════════════════════════════════════════════════

import { GROUPS } from '../data/teams.js';
import { calculateStandings } from './standings.js';

export function calculateQualifiedTeams(groupResults) {
  const firsts = [];
  const seconds = [];
  const thirds = [];

  Object.entries(GROUPS).forEach(([letter, teamKeys]) => {
    const standings = calculateStandings(teamKeys, groupResults?.[letter] || []);
    if (standings[0]) firsts.push({ ...standings[0], group: letter });
    if (standings[1]) seconds.push({ ...standings[1], group: letter });
    if (standings[2]) thirds.push({ ...standings[2], group: letter });
  });

  // 8 melhores 3ºs por pts > sg > gp
  const bestThirds = [...thirds]
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
    .slice(0, 8);

  const qualified = [
    ...firsts.map((r) => r.team),
    ...seconds.map((r) => r.team),
    ...bestThirds.map((r) => r.team),
  ];

  // Garante Brasil na lista (defensivo)
  if (!qualified.includes('BRA')) {
    qualified[qualified.length - 1] = 'BRA';
  }

  return qualified;
}
