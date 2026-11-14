# 01 — Visão de Negócio · C.Render IA

Versão 0.2 · novembro de 2026

> Todos os valores deste documento (preços, créditos, limites, prazos) são **configuração**
> do sistema, não constantes no código. Mudar preço não pode exigir deploy.

---

## 1. Resumo executivo

O C.Render IA é um plugin para SketchUp que gera renders com IA **sem sair do SketchUp**. O
arquiteto escolhe enquadramento, resolução e estilo; o plugin lê o próprio modelo 3D
(materiais, sol, geometria) para montar o pedido à IA e devolve o render em segundos.

Modelo de receita: assinatura mensal ou anual com créditos, mais créditos avulsos.
Mercado inicial: arquitetos, designers de interiores e estudantes no Brasil.
Estratégia de preço: igual ou abaixo do principal concorrente nacional (Redraw), com fluxo
de trabalho superior.

---

## 2. Problema

- Render tradicional (V-Ray, Lumion, Enscape) exige máquina potente, configuração de cena e
  tempo. Para estudo de conceito e apresentação rápida ao cliente, é caro demais.
- Ferramentas de render com IA existentes funcionam no navegador: o arquiteto tira print,
  sai do SketchUp, faz upload, espera, baixa, volta. A IA não conhece os materiais nem a
  intenção do projeto e às vezes altera a geometria.
- Preços em dólar pesam para o profissional brasileiro.

## 3. Público-alvo

| Segmento | Dor principal | Plano provável |
|---|---|---|
| Arquiteto ou designer autônomo | Apresentar opções ao cliente rápido e barato | Essencial |
| Escritório pequeno (2–15 pessoas) | Volume de imagens para vários projetos | Pro / Escritório |
| Estudante de arquitetura | Portfólio e entregas de faculdade | Essencial / avulso |
| Uso esporádico | Precisa de poucas imagens por mês | Créditos avulsos |

## 4. Proposta de valor

**"Render com IA dentro do SketchUp, que entende o seu projeto."**

1. **Sem sair do SketchUp.** Captura, prévias, render, edição e galeria no próprio plugin.
2. **A IA conhece o modelo.** Nomes de materiais e posição do sol entram no pedido
   automaticamente. Resultado mais fiel com menos tentativas.
3. **Edição com um clique.** Máscaras geradas pelos materiais do modelo: "trocar o piso",
   "trocar o céu", sem pintar à mão.
4. **Transparência.** O usuário vê o prompt gerado e pode complementar.
5. **Não paga por erro.** Render que falha ou deforma a geometria não consome crédito.
6. **Preço em real, Pix, sem surpresa.** Custo em créditos sempre visível antes de confirmar.

---

## 5. Concorrência

### 5.1 Panorama

| Concorrente | Formato | Preço de entrada | Observação |
|---|---|---|---|
| **Redraw** (referência principal) | Web + plugin gratuito que só exporta a captura | ~R$ 67/mês (US$15) · 600 coins | Forte no Brasil, muitos modelos de IA, vídeo |
| Veras (Chaos) | Plugin SketchUp/Revit/Rhino | US$29/mês | Mais adotado por escritórios grandes |
| mnml.ai | Web | US$19/mês | Muitas ferramentas e estilos |
| D5 Render | Software + IA | US$30/mês | Render tradicional com IA de pós-produção |
| SketchUp AI (nativo) | Integrado | Créditos da assinatura SketchUp | Qualidade inferior segundo reviews |

### 5.2 Redraw em detalhe

| Plano | Mensal | Coins/mês | Renders 3D (2 coins) | Usuários |
|---|---|---|---|---|
| Teste | grátis | 10 | 5 | 1 |
| Basic | US$15 (~R$ 67) | 600 | 300 | 1 |
| Expert | US$32 | 2.000 | 1.000 | 1 |
| Business Elite | US$92 | 7.000 | 3.500 | 15 |

Anual: paga 10 meses. Não divulga pacotes avulsos de coins na página de preços.

### 5.3 Onde vencemos

| Recurso | Redraw | C.Render IA |
|---|---|---|
| Render dentro do SketchUp | Não (plugin exporta, render no navegador) | Sim |
| Usa materiais do modelo no pedido | Não | Sim |
| Máscara automática por material | Não (pincel manual) | Sim, além do pincel |
| Prompt visível e editável | Não | Sim |
| Safe frame com expansão de cena | Não | Fase 2 |
| Consistência de estilo entre vistas | Não | Fase 3 |
| Créditos avulsos sem assinatura | Não divulgado | Sim |
| Não cobra por falha | Não divulgado | Sim, regra explícita |

### 5.4 Posicionamento

- **Paridade no essencial:** render de modelo 3D, melhorar render, croqui para render,
  pincel, upscale.
