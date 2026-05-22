# Refatoração: Copa 2026 + simulação dinâmica

Continue na pasta do projeto, com as permissões blanket que já discutimos.

**Refatoração grande: virar Copa 2026 com simulação dinâmica.** Não destrua o estado atual sem entender — primeiro leia `src/App.jsx` inteiro, faça um plano e me mostra um resumo do que vai mudar antes de codar. Quero validar o plano antes da execução.

## Mudanças principais

### 1. Jornada vira Copa 2026, Grupo C real

Atualizar `JOURNEYS` pra refletir o sorteio real:

- Jogo 1: Brasil x Marrocos (13/jun, MetLife Stadium, New Jersey)
- Jogo 2: Brasil x Haiti (19/jun, Lincoln Financial Field, Filadélfia)
- Jogo 3: Brasil x Escócia (24/jun, Hard Rock Stadium, Miami)
- Mata-mata: 16-avos (5/jul), oitavas, quartas, semi, final (19/jul, NY)

Treinador: Carlo Ancelotti. Edição "XXIII". Local "USA · Canada · México".

### 2. Novo conceito: notas dos times (0–100)

Cada seleção tem um `rating` que vai afetar a simulação. Crie um objeto `TEAMS` com as seleções principais e suas notas baseadas no seu conhecimento do futebol atual. Sugestões pra calibrar:

- Brasil ~88, França ~92, Argentina ~91, Espanha ~90, Inglaterra ~88, Portugal ~87
- Marrocos ~82, Holanda ~85, Alemanha ~85, Japão ~78
- Escócia ~73, Haiti ~62
- Use sua avaliação pros demais.

### 3. Todos os 12 grupos existem como dados

Crie objeto `GROUPS` com os 12 grupos reais do sorteio (A até L), cada um com 4 seleções. Vamos usar isso na próxima feature. Por ora basta os dados existirem.

### 4. Simulação dos adversários do mata-mata

O Brasil joga os 3 jogos do grupo, e a partir do 16-avos os adversários são determinados por uma função `simulateOpponent(stage, brazilStats)` que escolhe um time plausível baseado em notas. Pode ser simples: pegar um candidato razoável do ranking pra cada fase. Total ainda são 7 jogos como hoje.

### 5. Nova mecânica de gols: acertos viram gol OU oportunidade

Cada pergunta correta gera um destes dois eventos, baseado na nota do adversário:

- Contra time fraco (rating < 70): acerto = gol direto (90% chance)
- Contra time médio (70–85): acerto = 60% gol, 40% oportunidade
- Contra time forte (>85): acerto = 40% gol, 60% oportunidade

Oportunidade vira gol no PRÓXIMO acerto (acertos consecutivos convertem). Se errar, oportunidade some.

### 6. Adversário marca gols baseado na própria nota

A cada erro do aluno, o adversário tem chance de marcar proporcional à nota dele:

- rating < 70: 30% de marcar
- rating 70–85: 55%
- rating > 85: 80%

### 7. REGRA CRÍTICA: 100% de aproveitamento = vitória garantida

Se o aluno acertou as 5 perguntas, ele vence o jogo independente do que aconteceu na simulação. Implementar como verificação final no `MatchEndScreen`: se acertos == 5, força `brazilGoals = max(brazilGoals, opponentGoals + 1)`. Adicionar comentário explicando a regra.

### 8. Banco de perguntas: focar em Present Simple, nível "Book 1"

Substituir o banco atual por 50+ perguntas de Present Simple. A propriedade `difficulty` agora vira `level: 'book1'`. Quatro tipos de pergunta (campo `type`):

- `correct_sentence`: mostrar frase errada, aluno escolhe a versão correta. Ex: "She go to school" → escolher "She goes to school"
- `fill_blank`: completar com verbo no Present Simple. Ex: "He ___ (play) football every Sunday" → "plays"
- `translate_pt_en`: traduzir frase do português pro inglês. Ex: "Eu trabalho aqui" → "I work here"
- `meaning`: significado de palavra/expressão em inglês. Ex: "What does 'usually' mean?" → "geralmente"

Distribuir as 50 perguntas de forma equilibrada entre os quatro tipos. Manter formato de 4 opções e `correct` (índice).

### 9. UI ajustada

- Tela de pré-jogo mostra a nota do adversário com visual de "scout report" (ex: rating bar, força física/técnica simplificada se quiser inventar)
- Durante a partida, mostrar quando uma oportunidade foi criada (ex: "CHANCE!" em vez de "GOAL!") e um contador de oportunidades ativas
- Tela final precisa diferenciar "vitória limpa" (5/5) com tratamento especial visual

### 10. Refatorar a estrutura de arquivos

O App.jsx tá ficando grande. Quebrar em:

- `src/data/teams.js` — `TEAMS` e `GROUPS`
- `src/data/journey.js` — `JOURNEYS` (com grupo + estrutura da copa)
- `src/data/questions.js` — banco de perguntas
- `src/lib/simulation.js` — funções de simulação (acerto→gol/oportunidade, gol adversário, simulateOpponent)
- `src/lib/match.js` — máquina de estados da partida
- `src/components/screens/` — uma tela por arquivo
- `src/App.jsx` — só orquestração

Manter os emojis 📚 ⚽ ✏️ nos comentários de extensão.

## Ao final

- Confirma que `npm run dev` sobe limpo
- Commit com mensagem `feat: copa 2026 + simulação dinâmica + Present Simple (Book 1)`
- `git push`
- Me retorna: o que mudou em alto nível, qualquer decisão que você tomou sozinho que vale eu saber, e se algo ficou pendente.
