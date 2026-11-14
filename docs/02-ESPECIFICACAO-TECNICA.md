# 02 — Especificação Técnica · C.Render IA

Versão 0.2 · novembro de 2026

Regras de negócio, preços e créditos estão em `01-VISAO-DE-NEGOCIO.md`. Este documento diz
**como** implementá-las.

---

## 1. Objetivos técnicos

| Objetivo | Meta |
|---|---|
| Custo por crédito | Abaixo do teto configurado (inicial R$ 0,045) |
| Custo fixo | Próximo de zero sem uso; escala com a demanda |
| Plataformas | SketchUp em Windows e macOS, mesmo código |
| Troca de provedor de IA | Sem alterar plugin nem domínio; só adaptador e configuração |
| Mudança de preço/créditos | Sem deploy (configuração em banco) |
| Integridade financeira | Nenhum crédito perdido ou duplicado; tudo auditável |
| Privacidade | Imagens privadas, retidas 15 dias, exclusão comprovável |

---

## 2. Visão geral da arquitetura

```
┌───────────────────────────────────┐
│ SketchUp (Windows / macOS)        │
│ ┌───────────────────────────────┐ │
│ │ Extensão Ruby (CRenderIA)     │ │ captura vista, materiais, sol, mapa de máscaras
│ └──────────────┬────────────────┘ │
│ ┌──────────────▼────────────────┐ │
│ │ UI (TypeScript, HtmlDialog)   │ │ configuração, prompt, prévias, galeria, créditos
│ └──────────────┬────────────────┘ │
└────────────────┼──────────────────┘
                 │ HTTPS + token de sessão
┌────────────────▼──────────────────┐
│ API (TypeScript · Hono ·          │ auth, créditos, jobs, preços, URLs assinadas,
│ Cloudflare Workers)               │ webhooks de pagamento
└───────┬──────────────────┬────────┘
        │ fila de jobs     │
┌───────▼────────┐  ┌──────▼─────────────┐  ┌─────────────────────┐
│ Worker de      │  │ Postgres (Supabase)│  │ Object storage (R2) │
│ geração        │  │ contas, ledger,    │  │ imagens, 15 dias    │
│                │  │ jobs, config       │  └─────────────────────┘
└───────┬────────┘  └────────────────────┘
        │ porta ImageModelProvider
┌───────▼───────────────────────────────────────────────┐
│ Adaptadores: BFL (FLUX 3 Image Klein, FLUX.2 klein 4B) │
│              Google (Gemini Flash Image) · upscaler    │
└───────────────────────────────────────────────────────┘
```

Stack proposta para o início. Toda troca relevante exige ADR.

| Camada | Tecnologia proposta | Motivo |
|---|---|---|
| Extensão | Ruby (API do SketchUp) | Única opção para extensões SketchUp |
| UI do plugin | TypeScript + Vite, build estático | Mesma UI em Windows e macOS dentro do HtmlDialog |
| API e worker | TypeScript + Hono em Cloudflare Workers + Queues | Serverless, custo ~0 parado, escala automática |
| Banco e auth | Supabase (Postgres + Auth) | Postgres real, plano gratuito no início |
| Storage | Cloudflare R2 | Sem cobrança de transferência de saída |
| Validação | Zod | Schemas compartilhados entre UI e API |
| Testes | Vitest (TS), Minitest (Ruby) | Padrão das comunidades |
| Qualidade | ESLint, Prettier, RuboCop | Padrão das comunidades |
| CI | GitHub Actions | Lint, tipos, testes e build por pull request |

---

## 3. Estrutura do repositório