- **Superioridade no fluxo:** tudo dentro do SketchUp, inteligência a partir do modelo.
- **Preço:** igual ou abaixo do Redraw em todos os planos, com o mesmo volume de créditos.
- Não competir em quantidade de modelos de IA de terceiros no lançamento. Adicionar conforme
  demanda, via configuração.

---

## 6. Modelo de receita

### 6.1 Unidade: crédito

Um crédito tem o mesmo "tamanho" de um coin do Redraw, para comparação direta.

**Fórmula de preço de qualquer função:**

```
créditos = arredondar_para_cima( custo_real_em_reais / teto_de_custo_por_crédito )
mínimo de 1 crédito
```

- `teto_de_custo_por_crédito` inicial: **R$ 0,045**
- Custo real em reais usa câmbio efetivo conservador (inicial: **R$ 5,50 por US$**, já
  considerando IOF e spread do cartão internacional).
- Toda função nova recebe preço por essa fórmula. Isso garante que nenhuma função dê
  prejuízo, inclusive modelos caros de terceiros.

### 6.2 Tabela de créditos (lançamento)

| Função | Modelo previsto | Custo estimado | Créditos | Redraw |
|---|---|---|---|---|
| Render direto (1K, sem prévias) | FLUX 3 Image Klein | US$0,009 | 2 | 2 |
| Render com 4 prévias (grade 2x2 + final 1K) | FLUX 3 Image Klein | US$0,018 | 3 | — |
| Rodada extra de prévias (768px) | FLUX 3 Image Klein | US$0,008 | 1 | — |
| Render premium 4K nativo (com prévias) | FLUX 3 Image Klein | US$0,045 | 6 | 20 (Nano Banana Pro) |
| Melhorar render existente | FLUX 3 Image Klein | US$0,009 | 2 | 2 |
| Croqui para render | FLUX 3 Image Klein | US$0,009 | 2 | 1 |
| Edição por pincel ou máscara de material | FLUX 3 Image Klein | US$0,009 | 2 | 2 |
| Upscale | Real-ESRGAN | ~US$0,005 | 1 | 1 |
| Ideias / imagem por texto (768px) | FLUX 3 Image Klein | US$0,008 | 1 | 1 |
| Nano Banana Pro 2K (fase 3) | Google | US$0,134 | 17 | 20 |

Custos estimados com preços publicados em out–nov/2026; recalcular com a fatura real após
o beta.

### 6.3 Assinaturas

Créditos de assinatura renovam a cada ciclo e **não acumulam**.

| Plano | Mensal | Anual (1 mês grátis) | Créditos/mês | Usuários | Comparação Redraw |
|---|---|---|---|---|---|
| Essencial | R$ 59,90 | R$ 658,90 | 600 | 1 | Basic: ~R$ 67, 600 coins |
| Pro | R$ 129,90 | R$ 1.428,90 | 2.000 | 1 | Expert: US$32, 2.000 coins |
| Escritório | R$ 379,90 | R$ 4.178,90 | 7.000 | 15 | Business: US$92, 7.000 coins |

Todos os planos têm acesso a todas as funções; muda só o volume de créditos e usuários.

### 6.4 Créditos avulsos e recarga

Créditos comprados valem **12 meses**.

| Pacote | Avulso (sem assinatura) | Recarga para assinante (−20%) |
|---|---|---|
| 200 créditos | R$ 29,90 | R$ 23,90 |
| 600 créditos | R$ 74,90 | R$ 59,90 |
| 1.500 créditos | R$ 159,90 | R$ 127,90 |

O preço por crédito avulso é sempre maior que o da assinatura equivalente, para que o usuário
frequente prefira assinar. O botão de compra aparece dentro do plugin quando o saldo acaba.

### 6.5 Teste grátis

- Decisão vigente: **1 render** por conta.
- Em avaliação: **3 renders diretos (6 créditos)**, para competir com os 5 renders do Redraw.
  Custo estimado: ~R$ 0,15 por conta de teste.
- Exige e-mail e celular verificados.

---

## 7. Regras comerciais

| Regra | Definição |
|---|---|
| Reserva de crédito | Créditos são reservados ao iniciar e capturados só no sucesso |
| Falha | Job que falha ou é reprovado na checagem de geometria libera a reserva; usuário não paga |
| Ordem de consumo | Primeiro créditos da assinatura (expiram antes), depois comprados |
| Retenção de imagens | 15 dias, depois exclusão definitiva |
| Avisos de retenção | Termos de uso; primeiro uso; selo "expira em X dias"; aviso 3 dias antes; botão "baixar tudo" |
| Uso das imagens | Nunca usadas para treinar modelos |
| Reajuste por câmbio | Cotação média acima de R$ 6,00 por 30 dias → novo preço na próxima renovação, com aviso de 30 dias |
| Plano anual | Preço mantido até a renovação |
| Arrependimento | 7 dias (CDC); regra para créditos já consumidos a definir com assessoria jurídica |
| Plataformas | SketchUp em Windows e macOS |

