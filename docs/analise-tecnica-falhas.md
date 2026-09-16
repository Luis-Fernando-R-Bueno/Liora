# Análise Técnica - Falhas Identificadas no Código

## Contexto

Este documento registra uma revisão de código do Liora feita sob a ótica de
integridade de dados financeiros: o ponto de vista é que este é um sistema de
controle de gastos pessoais, e qualquer erro silencioso de cálculo, parsing ou
persistência tem custo direto para o usuário (valores errados no painel,
saldo de salário incorreto, dados perdidos).

A revisão cobriu o hook central (`src/hooks/useControleGastos.ts`), a camada
de persistência (`src/servicos/storageService.ts`), os utilitários de moeda e
data (`src/utils/formatCurrency.ts`, `src/utils/dateUtils.ts`), e as telas que
manipulam valores monetários (`Gastos`, `Configurações > Salário`,
`Configurações > Categorias`).

Não foram encontradas falhas de segurança relevantes (o app é 100% local, sem
rede, sem autenticação, conforme o próprio escopo do projeto). Os achados
abaixo são de **correção de cálculo, integridade de dados e robustez**.

## Status das correções

| Item | Status | Observação |
| --- | --- | --- |
| 1.1 - Bug do campo Salário | Corrigido | Novo parser dedicado (`parseLocalizedCurrencyInput`) para entradas com separador de milhar. |
| 1.2 - Ponto flutuante nas somas | Corrigido | Somas passaram a ser feitas em centavos inteiros (`toCents`/`fromCents`), sem migrar o formato de armazenamento. |
| 3.1 - `updateCategory` sem checagem de duplicidade | Corrigido | Passou a usar a mesma validação de nome único do `addCategory`. |
| 3.2 - Média mensal incluindo mês corrente/futuro | Corrigido | Passou a considerar apenas meses encerrados (`id < getCurrentMonthKey()`). |
| 3.3 - Validação de gasto só existia no HTML | Corrigido | `addExpense`/`updateExpense` agora validam no hook e retornam sucesso/erro para a UI. |
| 2.1 - Importação inacessível pela UI | Corrigido | `ExpenseDataActions` (exportar/importar) voltou a ser renderizado na tela `Gastos`. |
| 2.2 - IDs de categoria não portáveis | Corrigido | Exportação passou a incluir `categories`; importação resolve por nome e cria categorias ausentes no destino. |
| 2.3 - `localStorage` sem tratamento de erro / sem Error Boundary | Corrigido | `writeStorage` captura exceções; hook expõe `storageError` (mostrado em banner); adicionado `ErrorBoundary` global em `main.tsx`. |
| 4.1, 4.2, 4.3 (dívida técnica) | Em aberto | — |

## Resumo executivo

| Severidade | Quantidade | Resumo |
| --- | --- | --- |
| Crítico | 2 | Corrompem valores monetários silenciosamente, sem qualquer aviso ao usuário. |
| Alto | 3 | Comprometem o backup/restauração dos dados e a confiabilidade da persistência. |
| Médio | 3 | Regras de negócio inconsistentes ou métricas do painel com base de cálculo errada. |
| Baixo / observação | 3 | Dívida técnica que facilita a introdução de novos bugs. |

---

## 1. Falhas críticas (corrompem valores monetários)

### 1.1 Campo "Salário mensal" trunca valores por mil quando o usuário não digita centavos

**Onde:** `src/telas/configuracoes/salario/index.tsx:20-35` (`formatSalaryTyping`) e
`src/utils/formatCurrency.ts:8-19` (`parseCurrencyInput`).

**Cenário de falha (reproduzível):**

1. Usuário abre `Configurações > Salário`, clica em editar e digita `3500`
   (sem vírgula), pretendendo registrar R$ 3.500,00.
2. `formatSalaryTyping` formata a digitação em tempo real e, como o valor tem
   4 dígitos, insere automaticamente o separador de milhar: o campo passa a
   exibir `3.500`.
3. Usuário clica em "Salvar salário" sem ter digitado a vírgula dos centavos.
4. `handleSaveSalary` chama `parseCurrencyInput('3.500')`. Como a string não
   contém vírgula, a função **não remove o ponto** (ele só é tratado como
   separador de milhar quando há vírgula na string) e faz `Number('3.500')`,
   que resulta em `3.5`.
5. O salário salvo é **R$ 3,50**, não R$ 3.500,00 — uma perda de 1000x no
   valor, sem qualquer mensagem de erro (a validação em
   `Number.isFinite(nextSalary) && nextSalary >= 0` passa normalmente, pois
   `3.5` é um número válido).

