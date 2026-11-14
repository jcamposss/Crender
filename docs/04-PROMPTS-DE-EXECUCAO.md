# 04 — Prompts de Execução · C.Render IA

Prompts prontos para colar no Claude Code, um por fase. Todos seguem a mesma estrutura:
contexto, objetivo, escopo, fora do escopo, restrições, critérios de aceite e forma de entrega.

Uso: cole o prompt da fase atual. Aprove o plano antes de qualquer código. Ao terminar a fase,
peça o relatório final e só então passe para a próxima.

---

## Prompt 0 — Kickoff (use uma vez, antes da Fase 0)

```
Contexto:
Você vai trabalhar no projeto C.Render IA. Leia, nesta ordem:
CLAUDE.md, docs/01-VISAO-DE-NEGOCIO.md, docs/02-ESPECIFICACAO-TECNICA.md, docs/03-ROADMAP.md.

Objetivo:
Confirmar entendimento do projeto antes de qualquer código.

Entregue em português:
1. Resumo do produto em até 5 linhas, incluindo o diferencial frente ao Redraw.
2. As 5 regras de negócio que mais impactam o código e onde cada uma vai morar
   (pacote/classe).
3. Contradições, lacunas ou riscos que você encontrou nos documentos.
4. Perguntas que precisam de resposta antes da Fase 0.

Restrições:
Não crie arquivos nem escreva código nesta etapa.
```

---

## Prompt Fase 0 — Fundação

```
Contexto:
Fase 0 do docs/03-ROADMAP.md. Siga o CLAUDE.md integralmente.

Objetivo:
Criar a fundação do monorepo para que as próximas fases evoluam rápido e com segurança.

Escopo:
- Estrutura de pastas da seção 3 de docs/02-ESPECIFICACAO-TECNICA.md.
- Gerenciador de pacotes e workspaces (proponha e justifique em ADR).
- TypeScript strict, ESLint, Prettier, Vitest; RuboCop e Minitest para a extensão.
- Regra de lint que impede violar a direção de dependências entre pacotes.
- CI no GitHub Actions: lint, typecheck, test, build.
- ADRs iniciais da seção 12 do documento técnico.
- Pacote domain com Money, Credits, AspectRatio e OutputResolution, com testes.
- Extensão SketchUp mínima que abre um HtmlDialog vazio.

Fora do escopo:
API, banco, provedores de IA, pagamento, telas reais.

Restrições:
- Apresente o plano (arquivos, dependências com justificativa, ordem) e espere aprovação.
- Nenhuma dependência sem justificar licença, tamanho e manutenção.

Critérios de aceite:
- lint, typecheck, test e build passam localmente e no CI.
- Objetos de valor com invariantes testadas (ex.: Credits nunca negativo, Money sem float).
- Instruções de como instalar a extensão mínima no SketchUp em Windows e macOS.

Entrega:
Relatório com o que foi feito, comandos para verificar, o que não foi testado e próximos passos.
```

---

## Prompt Fase 1 — Prova de conceito

```
Contexto:
Fase 1 do docs/03-ROADMAP.md. Objetivo de negócio: validar a qualidade da IA com prints
reais antes de investir no restante do produto.

Objetivo:
Fluxo ponta a ponta: captura no SketchUp → API → FLUX 3 Image Klein (BFL) → render exibido
no plugin.

Escopo:
- Extensão: captura da vista com largura/altura do safe frame escolhido (arquivo temporário,
  caminhos independentes de SO).
- UI: escolher safe frame e resolução, enviar, exibir resultado.
- API: endpoint de render síncrono simples (a fila entra depois), validação com schema.
- Porta ImageModelProvider e primeiro adaptador BFL. Confira a documentação oficial da API
  BFL antes de implementar; não invente parâmetros.
- Script de avaliação que processa uma pasta de capturas e salva entrada × saída × custo.

Fora do escopo:
Autenticação, créditos, prévias, PromptBuilder completo, fila, storage permanente.

Restrições:
- Chave da BFL só no backend, via variável de ambiente.
- Adaptador testado com resposta gravada; nenhum teste automatizado chama a API paga.
- Registrar modelo, versão e custo de cada chamada.

Critérios de aceite:
- Funciona em Windows e macOS (descreva como testou cada um).
- Relatório de avaliação com 20 capturas reais e custo médio medido.

Entrega:
Relatório + recomendação técnica: manter o modelo, ajustar parâmetros ou testar o reserva.
```

---

## Prompt Fase 2 — Render completo

```
Contexto:
Fase 2 do docs/03-ROADMAP.md. Regras de créditos e funções: seção 6 de
docs/01-VISAO-DE-NEGOCIO.md. Pipelines: seção 5 de docs/02-ESPECIFICACAO-TECNICA.md.

Objetivo:
Produto de render utilizável, com a inteligência que diferencia o C.Render IA.

Escopo:
- PromptBuilder determinístico com templates versionados, usando estilo, qualidade, materiais
  e sol. Mesmo input = mesmo prompt. Snapshot tests.
- Extensão coleta nomes de materiais visíveis e configuração de sol.
- Seta de prompt na UI + campo de texto livre. O backend recalcula o prompt.
- RenderJob com a máquina de estados da seção 4.2 (transições inválidas = erro de domínio).
- Fila de jobs e worker.
- Prévias em grade 2x2 (uma chamada), seleção, rodada extra.
- Render direto, render com prévias, premium 4K, melhorar render, croqui para render.
- GeometryCheck com limiar configurável, calibrado com as capturas da Fase 1.
- Storage em R2 com URL assinada.

Fora do escopo:
Login real, cobrança de créditos (apenas registrar o FeatureCode e o custo), pagamentos.

Restrições:
- FeatureCode e preço por função vêm de configuração, não de constantes.
- Explique no plano o impacto de cada decisão no custo por render.

Critérios de aceite:
- Todas as funções funcionando ponta a ponta.
- Testes da máquina de estados cobrindo todos os caminhos, incluindo falha e reprovação.
- Custo médio por função medido e comparado com a tabela 6.2 do documento de negócio.
```