```
c-render-ia/
├── CLAUDE.md
├── docs/
│   ├── 01-VISAO-DE-NEGOCIO.md
│   ├── 02-ESPECIFICACAO-TECNICA.md
│   ├── 03-ROADMAP.md
│   ├── 04-PROMPTS-DE-EXECUCAO.md
│   └── adr/
├── apps/
│   ├── sketchup-extension/   # Ruby: loader + módulo CRenderIA
│   ├── plugin-ui/            # TS + Vite, empacotado dentro da extensão
│   ├── api/                  # Worker HTTP (Hono)
│   ├── generation-worker/    # Consumidor da fila de jobs
│   └── web/                  # Painel web: conta, plano, compra, galeria
└── packages/
    ├── domain/               # Entidades, objetos de valor, regras puras (sem I/O)
    ├── application/          # Casos de uso e portas (interfaces)
    ├── infrastructure/       # Adaptadores: banco, storage, IA, pagamento, notificação
    ├── prompt-builder/       # Montagem determinística de prompt (UI e backend)
    └── contracts/            # Schemas Zod e tipos da API compartilhados
```

Regra de dependência: `domain` não depende de nada; `application` depende de `domain`;
`infrastructure` e `apps` dependem de `application` e `domain`. Checar com regra de lint
de importação.

---

## 4. Modelo de domínio

### 4.1 Objetos de valor

| Objeto | Responsabilidade |
|---|---|
| `Money` | Centavos (inteiro) + moeda; soma, subtração, porcentagem com arredondamento definido |
| `Credits` | Inteiro não negativo; operações que nunca resultam em negativo |
| `AspectRatio` | Proporções suportadas (16:9, 4:3, 3:2, 1:1, 4:5, 9:16, A-series) |
| `OutputResolution` | 1K, 2K, 4K; calcula largura e altura a partir do `AspectRatio` |
| `RenderStyle` | Estilos suportados (fotorrealista, aquarela, croqui, maquete, noturno etc.) |
| `QualityTier` | `economy`, `premium` |
| `FeatureCode` | Identificador de função cobrável (`render_direct`, `render_with_previews`, `extra_previews`, `render_premium_4k`, `enhance_render`, `sketch_to_render`, `inpaint`, `upscale`, `ideas`) |
| `SunSettings`, `MaterialHint` | Metadados vindos do SketchUp, já validados |

### 4.2 Agregados

**`Account`**: dono da carteira; pode ter vários `User` (plano Escritório).

**`Subscription`**: plano, ciclo (mensal/anual), status, início e fim do período, preço
travado no período.

**`CreditWallet`** com livro-razão:

- O saldo é **derivado** dos lançamentos (`CreditEntry`); nunca é um campo editado.
- Tipos de lançamento: `grant`, `reserve`, `capture`, `release`, `expire`, `refund`.
- Baldes: `subscription` (expira no fim do ciclo) e `purchased` (expira em 12 meses).
- Ordem de consumo: `subscription` antes de `purchased`; dentro do balde, o que expira
  primeiro.
- Todo lançamento tem chave de idempotência única.
- Reserva em múltiplos baldes é atômica (uma transação).

**`RenderJob`** com máquina de estados explícita:

```
queued ─► generating_previews ─► awaiting_selection ─► generating_final ─► checking_geometry ─► succeeded
   │               │                      │                    │                    │
   └───────────────┴──────────────────────┴────────────────────┴────────────────────┴─► failed
                                          │                                         └─► rejected_geometry
                                          └─► abandoned (timeout de seleção)
```

- Transição inválida lança erro de domínio.
- `failed`, `rejected_geometry` e `abandoned` liberam a reserva (`abandoned` libera só a
  parte do render final ainda não executada).
- Render direto (sem prévias) pula `generating_previews` e `awaiting_selection`.

**`RenderAsset`**: imagem armazenada (entrada, prévia, final, máscara), com `expiresAt`,
provedor, modelo, versão, parâmetros e custo em dólar.

### 4.3 Serviços de domínio