Esse valor incorreto alimenta diretamente o card "Sobra do salário" no painel
(`dashboardWithSalary.salaryRemaining` em `src/telas/inicial/index.tsx:90-97`),
que passa a mostrar um saldo negativo absurdo todo mês.

Ironicamente, o próprio placeholder do campo (`"Ex.: 3.500,00"`, linha 117)
é um exemplo de entrada que só funciona corretamente se o usuário replicar
exatamente o formato completo, incluindo os centavos.

**Causa raiz:** `parseCurrencyInput` decide se um `.` é separador decimal ou
de milhar unicamente com base na presença de vírgula na string — mas
`formatSalaryTyping` pode produzir um `.` de milhar sem nunca inserir
vírgula.

**Recomendação:** unificar as duas funções. `parseCurrencyInput` deveria
saber interpretar exatamente o mesmo formato que `formatSalaryTyping`
produz (ou o parsing deveria ser feito a partir dos dígitos brutos mantidos
em estado, nunca a partir da string já formatada com pontos). Também vale
adicionar um teste automatizado cobrindo `parseCurrencyInput('3.500')`.

### 1.2 Valores monetários armazenados como ponto flutuante, não como inteiro em centavos

**Onde:** `src/hooks/useControleGastos.ts:29` (`value: number`),
`src/servicos/storageService.ts:124` (`value: Number(expense.value) || 0`).

O próprio [desenho da api.md](desenho%20da%20api.md) (seção "Tabela: gastos")
especifica `valor_centavos` como inteiro exatamente para "evitar erros de
arredondamento com números decimais" — mas a implementação atual nunca
adotou essa regra e guarda `value` como `number` (ponto flutuante) direto em
reais.

**Cenário de falha:** somas repetidas de valores decimais no JavaScript
sofrem de imprecisão de ponto flutuante (`0.1 + 0.2 === 0.30000000000000004`).
Em `aggregateByCategory` e `aggregateByMonth`
(`src/hooks/useControleGastos.ts:113-168`), o total de um mês é a soma
(`reduce`) de dezenas de lançamentos com centavos; com volume de uso real,
é uma questão de tempo até um total exibido no painel divergir em 1 centavo
da soma manual dos lançamentos — um problema clássico e conhecido em
software financeiro, e a razão exata pela qual o próprio documento de
modelagem do projeto já recomendava o formato em centavos.

**Recomendação:** migrar `value` para inteiro em centavos na camada de
armazenamento e cálculo, convertendo para reais apenas na borda de
apresentação (`formatCurrency`) e de entrada (`parseCurrencyInput`), como já
estava desenhado em `docs/desenho da api.md`.

---

## 2. Falhas de alta severidade (backup e persistência)

### 2.1 Importação de registros é código morto — não há como restaurar um backup pela interface

**Onde:** `src/hooks/useControleGastos.ts:339-375` define e expõe
`importRecords`, mas nenhuma tela do app chama essa função (confirmado por
busca em todo `src/`: `importRecords` só aparece na própria definição e na
lista de retorno do hook).

