import { useState, useMemo } from 'react';

import { STYLES_CSS } from './components/styles.js';
import WelcomeScreen  from './components/screens/WelcomeScreen.jsx';
import PreMatchScreen from './components/screens/PreMatchScreen.jsx';
import MatchScreen    from './components/screens/MatchScreen.jsx';
import MatchEndScreen from './components/screens/MatchEndScreen.jsx';
import TrophyScreen   from './components/screens/TrophyScreen.jsx';

import { JOURNEYS } from './data/journey.js';
import { TEAMS, GROUPS } from './data/teams.js';
import { pickQuestions } from './lib/match.js';
import {
  resolveAnswer,
  opponentGoalRoll,
  simulateOpponent,
  simulateMatch,
  GROUP_FIXTURES,
  BRAZIL_GROUP_FIXTURES,
} from './lib/simulation.js';

// ════════════════════════════════════════════════════════════════════════════
// 🚀 ORQUESTRAÇÃO — máquina de estados raiz da jornada.
// Fluxo: welcome → preMatch → inMatch → matchEnd → (loop) → trophy
// ════════════════════════════════════════════════════════════════════════════

const REVEAL_DELAY_MS = 1700;

const emptyStats = { correct: 0, total: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 };

const DEFAULT_COACH = 'Carlo Ancelotti';

