# CLAUDE.md — C.Render IA

Este arquivo define **como** trabalhar neste repositório. É lido em toda sessão.

## Documentos do projeto

Leia antes de qualquer tarefa e consulte sempre que houver dúvida:

| Documento | Conteúdo |
|---|---|
| `docs/01-VISAO-DE-NEGOCIO.md` | Problema, público, concorrência, preços, créditos, regras comerciais |
| `docs/02-ESPECIFICACAO-TECNICA.md` | Arquitetura, stack, domínio, pipelines, segurança, qualidade |
| `docs/03-ROADMAP.md` | Fases, entregáveis, critérios de saída, matriz de funcionalidades |
| `docs/04-PROMPTS-DE-EXECUCAO.md` | Prompts prontos para iniciar cada fase |
| `docs/adr/` | Decisões de arquitetura registradas |

Regras de negócio estão no documento 01; o documento 02 diz como implementá-las. Se os dois
divergirem, pare e pergunte.

## Contexto em uma linha

C.Render IA é um plugin para SketchUp (Windows e macOS) que transforma a vista do modelo 3D em
render com IA, dentro do próprio SketchUp, vendido por assinatura com créditos. Backend
serverless; modelos de imagem acessados por API através de adaptadores.

## Idioma

- Conversa com o dono do projeto: **português**.
- Código, nomes, commits, ADRs e comentários: **inglês**.
- Textos de interface: português (pt-BR), via arquivo de tradução.

## Postura esperada

Trabalhe como um engenheiro sênior que vai manter este código por anos:

- **Entender antes de escrever.** Leia o código existente e os documentos. Se algo for ambíguo
  ou contraditório, pergunte. Não invente requisitos.
- **Planejar antes de codar.** Para qualquer tarefa que toque mais de um arquivo, apresente
  um plano curto (arquivos, abordagem, riscos, como vai testar) e espere aprovação.
- **Passos pequenos e verificáveis.** Uma funcionalidade por vez, com testes, rodando.
- **Verificar, não supor.** Não diga que funciona sem rodar testes, lint, checagem de tipos
  e build. Não invente métodos de API (SketchUp Ruby API, BFL, Google, Supabase, Cloudflare,
  gateway de pagamento): confira a documentação oficial. Se não puder conferir, diga.
- **Dizer quando não sabe.** "Não tenho certeza, sugiro verificar X" vale mais que um chute.
- **Pensar no negócio.** Toda decisão técnica que afeta custo por imagem, margem, tempo de
  resposta ou experiência do arquiteto deve ser explicitada no plano.

## Fluxo de cada tarefa

1. Ler a tarefa e os trechos relevantes dos documentos.
2. Propor plano (o que, onde, como testar, impacto em custo/negócio se houver).
3. Após aprovação: escrever o teste que define o comportamento.
4. Implementar o mínimo que faz o teste passar, com design limpo.
5. Refatorar se necessário, mantendo os testes verdes.
6. Rodar lint, tipos, testes e build.
7. Relatar: o que foi feito, o que foi testado de fato, o que ficou de fora, próximos passos.

## Sem manias de IA

Proibido:

- Comentários que repetem o código, comentários do tipo `// Step 1`, `// New function`,
  `// Fixed`. Comente apenas o **porquê** de decisões não óbvias.
- Emojis em código, logs, commits ou documentação técnica.
- Nomes genéricos: `data`, `result`, `info`, `temp`, `helper`, `utils`, `Manager`,
  `Handler` sem qualificação, `processData`. Nomeie pelo domínio.
- Arquivos lixeira (`utils.ts`, `helpers.rb`, `common.ts`) com funções sem relação.
- `catch` vazio, `catch` que só loga e segue, `rescue => e` genérico.
- Programação defensiva excessiva. Valide nas fronteiras (HTTP, webhook, resposta externa,
  dados vindos do SketchUp) e confie nos tipos dentro do domínio.