---

## Prompt Fase 3 — Contas e créditos

```
Contexto:
Fase 3 do docs/03-ROADMAP.md. Regras: seções 6 e 7 de docs/01-VISAO-DE-NEGOCIO.md.
Modelo: seção 4.2 de docs/02-ESPECIFICACAO-TECNICA.md. Esta é a parte mais sensível do
sistema: dinheiro do cliente.

Objetivo:
Contas e carteira de créditos confiáveis, auditáveis e à prova de duplicidade.

Escopo:
- Autenticação com e-mail e verificação de celular.
- Account, User, CreditWallet com livro-razão (grant, reserve, capture, release, expire,
  refund), baldes subscription e purchased, ordem de consumo e expiração.
- Saldo sempre derivado dos lançamentos.
- FeaturePricing: ceil(custo_em_reais / teto_por_credito), mínimo 1, com configuração
  versionada (câmbio efetivo, teto, custo por modelo).
- Integração com o ciclo do RenderJob: reserva ao criar, captura no sucesso, liberação em
  failed, rejected_geometry e abandoned.
- Teste grátis conforme configuração.

Fora do escopo:
Gateway de pagamento (créditos concedidos manualmente por comando administrativo nesta fase).

Restrições:
- Idempotência em todo lançamento.
- Reserva em múltiplos baldes em uma única transação.
- Clock injetado em tudo que depende de data.

Critérios de aceite:
- Testes para: ordem de consumo, expiração por balde, reserva parcial entre baldes, captura,
  liberação, chamadas duplicadas, concorrência (duas reservas simultâneas no limite do saldo).
- Prova de que nenhum caminho altera saldo sem lançamento.
```

---

## Prompt Fase 4 — Pagamentos

```
Contexto:
Fase 4 do docs/03-ROADMAP.md. Planos, pacotes, recarga e regras: seções 6 e 7 de
docs/01-VISAO-DE-NEGOCIO.md.

Objetivo:
Receber dinheiro com segurança e conceder créditos corretamente.

Escopo:
- Comparar gateways que aceitam Pix + cartão + assinatura recorrente (taxas, webhooks,
  qualidade da documentação, sandbox) e registrar a escolha em ADR antes de implementar.
- Adaptador PaymentGateway.
- Planos mensais e anuais, recarga com desconto para assinante, pacotes avulsos.
- Webhooks com verificação de assinatura, idempotência e registro bruto do evento.
- Renovação concede créditos do novo ciclo e expira os do anterior.
- Painel web: conta, plano, saldo, histórico, compra.
- Botão de compra no plugin quando o saldo acaba.

Restrições:
- Preços lidos de configuração e gravados no pedido no momento da compra.
- Dados de cartão nunca passam pelo nosso servidor.

Critérios de aceite:
- Cenários testados no sandbox: assinatura, renovação, cancelamento, upgrade, recarga, avulso,
  pagamento recusado, webhook duplicado, webhook fora de ordem.
```

---

## Prompt Fase 5 — Edição e galeria

```
Contexto:
Fase 5 do docs/03-ROADMAP.md. Diferencial principal: máscara automática por material.

Objetivo:
Edição de áreas do render e galeria com retenção de 15 dias.

Escopo:
- Extensão: exportar mapa de materiais (cor sólida única por material) dentro de uma operação
  sempre revertida, inclusive em erro, sem poluir o histórico de desfazer.
- UI: escolher área por material ou por pincel, instrução de edição, custo visível.
- Pipeline de edição (seção 5.3 do documento técnico).
- Upscale.
- Galeria: selo "expira em X dias", aviso 3 dias antes (plugin e e-mail), "baixar tudo".
- Rotina agendada de exclusão definitiva com registro.

Critérios de aceite:
- Teste que prova que o modelo do usuário fica idêntico após exportar o mapa de materiais.
- Teste da retenção com Clock simulado (criação, aviso, exclusão).
- Edição funcionando com máscara de material e com pincel.
```

---

## Prompt de manutenção (use a qualquer momento)

```
Revise o módulo <caminho> com olhar de engenheiro sênior, seguindo o CLAUDE.md.

Entregue:
1. Problemas de design (responsabilidades misturadas, acoplamento, nomes ruins).
2. Riscos de bug ou de dinheiro (créditos, pagamentos, concorrência).
3. Violações da seção "Sem manias de IA".
4. Sugestões priorizadas por impacto, com esforço estimado.

Não altere nada até eu aprovar.
```

## Prompt de relatório de fase

```
Gere o relatório de encerramento da fase atual:
- Entregáveis concluídos vs planejados.
- Critérios de saída: cumprido / não cumprido, com evidência.
- Custo real medido vs estimado (se aplicável).
- Dívidas técnicas criadas e por quê.
- Riscos para a próxima fase.
- Atualizações necessárias nos documentos em docs/.
```
