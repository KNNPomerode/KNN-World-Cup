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
  simulateKnockoutRound,
  pickOpponentFromPool,
  GROUP_FIXTURES,
  BRAZIL_GROUP_FIXTURES,
} from './lib/simulation.js';
import { calculateQualifiedTeams } from './lib/qualification.js';

// ════════════════════════════════════════════════════════════════════════════
// 🚀 ORQUESTRAÇÃO — máquina de estados raiz da jornada.
// Fluxo: welcome → preMatch → inMatch → matchEnd → (loop) → trophy
// ════════════════════════════════════════════════════════════════════════════

const REVEAL_DELAY_MS = 1700;
const emptyStats = { correct: 0, total: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 };
const DEFAULT_COACH = 'Carlo Ancelotti';

// Labels das rodadas do mata-mata, na ordem em que aparecem no journey.
// matchIndex 3 → R32, 4 → R16, 5 → QF, 6 → SF, 7 → F
const KO_LABELS = ['R32', 'R16', 'QF', 'SF', 'F'];

// ── Função pura: simula uma rodada da fase de grupos em todos os 12 grupos ──
function computeGroupRound(round, brazilG, oppG, prevResults) {
  const next = { ...prevResults };
  for (const [letter, teamKeys] of Object.entries(GROUPS)) {
    const fixtures = letter === 'C' ? BRAZIL_GROUP_FIXTURES[round] : GROUP_FIXTURES[round];
    const games = fixtures.map(([i, j]) => {
      const home = teamKeys[i];
      const away = teamKeys[j];
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
    next[letter] = [...(prevResults[letter] || []), games];
  }
  return next;
}

export default function App() {
  const [phase, setPhase] = useState('welcome');
  const [matchIndex, setMatchIndex] = useState(0);
  const [coachName, setCoachName] = useState(DEFAULT_COACH);

  // Adversários sorteados para as fases simuladas (chave: matchIndex)
  const [simulatedOpponents, setSimulatedOpponents] = useState({});

  // IDs de perguntas já usadas na campanha (não se repetem entre partidas)
  const [usedQuestionIds, setUsedQuestionIds] = useState(() => new Set());

  // Resultados simulados da fase de grupos. { A: [round0, round1, round2], ... }
  const [groupResults, setGroupResults] = useState({});

  // Classificados após a fase de grupos (24 top-2 + 8 melhores 3ºs = 32 keys)
  const [qualifiedTeams, setQualifiedTeams] = useState([]);

  // Times ainda na competição. Encolhe a cada rodada do mata-mata.
  const [tournamentPool, setTournamentPool] = useState([]);

  // Resultados do mata-mata. { R32: [...], R16: [...], QF: [...], SF: [...], F: [...] }
  const [knockoutRounds, setKnockoutRounds] = useState({});

  // Estado da partida atual
  const [questions, setQuestions]         = useState([]);
  const [currentQ, setCurrentQ]           = useState(0);
  const [brazilGoals, setBrazilGoals]     = useState(0);
  const [opponentGoals, setOpponentGoals] = useState(0);
  const [lastAnswer, setLastAnswer]       = useState(null);
  const [pendingChance, setPendingChance] = useState(false);
  const [correctCount, setCorrectCount]   = useState(0);

  const [stats, setStats] = useState(emptyStats);

  const journey = JOURNEYS.brazil2026;
  const currentMatch = journey.matches[matchIndex];

  const opponent = useMemo(() => {
    if (!currentMatch) return null;
    const key = currentMatch.simulated
      ? simulatedOpponents[matchIndex]
      : currentMatch.teamKey;
    return key ? TEAMS[key] : null;
  }, [currentMatch, simulatedOpponents, matchIndex]);

  // ── Garante que o adversário simulado exista antes de entrar no preMatch ──
  // Em mata-mata, escolhe do tournamentPool (sobreviventes); fora dele, usa
  // o simulateOpponent padrão. `poolOverride` permite passar um pool recém
  // calculado mas ainda não persistido em state.
  function ensureOpponent(idx, poolOverride) {
    const m = journey.matches[idx];
    if (!m?.simulated || simulatedOpponents[idx]) return;
    const excluded = journey.matches
      .slice(0, idx)
      .map((mm, i) => (mm.simulated ? simulatedOpponents[i] : mm.teamKey))
      .filter(Boolean);

    const pool = poolOverride !== undefined ? poolOverride : tournamentPool;
    let picked;
    if (idx >= 3 && pool.length > 0) {
      picked = pickOpponentFromPool(pool, excluded) || simulateOpponent(m.stage, excluded);
    } else {
      picked = simulateOpponent(m.stage, excluded);
    }
    setSimulatedOpponents((prev) => ({ ...prev, [idx]: picked }));
  }

  function startCampaign() {
    ensureOpponent(0);
    setPhase('preMatch');
  }

  function startMatch() {
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

  function handleAnswer(selectedIndex) {
    const q = questions[currentQ];
    const isCorrect = selectedIndex === q.correct;
    const rating = opponent.rating;

    let nextBrazil   = brazilGoals;
    let nextOpponent = opponentGoals;
    let nextPending  = pendingChance;
    let nextCorrect  = correctCount;
    let revealAs;

    if (isCorrect) {
      nextCorrect += 1;
      if (pendingChance) {
        nextBrazil += 1;
        nextPending = false;
        revealAs = 'goal';
      } else {
        const outcome = resolveAnswer(rating);
        if (outcome === 'goal') {
          nextBrazil += 1;
          revealAs = 'goal';
        } else {
          nextPending = true;
          revealAs = 'chance';
        }
      }
    } else {
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

  function finishMatch(finalBrazil, finalOpponent, finalCorrect) {
    let brazil = finalBrazil;
    const opp  = finalOpponent;

    if (finalCorrect === 5 && brazil <= opp) {
      brazil = opp + 1;
    }

    setBrazilGoals(brazil);
    setOpponentGoals(opp);

    if (brazil > opp) {
      setStats((s) => ({
        ...s,
        wins: s.wins + 1,
        goalsFor: s.goalsFor + (brazil - finalBrazil),
      }));
    }

    setPhase('matchEnd');
  }

  function nextMatch() {
    const justFinished = matchIndex;

    // Estado local pra encadear as transições síncronas (setState é async)
    let newGroupResults = groupResults;
    let newQualified    = qualifiedTeams;
    let newPool         = tournamentPool;
    let newKnockout     = knockoutRounds;

    // Fase de grupos (matchIndex 0, 1, 2): simular as 2 outras partidas do
    // próprio Grupo C (apenas Brasil tem placar real) + 22 jogos dos 11 grupos.
    if (justFinished <= 2) {
      newGroupResults = computeGroupRound(justFinished, brazilGoals, opponentGoals, newGroupResults);
      setGroupResults(newGroupResults);
    }

    // Após R3 do Brasil → calcular classificados
    if (justFinished === 2) {
      newQualified = calculateQualifiedTeams(newGroupResults);
      newPool = newQualified;
      setQualifiedTeams(newQualified);
      setTournamentPool(newPool);
    }

    // Mata-mata (matchIndex 3..7): simular os outros jogos da rodada
    if (justFinished >= 3 && justFinished <= 7) {
      const label = KO_LABELS[justFinished - 3];
      const oppKey = simulatedOpponents[justFinished];
      if (oppKey) {
        const { games, survivors } = simulateKnockoutRound(
          newPool,
          oppKey,
          brazilGoals,
          opponentGoals,
        );
        newKnockout = { ...newKnockout, [label]: games };
        newPool = survivors;
        setKnockoutRounds(newKnockout);
        setTournamentPool(newPool);
      }
    }

    const next = justFinished + 1;
    if (next >= journey.matches.length) {
      setPhase('trophy');
      return;
    }
    setMatchIndex(next);
    ensureOpponent(next, newPool);
    setPhase('preMatch');
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
    setQualifiedTeams([]);
    setTournamentPool([]);
    setKnockoutRounds({});
    setStats(emptyStats);
  }

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
          knockoutRounds={knockoutRounds}
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
          knockoutRounds={knockoutRounds}
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