- Dados falsos, mocks ou `TODO` em código de produção.
- Abstrações especulativas. Abstraia no segundo caso real ou quando o documento técnico exigir
  (adaptadores de IA, pagamento e storage são exigidos).
- Código morto, flags ou camadas de compatibilidade para algo que nunca foi lançado.
- Reformatar ou alterar código fora do escopo da tarefa.
- Dependência nova sem justificar: problema que resolve, alternativa sem dependência,
  tamanho, licença, manutenção ativa.
- `console.log` / `puts` de depuração esquecidos.
- Documentação inflada ou não solicitada. Respostas longas explicando o óbvio.
- Números mágicos de negócio no código (preços, créditos, limites, prazos). Tudo vem de
  configuração.

## Princípios de design

- **POO onde agrega**: entidades e objetos de valor com comportamento, invariantes garantidas
  na construção, encapsulamento real (sem setters públicos para estado de domínio).
- **SOLID**, com ênfase em responsabilidade única e inversão de dependência.
- **Composição em vez de herança.**
- **Arquitetura hexagonal**: `domain` (regras puras, sem I/O) ← `application` (casos de uso e
  portas) ← `infrastructure` (adaptadores). O domínio nunca importa infraestrutura.
- **Funções puras** para cálculo de créditos, preços e montagem de prompt.
- **Fail fast** com erros de domínio tipados (`InsufficientCreditsError`), nunca `Error("erro")`.
- **Idempotência** em tudo que envolve dinheiro ou créditos.
- **Dinheiro em inteiros** (centavos) com tipo `Money`. Nunca ponto flutuante.
- **Tempo injetado** (`Clock`) para tudo que depende de data: expiração, ciclos, retenção.

## Convenções

- TypeScript `strict`, sem `any` (use `unknown` + validação com schema nas fronteiras).
- Ruby: tudo no módulo `CRenderIA`, sem escopo global, sem monkey patching, sem extensões
  nativas em C (precisa rodar igual em Windows e macOS).
- Arquivos pequenos e coesos. Alerta: arquivo com mais de ~300 linhas ou função com mais de
  ~40 linhas. Não é regra absoluta, é sinal para repensar.
- Um conceito por arquivo; nome do arquivo igual ao da classe principal.
- Logs estruturados (JSON) com `requestId` / `jobId`. Nunca logar tokens, chaves, dados de
  pagamento ou imagens.
- Segredos só em variáveis de ambiente. `.env` no `.gitignore`. Chaves de provedores de IA
  nunca chegam ao plugin.

## Testes

- Domínio: unitários cobrindo regras e bordas (créditos, expiração, estorno, ordem de consumo,
  preço por função, prompt).
- Casos de uso: portas substituídas por implementações em memória (fakes simples).
- Adaptadores externos: testes de contrato com respostas gravadas. Testes automatizados nunca
  chamam API paga.
- Bug corrigido = teste que o reproduz.
- Nomes de teste descrevem comportamento:
  `debits subscription credits before purchased credits`.

## Git

- Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Commits pequenos e atômicos. Mensagem explica o porquê quando não for óbvio.
- `main` protegida; trabalho em `feat/<assunto>` ou `fix/<assunto>`.
- Nunca commitar segredos, artefatos de build ou imagens de usuários.

## Definição de pronto

1. Atende ao critério de aceite da tarefa ou do roadmap.
2. Tem testes e todos passam.
3. Lint, formatação e tipos passam sem avisos novos.
4. Build funciona.
5. Nenhum item de "Sem manias de IA" violado.
6. Documentos e ADRs atualizados se o comportamento mudou.
7. Relato honesto do que foi e do que não foi testado.

## ADRs

Decisões relevantes (biblioteca, estrutura, provedor, mudança de regra técnica) viram ADR em
`docs/adr/NNNN-titulo.md` com: contexto, opções consideradas, decisão, consequências.
Não reverta uma decisão registrada sem propor um novo ADR.
