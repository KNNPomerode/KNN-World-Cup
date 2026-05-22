// ════════════════════════════════════════════════════════════════════════════
// 📊 STANDINGS — calcula classificação de um grupo a partir dos resultados.
// ════════════════════════════════════════════════════════════════════════════

// Estrutura de cada linha:
//   { team, pts, j, w, d, l, gf, ga, gd }
//
// Critérios de desempate (Copa do Mundo, ordem real):
//   1) Pontos (3 vitória, 1 empate)
//   2) Saldo de gols (gd)
//   3) Gols marcados (gf)
//   4) Ordem alfabética (placeholder estável)
export function calculateStandings(teamKeys, rounds) {
  const stats = {};
  teamKeys.forEach((t) => {
    stats[t] = { team: t, pts: 0, j: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0 };
  });

  (rounds || []).forEach((round) => {
    (round || []).forEach(({ home, away, homeGoals, awayGoals }) => {
      const a = stats[home];
      const b = stats[away];
      if (!a || !b) return;
      a.j += 1; b.j += 1;
      a.gf += homeGoals; a.ga += awayGoals;
      b.gf += awayGoals; b.ga += homeGoals;
      a.gd = a.gf - a.ga;
      b.gd = b.gf - b.ga;
      if (homeGoals > awayGoals) {
        a.pts += 3; a.w += 1; b.l += 1;
      } else if (homeGoals < awayGoals) {
        b.pts += 3; b.w += 1; a.l += 1;
      } else {
        a.pts += 1; b.pts += 1; a.d += 1; b.d += 1;
      }
    });
  });

  return Object.values(stats).sort(
    (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team)
  );
}
