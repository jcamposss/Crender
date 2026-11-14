# 03 — Roadmap · C.Render IA

Versão 0.2 · novembro de 2026

Cada fase termina com algo **funcionando, testado e demonstrável**. Não avançar de fase sem
cumprir os critérios de saída.

---

## Visão geral

| Fase | Nome | Valor de negócio |
|---|---|---|
| 0 | Fundação | Base que permite evoluir rápido sem quebrar |
| 1 | Prova de conceito | Validar qualidade da IA com prints reais antes de investir no resto |
| 2 | Render completo | Produto utilizável: prompt, prévias, econômico e premium |
| 3 | Contas e créditos | Base para cobrar com segurança |
| 4 | Pagamentos | Receita |
| 5 | Edição e galeria | Paridade com o Redraw no essencial + diferencial de máscara |
| 6 | Beta fechado | Validar preço, qualidade e uso real |
| 7 | Lançamento | Venda aberta |
| 8+ | Expansão | Funções extras como configuração, conforme demanda |

---

## Fase 0 — Fundação

**Entregáveis**
- Monorepo com a estrutura de `02-ESPECIFICACAO-TECNICA.md`.
- Lint, formatação, checagem de tipos, testes e CI funcionando.
- Regra de lint de direção de dependências entre pacotes.
- ADRs iniciais (lista na seção 12 do documento técnico).
- Pacote `domain` com `Money`, `Credits`, `AspectRatio`, `OutputResolution` e testes.

**Critérios de saída**
- `lint`, `typecheck`, `test` e `build` passam localmente e no CI.
- Extensão SketchUp mínima ("olá") instala e abre um HtmlDialog vazio em Windows e macOS.

## Fase 1 — Prova de conceito

**Entregáveis**
- Extensão captura a vista no safe frame escolhido.
- API recebe a imagem e chama o adaptador BFL (FLUX 3 Image Klein) com prompt fixo.
- Render volta e aparece na UI do plugin.
- Script de avaliação: rodar 20 capturas reais e salvar entrada × saída para comparação.

**Critérios de saída**
- Fluxo ponta a ponta funcionando em Windows e macOS.
- Avaliação de qualidade documentada (aprovado / ajustar / trocar modelo).
- Custo real por render medido e comparado com a estimativa.

## Fase 2 — Render completo

**Entregáveis**
- `PromptBuilder` com templates versionados, materiais e sol do modelo.
- Seta de visualização do prompt + texto livre.
- Prévias em grade 2x2, seleção, rodada extra.
- Render direto, render com prévias, premium 4K.
- Melhorar render existente e croqui para render (mesmo pipeline, outros templates).
- `GeometryCheck` com limiar inicial calibrado nas capturas da Fase 1.

**Critérios de saída**
- Todas as funções acima operando com estados de job corretos.
- Snapshot tests do `PromptBuilder` cobrindo todos os estilos.

## Fase 3 — Contas e créditos

**Entregáveis**
- Autenticação (e-mail + verificação de celular).
- `CreditWallet` com livro-razão, baldes, ordem de consumo, expiração.
- Reserva, captura e liberação integradas ao ciclo do job.
- `FeaturePricing` lendo configuração versionada.
- Teste grátis.

**Critérios de saída**
- Testes cobrindo todas as regras de crédito, incluindo concorrência e idempotência.
- Nenhum caminho de código altera saldo sem lançamento no livro-razão.

## Fase 4 — Pagamentos

**Entregáveis**
- ADR do gateway escolhido.
- Planos mensais e anuais, recarga com desconto, pacotes avulsos.
- Webhooks idempotentes; concessão de créditos após confirmação.
- Painel web: conta, plano, saldo, histórico, compra.
- Botão de compra de créditos dentro do plugin quando o saldo acaba.

**Critérios de saída**
- Fluxos de compra testados em ambiente de teste do gateway (assinatura, renovação,
  cancelamento, recarga, avulso, falha de pagamento).

## Fase 5 — Edição e galeria

**Entregáveis**
- Mapa de materiais exportado pela extensão (operação sempre revertida).
- Edição por máscara de material e por pincel.
- Upscale.
- Galeria com expiração de 15 dias, selo de contagem, aviso 3 dias antes, "baixar tudo".
- Rotina de exclusão definitiva com registro.

**Critérios de saída**
- Modelo do usuário comprovadamente inalterado após exportar o mapa de materiais (teste).
- Exclusão de 15 dias verificada em ambiente de teste com `Clock` simulado.

## Fase 6 — Beta fechado

**Entregáveis**
- 10–20 arquitetos usando gratuitamente ou com desconto.
- Coleta dos indicadores de `01-VISAO-DE-NEGOCIO.md` (seção 9).
- Ajustes de qualidade, limiares e preços.

**Critérios de saída**
- Custo real por crédito abaixo do teto.
- Decisões em aberto do documento de negócio resolvidas.
- Termos de uso e privacidade revisados juridicamente.

## Fase 7 — Lançamento

- Landing page com planos, publicação no Extension Warehouse, conteúdo antes/depois.

## Fase 8+ — Expansão (por demanda, via configuração)

- Imagem de referência (copiar luz e clima de uma foto).
- Ideias / imagem por texto.
- Safe frame com expansão de cena (outpainting).
- Consistência de estilo entre vistas do mesmo projeto.
- Modelos de terceiros adicionais (ex.: Nano Banana Pro), precificados pela fórmula.
- Imagem para vídeo.
- Plugins para Revit e Rhino.
- Migração parcial para infraestrutura própria com modelo Apache 2.0, se o volume justificar.

---

## Matriz de funcionalidades vs Redraw

| Função | Redraw | C.Render IA | Fase |
|---|---|---|---|
| Render a partir de captura 3D | Sim | Sim, dentro do SketchUp | 1–2 |
| Melhorar render existente | Sim | Sim | 2 |
| Croqui para render | Sim | Sim | 2 |
| Prompt visível e editável | Não | Sim | 2 |
| Uso de materiais e sol do modelo | Não | Sim | 2 |
| Pincel de edição | Sim | Sim | 5 |
| Máscara automática por material | Não | Sim | 5 |
| Upscale | Sim | Sim | 5 |
| Não cobrar por falha | Não divulgado | Sim | 3 |
| Créditos avulsos | Não divulgado | Sim | 4 |
| Imagem de referência | Sim | Sim | 8+ |
| Ideias / texto para imagem | Sim | Sim | 8+ |
| Vários modelos de terceiros | Sim | Sim, via configuração | 8+ |
| Vídeo | Sim | Sim | 8+ |
| Objetos 3D | Sim | Fora do escopo | — |
