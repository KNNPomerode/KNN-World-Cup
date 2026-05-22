# Road to the Cup — guia de evolução

Jogo de inglês com temática de Copa do Mundo. O aluno percorre uma jornada da seleção (default: Brasil 2002) e responde perguntas pra marcar gols.

## Como rodar

É um único componente React (`road-to-the-cup.jsx`) com export default. Cole num projeto Vite/Next/CRA com Tailwind + lucide-react e renderize. Sem dependências exóticas.

```bash
npm create vite@latest copa-game -- --template react
cd copa-game
npm install lucide-react
# configurar Tailwind: https://tailwindcss.com/docs/guides/vite
```

Depois é só substituir `src/App.jsx` pelo arquivo do jogo.

## Arquitetura (mental model)

O arquivo está dividido em **6 blocos** marcados com cabeçalhos `═══`:

1. **STYLES** — fontes Google + animações CSS. Mova pra `styles.css` quando crescer.
2. **GAME DATA** — `JOURNEYS` (copas disponíveis) e `QUESTIONS` (banco). Dados puros, sem lógica.
3. **HELPERS** — `shuffle`, `pickQuestions`. Funções puras testáveis.
4. **COMPONENTES** — uma função por tela (`WelcomeScreen`, `PreMatchScreen`, `MatchScreen`, `MatchEndScreen`, `TrophyScreen`).
5. **MAIN APP** — máquina de estados (`phase`) que orquestra tudo.

O fluxo é linear:
```
welcome → preMatch → inMatch → matchEnd → (loop) → trophy
```

## Pontos de extensão prontos

Procure os emojis no código:

| Emoji | Significado | Onde |
|---|---|---|
| ⚽ | Adicionar nova jornada (Copa) | `JOURNEYS` |
| 📚 | Adicionar perguntas | `QUESTIONS` |
| ✏️ | Adicionar categoria/tipo | `QUESTIONS` |
| 📌 | Próximos passos sugeridos | comentários inline |

## Roadmap sugerido pro Claude Code

### Curto prazo (1–2 horas)
- **Mais perguntas.** Aumente o banco pra 100+. Considere subcategorias por unidade do livro didático.
- **Seleção de dificuldade na tela inicial.** Já tem o campo `difficulty` em cada pergunta — só falta a UI.
- **Seleção de jornada.** O schema de `JOURNEYS` já aceita múltiplas. Crie cards de seleção pra 1958, 1970, 1994, 2002.
- **Áudio.** Sons de torcida, apito, gol. Usar `<audio>` simples ou Tone.js.

### Médio prazo
- **Modo professor.** Tela `/admin` onde o professor digita perguntas customizadas (salvar em localStorage). Ótimo pra adaptar à matéria do bimestre.
- **Novos tipos de questão.** Hoje só tem múltipla escolha. Crie:
  - `fill_in_the_blank` — input de texto.
  - `word_order` — drag-and-drop pra montar frase.
  - `listening` — áudio + transcrição-resposta.
  - `image_choice` — imagens em vez de texto nas opções.
  
  Estrutura: cada `type` vira um componente `<QuestionCardX>` selecionado por switch.
- **Multiplayer local.** Times A vs B, alternando perguntas. Útil em sala dividida em grupos.
- **Sistema de cartões.** 3 erros seguidos = cartão amarelo, próximo gol vale 2.
- **Estatísticas detalhadas no final.** Quais categorias o aluno mais errou? Quais perguntas? Vira relatório pro professor.

### Longo prazo
- **Backend leve.** Salvar progresso por aluno (Supabase/Firebase). Dashboard pro professor ver toda a turma.
- **Geração de perguntas com IA.** Endpoint que chama Claude pra gerar perguntas a partir de um texto do livro didático. Cuidado com filtros e validação de gabarito.
- **Pronúncia.** Web Speech API pra reconhecer fala do aluno em perguntas tipo "say this word".
- **Editor visual de jornadas.** Professor monta uma copa fictícia drag-and-drop.
- **i18n.** A interface do jogo está em mistura PT+EN propositalmente (clima de programa internacional). Permita escolher idioma da UI separado do idioma das perguntas.

## Boas práticas ao escalar

1. **Quebre o arquivo.** Quando passar de ~600 linhas, mova cada tela pra `components/`, dados pra `data/`, helpers pra `lib/`.
2. **Tipagem.** Migrar pra TypeScript te dá segurança ao mexer no schema de questões.
3. **Testes.** Funções puras (`pickQuestions`, lógica de placar) são fáceis de testar com Vitest.
4. **Separe a máquina de estados.** Quando `phase` virar mais que 5 estados, considere XState ou um reducer dedicado.
5. **Não mexa nas animações por acidente.** Os `@keyframes` no `STYLES_CSS` foram calibrados — preserve ou substitua deliberadamente (Framer Motion seria um upgrade natural).

## Notas de design

A estética é "programa oficial de copa antiga" / álbum Panini:
- Fontes: **Anton** (manchete condensada), **Fraunces** (serifa editorial italic), **Manrope** (corpo), **IBM Plex Mono** (números/labels).
- Paleta: papel `#F0E5CC`, amarelo `#FFD500`, vermelho `#D62828`, verde `#1B7F3E`, preto `#1A1A1A`. Dentro do estádio inverte pra noite (`paper-dark` `#1A2A1F`).
- Bordas grossas de 2px em todos os blocos pra dar peso editorial.
- Texturas: granulado em radial-gradients pequenos, scanlines no estádio, padrão de bolinhas pra torcida.

Se for redesenhar, mantenha a coerência: ou vai 100% editorial papel-jornal, ou 100% transmissão moderna de TV, ou 100% retrô pixel — misturas ficam fracas.