export default function App() {
  const [phase, setPhase] = useState('welcome');
  const [matchIndex, setMatchIndex] = useState(0);
  const [coachName, setCoachName] = useState(DEFAULT_COACH);

  // Adversários sorteados para as fases simuladas (chave: matchIndex)
  const [simulatedOpponents, setSimulatedOpponents] = useState({});

  // IDs de perguntas já usadas na campanha (não se repetem entre partidas)
  const [usedQuestionIds, setUsedQuestionIds] = useState(() => new Set());

  // Resultados simulados das 3 rodadas da fase de grupos.
  // Estrutura: { A: [round0, round1, round2], B: [...], ..., L: [...] }
  // Cada round é um array de até 2 jogos { home, away, homeGoals, awayGoals }.
  const [groupResults, setGroupResults] = useState({});

  // Estado da partida atual
  const [questions, setQuestions]         = useState([]);
  const [currentQ, setCurrentQ]           = useState(0);
  const [brazilGoals, setBrazilGoals]     = useState(0);
  const [opponentGoals, setOpponentGoals] = useState(0);
  const [lastAnswer, setLastAnswer]       = useState(null);    // 'goal' | 'chance' | 'wrong' | null
  const [pendingChance, setPendingChance] = useState(false);
  const [correctCount, setCorrectCount]   = useState(0);

  // Estatísticas acumuladas da campanha
  const [stats, setStats] = useState(emptyStats);

  const journey = JOURNEYS.brazil2026;
  const currentMatch = journey.matches[matchIndex];

  // Resolve o time adversário do match atual (fixo ou simulado).
  const opponent = useMemo(() => {
    if (!currentMatch) return null;
    const key = currentMatch.simulated
      ? simulatedOpponents[matchIndex]
      : currentMatch.teamKey;
    return key ? TEAMS[key] : null;
  }, [currentMatch, simulatedOpponents, matchIndex]);

  // ── Garante que o adversário simulado exista antes de entrar no preMatch ──
  function ensureOpponent(idx) {
    const m = journey.matches[idx];
    if (!m?.simulated || simulatedOpponents[idx]) return;
    const excluded = journey.matches
      .slice(0, idx)
      .map((mm, i) => (mm.simulated ? simulatedOpponents[i] : mm.teamKey))
      .filter(Boolean);
    const picked = simulateOpponent(m.stage, excluded);
    setSimulatedOpponents((prev) => ({ ...prev, [idx]: picked }));
  }

  function startCampaign() {
    ensureOpponent(0); // grupo — no-op (não é simulado), mas mantém simetria
    setPhase('preMatch');
  }

  function startMatch() {
    // Marca perguntas da partida anterior como usadas — garante que nenhuma
    // pergunta se repita ao longo da campanha inteira (8 partidas × 5 = 40,
    // bem dentro das 350 disponíveis).
    const newUsedIds = new Set(usedQuestionIds);
    questions.forEach((q) => newUsedIds.add(q.id));
    setUsedQuestionIds(newUsedIds);

    setQuestions(pickQuestions(5, newUsedIds));
    setCurrentQ(0);
    setBrazilGoals(0);
    setOpponentGoals(0);
    setLastAnswer(null);
    setPendingChance(false);
    setCorrectCount(0);
    setPhase('inMatch');
  }

  // ── Processa a resposta do aluno ──────────────────────────────────────────
  function handleAnswer(selectedIndex) {
    const q = questions[currentQ];
    const isCorrect = selectedIndex === q.correct;
    const rating = opponent.rating;

    // Snapshots dos placares pra computar o estado pós-resposta (evita stale)
    let nextBrazil   = brazilGoals;
    let nextOpponent = opponentGoals;
    let nextPending  = pendingChance;
    let nextCorrect  = correctCount;
    let revealAs;    // 'goal' | 'chance' | 'wrong'

    if (isCorrect) {
      nextCorrect += 1;

      // Regra de gol: 1 acerto = no máximo 1 gol.
      //   • Se há chance pendente: o acerto a converte em gol (sem nova roleta).
      //   • Caso contrário: roda a roleta `resolveAnswer` → 'goal' ou 'chance'.
      // Contra times fortes (mais 'chance'), 2 acertos são tipicamente
      // necessários pra balançar a rede.
      if (pendingChance) {
        nextBrazil += 1;
        nextPending = false;
        revealAs = 'goal';
      } else {
        const outcome = resolveAnswer(rating); // 'goal' | 'chance'
        if (outcome === 'goal') {
          nextBrazil += 1;
          revealAs = 'goal';
        } else {
          nextPending = true;
          revealAs = 'chance';
        }
      }
    } else {
      // Erro: chance pendente some + adversário tenta marcar
      nextPending = false;
      if (opponentGoalRoll(rating)) {
        nextOpponent += 1;
      }
      revealAs = 'wrong';
    }

    setLastAnswer(revealAs);
    setBrazilGoals(nextBrazil);
    setOpponentGoals(nextOpponent);
    setPendingChance(nextPending);
    setCorrectCount(nextCorrect);
    setStats((s) => ({
      ...s,
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
      goalsFor: s.goalsFor + (nextBrazil - brazilGoals),
      goalsAgainst: s.goalsAgainst + (nextOpponent - opponentGoals),
    }));

    setTimeout(() => {
      setLastAnswer(null);
      if (currentQ + 1 >= questions.length) {
        finishMatch(nextBrazil, nextOpponent, nextCorrect);
      } else {
        setCurrentQ((q) => q + 1);
      }
    }, REVEAL_DELAY_MS);
  }

  // ── Encerra a partida, aplicando a regra 5/5 ──────────────────────────────
  function finishMatch(finalBrazil, finalOpponent, finalCorrect) {
    let brazil = finalBrazil;
    const opp  = finalOpponent;

    // REGRA CRÍTICA: 100% de aproveitamento = vitória garantida.
    // Se o aluno fez 5 acertos em 5, força placar de vitória mínima.
    if (finalCorrect === 5 && brazil <= opp) {
      brazil = opp + 1;
    }

    setBrazilGoals(brazil);
    setOpponentGoals(opp);

    if (brazil > opp) {
      setStats((s) => ({
        ...s,
        wins: s.wins + 1,
        // Ajusta goalsFor se a regra 5/5 inflou o placar acima do simulado
        goalsFor: s.goalsFor + (brazil - finalBrazil),
      }));
    }

    setPhase('matchEnd');
  }

  function nextMatch() {
    const justFinished = matchIndex;

    // Se a partida que acabou foi da fase de grupos (índices 0, 1, 2),
    // simula a rodada correspondente dos outros 11 grupos + grava o placar
    // real do Brasil no Grupo C.
    if (justFinished <= 2) {
      simulateGroupRound(justFinished, brazilGoals, opponentGoals);
    }

    const next = justFinished + 1;
    if (next >= journey.matches.length) {
      setPhase('trophy');
      return;
    }
    setMatchIndex(next);
    ensureOpponent(next);
    setPhase('preMatch');
  }

  // Simula a rodada `round` (0, 1 ou 2) em todos os 12 grupos.
  // O Grupo C usa o placar real do Brasil; os demais jogos são simulados.
  function simulateGroupRound(round, brazilG, oppG) {
    setGroupResults((prev) => {
      const next = { ...prev };
      for (const [letter, teamKeys] of Object.entries(GROUPS)) {
        const fixtures = letter === 'C' ? BRAZIL_GROUP_FIXTURES[round] : GROUP_FIXTURES[round];
        const games = fixtures.map(([i, j]) => {
          const home = teamKeys[i];
          const away = teamKeys[j];
          // Jogo do Brasil — usar placar real
          if (letter === 'C' && (home === 'BRA' || away === 'BRA')) {
            return {
              home,
              away,
              homeGoals: home === 'BRA' ? brazilG : oppG,
              awayGoals: away === 'BRA' ? brazilG : oppG,
            };
          }
          const { goalsA, goalsB } = simulateMatch(TEAMS[home].rating, TEAMS[away].rating);
          return { home, away, homeGoals: goalsA, awayGoals: goalsB };
        });
        next[letter] = [...(prev[letter] || []), games];
      }
      return next;
    });
  }

  function retryMatch() {
    setPhase('preMatch');
  }

  function restart() {
    setPhase('welcome');
    setMatchIndex(0);
    setSimulatedOpponents({});
    setUsedQuestionIds(new Set());
    setQuestions([]);
    setGroupResults({});
    setStats(emptyStats);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES_CSS}</style>

      {phase === 'welcome' && (
        <WelcomeScreen
          onStart={startCampaign}
          journey={journey}
          coachName={coachName}
          onCoachChange={(v) => setCoachName(v || DEFAULT_COACH)}
          groupResults={groupResults}
        />
      )}

      {phase === 'preMatch' && opponent && (
        <PreMatchScreen
          match={currentMatch}
          opponent={opponent}
          matchIndex={matchIndex}
          total={journey.matches.length}
          stats={stats}
          onStart={startMatch}
          groupResults={groupResults}
        />
      )}

      {phase === 'inMatch' && opponent && (
        <MatchScreen
          match={currentMatch}
          opponent={opponent}
          questions={questions}
          brazilGoals={brazilGoals}
          opponentGoals={opponentGoals}
          currentQ={currentQ}
          lastAnswer={lastAnswer}
          pendingChance={pendingChance}
          onAnswer={handleAnswer}
        />
      )}

      {phase === 'matchEnd' && opponent && (
        <MatchEndScreen
          match={currentMatch}
          opponent={opponent}
          brazilGoals={brazilGoals}
          opponentGoals={opponentGoals}
          correctCount={correctCount}
          isFinal={matchIndex === journey.matches.length - 1 && brazilGoals > opponentGoals}
          onNext={nextMatch}
          onRetry={retryMatch}
        />
      )}

      {phase === 'trophy' && (
        <TrophyScreen stats={stats} journey={journey} onRestart={restart} />
      )}
    </>
  );
}