A tela de importação/exportação (`src/telas/importar`) e depois a aba
`Configurações > Backup` foram removidas do projeto ao longo do changelog em
[projeto.md](projeto.md) ("Remoção de Suporte, Saiba Mais e Backup -
31/07/2026"). A exportação continua acessível
(`src/componentes/gastos/expenseDataActions/index.tsx`), mas a importação
não tem mais nenhum ponto de entrada na UI.

**Impacto:** o usuário consegue gerar um arquivo `.json` de backup, mas não
tem como restaurá-lo dentro do próprio app. Isso invalida a premissa de
"plano de segurança" descrita em `docs/desenho da api.md` ("Exportação e
Importação"), já que um backup que não pode ser restaurado não cumpre sua
função.

**Recomendação:** reexpor a importação em algum lugar da UI (por exemplo, em
`Configurações`) ou, se a decisão de remover foi intencional, remover também
`importRecords` e a lógica associada (`extractImportRecords`,
`normalizeImportedExpense`, `getExpenseDuplicateKey`) para não deixar lógica
sem dono nem testes.

### 2.2 IDs de categoria não são portáveis entre instalações, quebrando a restauração entre dispositivos

**Onde:** `src/servicos/storageService.ts:12-29` (categorias padrão recebem
IDs determinísticos `categoria-1..10`) vs. `src/hooks/useControleGastos.ts:53-56`
(`createId`, categorias novas recebem `crypto.randomUUID()`).

Um gasto exportado referencia `categoryId` (`src/hooks/useControleGastos.ts:65-72`
e `90-111`). Isso funciona apenas enquanto os dois dispositivos têm as
mesmas categorias padrão, nas mesmas posições. No momento em que o usuário
cria, renomeia ou reordena categorias — o uso normal esperado do app — os
IDs deixam de coincidir entre a instalação de origem e a de destino.

**Cenário de falha:** usuário exporta os gastos do celular, formata o
navegador do computador (ou reinstala o app), e importa o arquivo lá. Como
as categorias customizadas do computador têm IDs diferentes das do celular,
todos os gastos importados caem no fallback `"Sem categoria"`
(`src/hooks/useControleGastos.ts:242-247`) — que sequer é uma categoria real
da lista, apenas um objeto criado em memória a cada renderização. O usuário
perde silenciosamente a categorização de todo o histórico restaurado.

**Recomendação:** exportar/importar por **nome normalizado** da categoria
(criando a categoria no destino se não existir), não por ID interno; ou
gerar `categoryId` de forma determinística a partir do nome normalizado.

### 2.3 Escrita no `localStorage` sem tratamento de erro, sem Error Boundary no app

**Onde:** `src/servicos/storageService.ts:40-42` (`writeStorage`, sem
try/catch) é chamado a cada mudança de estado via `useEffect`
(`src/hooks/useControleGastos.ts:224-230`). Não existe nenhum
`ErrorBoundary`/`componentDidCatch` em todo o projeto (busca em `src/`
não encontrou nenhum).

`readStorage` (linhas 31-38) trata exceções, mas `writeStorage` não. Se o
`localStorage` estiver cheio (comum em modo privado do Safari/iOS, ou após
anos de uso do PWA) ou indisponível, `localStorage.setItem` lança uma
exceção. Como isso acontece dentro de um `useEffect` sem try/catch e não há
Error Boundary, o React derruba a árvore de componentes e o usuário vê uma
tela em branco, sem nenhuma mensagem — e sem garantia de que o gasto que
acabou de cadastrar foi de fato salvo.

**Recomendação:** envolver `writeStorage` em try/catch com um retorno de
sucesso/falha que a UI possa mostrar ("não foi possível salvar, espaço
insuficiente"), e adicionar um Error Boundary de nível superior como rede de
segurança.

---

## 3. Falhas de média severidade (regras de negócio e métricas)

### 3.1 `updateCategory` não valida nome duplicado (mas `addCategory` valida)

**Onde:** compare `addCategory` (`src/hooks/useControleGastos.ts:377-404`,
que checa duplicidade nas linhas 384-390) com `updateCategory`
(linhas 406-422), que apenas troca o nome sem nenhuma checagem equivalente.

**Cenário de falha:** usuário renomeia a categoria "Lazer" para
"Alimentação" (já existente). O app aceita, e passam a existir duas
categorias chamadas "Alimentação" com IDs diferentes. Como a cor é
determinística por nome (`getCategoryColor`,
`src/utils/categoryColors.ts:47-61`), as duas ficam visualmente idênticas
nos filtros e nos selects, tornando impossível diferenciar qual é qual. Isso
viola diretamente a regra descrita em `docs/desenho da api.md`
("`nome_normalizado` deve ser único").

**Recomendação:** aplicar em `updateCategory` a mesma checagem de
duplicidade (ignorando a própria categoria sendo editada) já usada em
`addCategory`.

### 3.2 "Média mensal" do painel inclui o mês corrente (ainda incompleto) e meses futuros

**Onde:** `dashboard.averageMonthlyTotal`
(`src/hooks/useControleGastos.ts:264-269`) usa `aggregateByMonth(expensesWithCategory)`
(linhas 141-168), que **não** filtra por mês passado — ao contrário de
`aggregateHistoricalMonths` (linhas 170-218), que explicitamente exclui o
mês atual e futuros na linha 175 (`monthKey >= currentMonthKey`).

**Impacto:** a métrica "Média mensal" (card do painel,
`src/componentes/dashboard/dashboardCards/index.tsx:34-41`) mistura meses
totalmente fechados com o mês em andamento (que naturalmente tem menos
gastos acumulados por estar incompleto) e com qualquer gasto lançado com
data futura. Isso distorce a média para baixo no início do mês e pode ser
inflado por lançamentos futuros (ex.: uma assinatura já cadastrada para o
mês seguinte passa a contar como "mais um mês" na divisão).

**Recomendação:** calcular a média apenas sobre meses fechados (reaproveitar
`aggregateHistoricalMonths`), ou deixar explícito na UI que a média inclui o
mês corrente.

### 3.3 Nenhuma validação de negócio no hook — toda a validação vive no HTML do formulário

**Onde:** `addExpense` e `updateExpense`
(`src/hooks/useControleGastos.ts:290-320`) usam diretamente
`parseCurrencyInput(expenseData.value)` e `expenseData.description.trim()`
sem checar o resultado.

- `parseCurrencyInput('')` retorna `0`; `parseCurrencyInput('abc')` retorna
  `NaN`. Nenhum dos dois é rejeitado pelo hook — a única barreira é o
  atributo HTML `required min="0.01"` do `<input>` em
  `src/componentes/gastos/expenseForm/index.tsx:121-129`, que não protege
  contra chamadas futuras ao hook fora desse formulário (outra tela, um
  script de importação, um teste).
- Um `value` igual a `NaN` se propaga silenciosamente por todas as somas
  (`reduce`) do painel: `NaN + x === NaN`. Um único gasto corrompido faria o
  total do mês inteiro virar `NaN`, e `formatCurrency(NaN)` ainda assim
  renderiza algo (`Intl.NumberFormat` trata `NaN` como `0` implicitamente via
  `Number(value) || 0` em `formatCurrency`, então o sintoma seria um total
  subitamente zerado sem explicação, mascarando o erro real).

**Recomendação:** validar `value > 0 && Number.isFinite(value)` e
`date`/`categoryId` não vazios dentro do próprio hook, retornando
sucesso/erro para a UI — hoje a "regra de negócio" de gasto válido só existe
na tela, não nos dados.

---

## 4. Observações de dívida técnica (baixa severidade, facilitam bugs futuros)

### 4.1 Migração para TypeScript não cobre a camada mais crítica do app

`tsconfig.json:11` define `"strict": false`, e as funções centrais do hook
(`addExpense`, `updateExpense`, `addCategory`, `updateCategory`,
`filterExpenses`, etc., em `src/hooks/useControleGastos.ts`) não anotam tipo
nos parâmetros (`expenseData`, `expenseId`, `categoryId`, `categoryName`),
o que os torna implicitamente `any`. O changelog em
[projeto.md](projeto.md#L1489) registra a migração para TypeScript como
concluída ("Nenhuma regra de negócio, persistência ou fluxo visual foi
alterado"), mas justamente por não alterar regra de negócio, o arquivo mais
sensível do projeto — o que soma dinheiro — ficou sem o benefício real de
checagem de tipos que motivou a migração.

**Recomendação:** tipar explicitamente os parâmetros do hook (já existem os
tipos `Category`/`Expense` no topo do arquivo, faltando aplicá-los às
assinaturas de função) e considerar `"strict": true` incrementalmente.

### 4.2 Percentuais de resumo são arredondados individualmente e podem não somar 100%

**Onde:** `src/hooks/useControleGastos.ts:136` e `:165`
(`Math.round((item.total / total) * 100)`).

Cada categoria/mês tem seu percentual arredondado de forma independente, o
que é uma prática comum, mas em uma tela de "Resumo por categoria" que
sugere proporção exata, a soma visível dos percentuais pode ficar em 99% ou
101% quando há muitas categorias com valores próximos. Não é incorreto por
si só, mas vale documentar a decisão (ou usar arredondamento tipo "maior
resto" se a exatidão da soma for importante para o usuário).

### 4.3 Objeto de categoria "Sem categoria" é recriado a cada renderização

**Onde:** `src/hooks/useControleGastos.ts:242-247`, dentro do `useMemo` de
`expensesWithCategory`.

Quando um gasto referencia um `categoryId` que não existe mais (categoria
excluída via `removeCategory` quando não tinha uso, ou um `categoryId`
órfão de importação — ver item 2.2), o fallback cria um novo objeto
`{ id: 'sem-categoria', ... }` a cada execução do `useMemo`. Funcionalmente
não quebra nada hoje, mas é um objeto sem identidade estável que não existe
na lista real de `categories` — não pode ser reativado, editado ou
selecionado no formulário de edição do gasto (o `<select>` de categorias só
lista categorias reais, ver `src/componentes/gastos/expenseForm/index.tsx:45-53`),
então um gasto que cai nesse estado fica "preso": o usuário só consegue
tirá-lo de lá escolhendo manualmente uma categoria real ao editar.

---

## Priorização sugerida

1. **1.1** (bug do salário) — correção imediata, é o único item que já
   corrompe dados reais no fluxo normal de uso sem nenhuma condição
   especial.
2. **2.1** (importação inacessível) — decidir entre reexpor a função ou
   remover o código morto.
3. **3.3** e **1.2** — validação de entrada e migração para centavos andam
   juntas e são a base para os demais cálculos serem confiáveis.
4. **2.2**, **2.3**, **3.1**, **3.2** — importantes, mas dependem menos de
   uso diário imediato.
5. **4.x** — dívida técnica, atacar oportunisticamente durante outras
   mudanças na mesma área.
