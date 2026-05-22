// ════════════════════════════════════════════════════════════════════════════
// 🏟️ JOURNEYS — campanhas jogáveis.
//    Cada `match` tem:
//      - teamKey: null em jogos do mata-mata (resolvido por simulateOpponent)
//      - simulated: true em jogos do mata-mata
//      - mood: epigrama editorial pra dar atmosfera (substituiu o `historical`)
// ⚽ Pra adicionar uma jornada nova (ex: brazil2002 nostálgica), copie o schema.
// ════════════════════════════════════════════════════════════════════════════

export const JOURNEYS = {
  brazil2026: {
    id: 'brazil2026',
    name: 'BRASIL',
    year: 2026,
    edition: 'XXIII',
    location: 'USA · Canadá · México',
    coach: 'Carlo Ancelotti',
    motto: 'Em busca do Hexa',
    group: 'C',
    matches: [
      {
        id: 1,
        stage: 'Group Stage',
        stageShort: 'Grupo C',
        date: '13/jun',
        city: 'MetLife Stadium · New Jersey',
        teamKey: 'MAR',
        simulated: false,
        mood: 'A estreia. Marrocos chega como o azarão que assustou todo mundo em 2022 — não é mais surpresa, é potência.',
      },
      {
        id: 2,
        stage: 'Group Stage',
        stageShort: 'Grupo C',
        date: '19/jun',
        city: 'Lincoln Financial Field · Filadélfia',
        teamKey: 'HAI',
        simulated: false,
        mood: 'O jogo da gestão. Contra o Haiti, ritmo de treino e janela pra rodar elenco — desde que ninguém relaxe.',
      },
      {
        id: 3,
        stage: 'Group Stage',
        stageShort: 'Grupo C',
        date: '24/jun',
        city: 'Hard Rock Stadium · Miami',
        teamKey: 'SCO',
        simulated: false,
        mood: 'Encerrar o grupo em primeiro. A Escócia vem cascuda, sem nada a perder, em Miami que vai parecer Maracanã.',
      },
      {
        id: 4,
        stage: 'Round of 32',
        stageShort: '16-avos',
        date: '~jul',
        city: 'NRG Stadium · Houston',
        teamKey: null,
        simulated: true,
        mood: 'Primeiro mata-mata. Mais um adversário entra no caminho — e qualquer descuido é fatal.',
      },
      {
        id: 5,
        stage: 'Round of 16',
        stageShort: 'Oitavas',
        date: '~jul',
        city: 'Mercedes-Benz Stadium · Atlanta',
        teamKey: null,
        simulated: true,
        mood: 'Oitavas. Quem perder vai embora — não importa quão grande seja o nome.',
      },
      {
        id: 6,
        stage: 'Quarterfinal',
        stageShort: 'Quartas',
        date: '~jul',
        city: 'Lumen Field · Seattle',
        teamKey: null,
        simulated: true,
        mood: 'O caldeirão de Seattle. Quartas de final — três vitórias separam a campanha do troféu.',
      },
      {
        id: 7,
        stage: 'Semifinal',
        stageShort: 'Semi',
        date: '~jul',
        city: 'AT&T Stadium · Dallas',
        teamKey: null,
        simulated: true,
        mood: 'Semifinal. A partir daqui, qualquer adversário é gigante. A linha entre lenda e desilusão.',
      },
      {
        id: 8,
        stage: 'FINAL',
        stageShort: 'Final',
        date: '19/jul',
        city: 'MetLife Stadium · New Jersey',
        teamKey: null,
        simulated: true,
        mood: 'A final. New Jersey. Um jogo. Uma vida. Lift it.',
      },
    ],
  },
};