| Serviço | Regra |
|---|---|
| `FeaturePricing` | `créditos = ceil(custoEmReais / tetoPorCrédito)`, mínimo 1. Entradas vêm de configuração versionada |
| `PromptBuilder` | Entrada estruturada → prompt. Templates versionados; mesma entrada gera sempre o mesmo prompt; sem LLM no caminho padrão |
| `GeometryCheck` | Compara bordas da entrada e da saída; abaixo do limiar configurado → `rejected_geometry` |
| `RetentionPolicy` | Calcula `expiresAt` e quando avisar (3 dias antes) |
| `PriceAdjustmentPolicy` | Detecta câmbio acima do limite por 30 dias e agenda reajuste na renovação |

### 4.4 Portas (em `application`)

| Porta | Adaptadores previstos |
|---|---|
| `ImageModelProvider` (`generate`, `edit`, `upscale`) | BFL, Google, upscaler |
| `ProviderRouter` | Escolhe provedor/modelo por `FeatureCode` e `QualityTier`, com fallback |
| `JobQueue` | Cloudflare Queues |
| `AssetStorage` (`put`, `signedUrl`, `delete`) | R2 |
| `PaymentGateway` (`createCheckout`, `createSubscription`, `cancel`, `parseWebhook`) | A definir |
| `Notifier` (e-mail, aviso no plugin) | A definir |
| `ExchangeRateSource` | API pública de câmbio (ex.: PTAX do Banco Central) |
| `ContentModeration` | A definir |
| `Clock` | Sistema / fake em testes |
| Repositórios | Postgres |

---

## 5. Pipelines de geração

### 5.1 Render com prévias

1. UI envia parâmetros estruturados + imagem capturada + metadados.
2. API valida, calcula créditos via `FeaturePricing`, **reserva** e cria o job.
3. Backend **recalcula o prompt** com `PromptBuilder` (o prompt vindo do cliente é só exibição).
4. Moderação de conteúdo.
5. Worker gera **uma imagem em grade 2x2** com 4 variações (uma chamada ao provedor).
6. UI mostra as prévias; usuário escolhe uma (ou pede nova rodada, cobrada à parte).
7. Worker gera o final na resolução escolhida, usando a prévia escolhida como referência.
8. `GeometryCheck` compara com a captura original.
9. Sucesso → `capture` dos créditos; falha/reprovação → `release`.

### 5.2 Render direto, melhorar render, croqui, ideias

Mesmo pipeline sem as etapas 5–6. Muda o template do `PromptBuilder` e o `FeatureCode`.

### 5.3 Edição (pincel ou máscara de material)

- Máscara vem do pincel na UI ou do **mapa de materiais** exportado pelo SketchUp.
- Worker chama `ImageModelProvider.edit` com imagem, máscara e instrução.
- Mesmas regras de reserva, captura e estorno.

### 5.4 Modelos e licenças

| Uso | Modelo | Licença |
|---|---|---|
| Prévias, final econômico e premium 4K | FLUX 3 Image Klein (API BFL) | Uso comercial pela API oficial |
| Opção aberta para infraestrutura própria (futuro) | FLUX.2 [klein] 4B | Apache 2.0 |
| Reserva | Gemini Flash Image (API Google) | Uso comercial pela API |
| Upscale | Real-ESRGAN (API) | Verificar licença do provedor escolhido |

**Proibido sem ADR e revisão jurídica:** qualquer modelo `[dev]` (FLUX.1 dev, FLUX.2 dev,
Kontext dev) e FLUX.2 klein 9B em infraestrutura própria.

Configuração de modelos (provedor, identificador, versão, preço unitário em dólar, etapa) fica
em tabela versionada. Cada `RenderAsset` registra o modelo e o custo efetivo.

---

## 6. Extensão SketchUp

- Ruby puro, sem extensões nativas, dentro do módulo `CRenderIA`, no padrão de extensões
  SketchUp (loader + pasta da extensão).
- Versão mínima do SketchUp a definir (proposta: 2022+). Confirmar disponibilidade de cada
  método da API Ruby usado nessa versão.
