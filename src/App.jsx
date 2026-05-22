import { useState, useMemo } from 'react';

import { STYLES_CSS } from './components/styles.js';
import WelcomeScreen  from './components/screens/WelcomeScreen.jsx';
import PreMatchScreen from './components/screens/PreMatchScreen.jsx';
import MatchScreen    from './components/screens/MatchScreen.jsx';
import MatchEndScreen from './components/screens/MatchEndScreen.jsx';
import TrophyScreen   from './components/screens/TrophyScreen.jsx';

import { JOURNEYS } from './data/journey.js';
import { TEAMS }    from './data/teams.js';
import { pickQuestions } from './lib/match.js';
import { resolveAnswer, opponentGoalRoll, simulateOpponent } from './lib/simulation.js';

// ════════════════════════════════════════════════════════════════════════════
// 🚀 ORQUESTRAÇÃO — máquina de estados raiz da jornada.
// Fluxo: welcome → preMatch → inMatch → matchEnd → (loop) → trophy
// ════════════════════════════════════════════════════════════════════════════

const REVEAL_DELAY_MS = 1700;

const emptyStats = { correct: 0, total: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 };

export default function App() {
  const [phase, setPhase] = useState('welcome');
  const [matchIndex, setMatchIndex] = useState(0);

  // Adversários sorteados para as fases simuladas (chave: matchIndex)
  const [simulatedOpponents, setSimulatedOpponents] = useState({});

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
    setQuestions(pickQuestions(5));
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
      const outcome = resolveAnswer(rating); // 'goal' | 'chance'

      // Decisão de design: chance pendente vira gol garantido + a roleta nova
      // ainda roda em cima do mesmo acerto. Acertos consecutivos podem render 2 gols.
      if (pendingChance) {
        nextBrazil += 1;        // converte a chance anterior
        nextPending = false;
      }
      if (outcome === 'goal') {
        nextBrazil += 1;
        revealAs = 'goal';
      } else {
        nextPending = true;
        // Se a chance anterior virou gol agora, mostramos 'goal' (mais satisfatório)
        revealAs = pendingChance ? 'goal' : 'chance';
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
    const next = matchIndex + 1;
    if (next >= journey.matches.length) {
      setPhase('trophy');
      return;
    }
    setMatchIndex(next);
    ensureOpponent(next);
    setPhase('preMatch');
  }

  function retryMatch() {
    setPhase('preMatch');
  }

  function restart() {
    setPhase('welcome');
    setMatchIndex(0);
    setSimulatedOpponents({});
    setStats(emptyStats);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES_CSS}</style>

      {phase === 'welcome' && (
        <WelcomeScreen onStart={startCampaign} journey={journey} />
      )}

      {phase === 'preMatch' && opponent && (
        <PreMatchScreen
          match={currentMatch}
          opponent={opponent}
          matchIndex={matchIndex}
          total={journey.matches.length}
          stats={stats}
          onStart={startMatch}
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