---

## 8. Unit economics

Premissas: câmbio efetivo R$ 5,50; taxa do gateway ~5%; custos fixos de infraestrutura
~R$ 250/mês; **impostos não incluídos** (definir regime com contador).

### 8.1 Margem por plano

| Plano | Preço | Custo máximo (100% uso, pior função) | Margem mínima |
|---|---|---|---|
| Essencial | R$ 59,90 | R$ 27,00 | ~50% |
| Pro | R$ 129,90 | R$ 90,00 | ~26% |
| Escritório | R$ 379,90 | R$ 315,00 | ~12% |

O pior caso assume que todo crédito é gasto na função de maior custo relativo e que o
cliente usa 100% do plano. Na prática, o uso médio de SaaS por créditos fica bem abaixo
disso. Com uso de ~55% e custo médio de ~R$ 0,030 por crédito, as margens ficam
significativamente maiores.

### 8.2 Cenário com 50 clientes (30 Essencial · 15 Pro · 5 Escritório)

| Item | Pior caso | Caso realista |
|---|---|---|
| Receita mensal | R$ 5.645 | R$ 5.645 |
| Custo de IA | R$ 3.735 | ~R$ 1.370 |
| Gateway (5%) | R$ 282 | R$ 282 |
| Infraestrutura | R$ 250 | R$ 250 |
| **Resultado antes de impostos** | **~R$ 1.380** | **~R$ 3.740** |

Receita de recargas e avulsos não está incluída.

### 8.3 Alavancas de margem

- Prévias em grade 2x2 numa única imagem.
- Cache por hash de entrada + parâmetros.
- Fila econômica (processamento em lote com desconto do provedor) como opção futura.
- Migração gradual para modelo de licença aberta em infraestrutura própria (FLUX.2 klein 4B,
  Apache 2.0) quando o volume justificar.
- Não cobrar falha reduz retrabalho e suporte, mas exige checagem de geometria eficiente.

---

## 9. Indicadores (acompanhar desde o beta)

| Indicador | Por quê |
|---|---|
| Custo real por crédito (R$) | Valida a fórmula de preço |
| Uso médio do plano (%) | Valida margens reais |
| Conversão teste → pago | Valida oferta e qualidade |
| Churn mensal | Saúde da base |
| Receita média por cliente (ARPU) | Planejamento |
| Taxa de falha e de reprovação de geometria | Qualidade e custo absorvido |
| Renders por cliente ativo por semana | Engajamento |
| Receita de recarga e avulsos | Validação do diferencial |

Metas numéricas serão definidas ao fim do beta, com dados reais.

---

## 10. Entrada no mercado

1. **Beta fechado** com 10–20 arquitetos (rede pessoal, professores, escritórios locais).
2. **Landing page** com os planos para medir intenção de compra antes do lançamento.
3. **Conteúdo antes/depois** em Instagram, YouTube e TikTok, mostrando o fluxo dentro do
   SketchUp (o diferencial é visual e demonstrável).
4. **Parcerias** com cursos de SketchUp e faculdades de arquitetura.
5. **Distribuição** pelo Extension Warehouse da SketchUp e pelo site próprio.

---

## 11. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Concorrente reduz preço | Alto | Diferencial de fluxo, não só preço; margem saudável na média |
| Provedor de IA muda preço ou descontinua modelo | Alto | Camada de adaptadores; modelo reserva; fórmula de créditos recalculável |
| Alta do dólar | Médio | Câmbio conservador na fórmula; regra de reajuste nos termos |
| IA deforma a geometria | Alto | Checagem automática de geometria e estorno |
| Licença de modelo incompatível com uso comercial | Alto | Lista de modelos permitidos; proibição de modelos `[dev]` em infraestrutura própria |
| LGPD e confidencialidade dos projetos | Alto | Retenção de 15 dias, URLs assinadas, sem treino, termos claros |
| Tempo de desenvolvimento (time pequeno) | Alto | MVP enxuto; funções extras como configuração; roadmap faseado |
| Abuso do teste grátis | Baixo | Verificação de e-mail e celular; 1 teste por conta |

---

## 12. Decisões em aberto

- Gateway de pagamento (Pix + recorrência + taxas).
- Regime tributário e CNPJ.
- Termos de uso, privacidade e regra de arrependimento (assessoria jurídica).
- Teste grátis: 1 render ou 3 renders diretos.
- Versão mínima do SketchUp suportada.
- Plano estudante (avaliar após o beta).