- **Captura da vista:** exporta a vista com largura e altura do safe frame para arquivo
  temporário (a API Ruby grava imagens em arquivo), lê e repassa à UI.
- **Metadados:** materiais visíveis (nomes), configuração de sombra e sol, câmera.
- **Mapa de materiais:** pinta temporariamente cada material com cor sólida única e exporta.
  Executar dentro de uma operação que é **sempre revertida**, inclusive em erro. O modelo do
  usuário nunca pode ficar alterado nem poluir o histórico de desfazer.
- **Caminhos:** `File.join` e diretório temporário do sistema; nenhum caminho fixo de SO.
- **Credenciais:** só token de sessão do usuário, armazenado da forma mais segura disponível;
  nunca chaves de provedores.
- **Comunicação Ruby ↔ UI:** callbacks do HtmlDialog com mensagens tipadas (mesmos schemas
  de `contracts`).
- **Atualização:** verificar versão nova na inicialização e avisar o usuário.
- Testar cada release em Windows e macOS.

---

## 7. UI do plugin

- TypeScript + Vite, build estático empacotado na extensão. Sem framework pesado sem ADR.
- Telas: login; configurar render (safe frame, resolução, estilo, qualidade, texto livre);
  prompt (seta expansível); prévias 2x2; resultado; edição (pincel + máscara por material);
  galeria com "expira em X dias" e "baixar tudo"; saldo e compra de créditos.
- Custo em créditos e saldo visíveis antes de qualquer confirmação.
- Textos em arquivo de tradução pt-BR.
- Estados de carregamento e erro claros; nenhuma ação cobrável dispara duas vezes (botão
  bloqueado + chave de idempotência).

---

## 8. Pagamentos

- Requisitos: Pix, cartão, assinatura recorrente, webhooks.
- O código depende só da porta `PaymentGateway`.
- Webhooks: verificação de assinatura, processamento idempotente, registro bruto do evento.
- Créditos concedidos somente após confirmação de pagamento.
- Preços lidos da configuração no momento da compra e gravados no pedido.

---

## 9. Segurança e privacidade (LGPD)

- Imagens privadas; acesso só por URL assinada de curta duração.
- Rotina agendada de exclusão após 15 dias, com registro da exclusão.
- Avisos de retenção conforme `01-VISAO-DE-NEGOCIO.md`.
- Imagens nunca usadas para treino; verificar e documentar a política de retenção de cada
  provedor de IA.
- Limite de requisições por usuário e por IP.
- Dados de cartão nunca passam pelo nosso servidor.
- Princípio do menor privilégio nas chaves de serviço.

---

## 10. Observabilidade

Registrar por job: tempo por etapa, provedor, modelo, custo em dólar, créditos cobrados,
resultado, motivo de falha.

Painel interno mínimo (consulta SQL já resolve no início):

- custo real por crédito (diário e por função);
- taxa de falha e de reprovação de geometria;
- uso médio por plano;
- receita × custo de IA.

Alerta quando o custo real por crédito ultrapassar o teto configurado.

---

## 11. Qualidade

- TypeScript `strict`, ESLint, Prettier, Vitest.
- Ruby: RuboCop, Minitest.
- Regra de lint para a direção das dependências entre pacotes.
- CI em cada pull request: lint, tipos, testes, build.
- Testes obrigatórios de domínio: ledger (reserva, captura, liberação, expiração, ordem de
  consumo, idempotência), `FeaturePricing`, máquina de estados do job, `PromptBuilder`
  (snapshot), `RetentionPolicy`.

---

## 12. ADRs iniciais a registrar na Fase 0

1. Monorepo e gerenciador de pacotes.
2. Cloudflare Workers + Queues + R2 para API, worker e storage.
3. Supabase para Postgres e autenticação.
4. Arquitetura hexagonal e regra de dependência entre pacotes.
5. Livro-razão de créditos com saldo derivado.
6. Política de modelos de IA permitidos (licenças).
