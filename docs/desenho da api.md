# Desenho do Banco Local

## Escopo

Este documento descreve como poderia ficar o banco de dados local do projeto
Liora.

O projeto é de uso pessoal e local. Portanto, esta modelagem não considera:

- Usuários.
- Instituições.
- Empresas.
- Perfis de acesso.
- Autenticação.
- Multiusuário.

A ideia é que os dados pertençam sempre ao próprio aplicativo instalado ou
aberto pelo usuário. No MVP atual, a persistência é feita em `localStorage`.
Em uma evolução futura, o mesmo desenho pode migrar para IndexedDB, SQLite em
app mobile, Electron, Tauri ou outro formato local.

## Objetivo do Banco

O banco deve armazenar:

- Gastos cadastrados.
- Categorias de gastos.
- Preferências locais do aplicativo.
- Controle simples de versões/migrações locais.

Ele deve permitir:

- Montar o painel mensal.
- Listar histórico completo.
- Filtrar por mês, categoria e pesquisa.
- Calcular resumo por categoria.
- Calcular resumo por mês.
- Gerenciar categorias ativas e inativas.
- Exportar e importar registros futuramente.

## Visão Geral das Entidades

```txt
categorias 1 ──── N gastos

preferencias_app
migracoes_app
```

Relação principal:

- Uma categoria pode ter muitos gastos.
- Cada gasto pertence a uma categoria.
- Categoria usada em gastos não deve ser apagada fisicamente sem cuidado; o
  comportamento preferencial é inativar.

## Tabela: categorias

Armazena as categorias usadas para classificar os gastos.

Exemplos:

- Cartão de Crédito.
- Alimentação.
- Transporte.
- Corrida/Esportes.
- Lazer.
- Dízimo.
- Presentes.
- Itens.
- Outros.
- Estética.

Campos sugeridos:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| id | texto | sim | Identificador único local da categoria. |
| nome | texto | sim | Nome visível da categoria. |
| nome_normalizado | texto | sim | Nome sem acento e em minúsculas para evitar duplicidade. |
| cor | texto | sim | Cor usada na interface, em hexadecimal. |
| ativa | booleano | sim | Indica se a categoria aparece nos cadastros novos. |
| ordem | número | não | Ordem manual futura, caso seja necessária. |
| criada_em | data/hora | sim | Data de criação local. |
| atualizada_em | data/hora | não | Data da última alteração. |

Regras:

- `nome` não deve ficar vazio.
- `nome_normalizado` deve ser único.
- A categoria `Outros` pode ser tratada como categoria final da lista.
- Se uma categoria tiver gastos vinculados, a ação mais segura é inativar, não
  excluir.
- Se uma categoria não tiver gastos vinculados, ela pode ser excluída.

## Tabela: gastos

Armazena cada gasto registrado.

Campos sugeridos:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| id | texto | sim | Identificador único local do gasto. |
| data | data | sim | Data em que o gasto aconteceu. |
| categoria_id | texto | sim | Referência para `categorias.id`. |
| valor_centavos | inteiro | sim | Valor do gasto em centavos. |
| descricao | texto | não | Descrição opcional do gasto. |
| criado_em | data/hora | sim | Data de criação local. |
| atualizado_em | data/hora | não | Data da última alteração. |

Regras:

- `data`, `categoria_id` e `valor_centavos` são obrigatórios.
- `valor_centavos` deve ser maior que zero.
- Valores monetários devem ser salvos como inteiro em centavos, evitando erros
  de arredondamento com números decimais.
- `descricao` pode ser vazia.
- Ao excluir um gasto, ele pode ser removido fisicamente do banco local.

Exemplo:

```txt
id: gasto-abc123
data: 2026-06-24
categoria_id: categoria-2
valor_centavos: 8650
descricao: Mercado
criado_em: 2026-06-24T10:00:00.000Z
atualizado_em: 2026-06-24T10:00:00.000Z
```

## Tabela: preferencias_app

Armazena preferências simples do aplicativo local.

Campos sugeridos:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| chave | texto | sim | Nome da configuração. |
| valor_json | texto | sim | Valor serializado em JSON. |
| atualizada_em | data/hora | sim | Última alteração da preferência. |

Exemplos de uso:

- Mês selecionado no painel.
- Ordenação padrão do histórico.
- Tema visual, caso exista no futuro.
- Versão das categorias padrão já aplicada.
- Preferência de exportação/importação.

Essa tabela evita criar várias colunas soltas para configurações pequenas.

## Tabela: migracoes_app

Controla ajustes locais aplicados ao banco.

Campos sugeridos:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| versao | número | sim | Número sequencial da migração. |
| nome | texto | sim | Nome descritivo da migração. |
| aplicada_em | data/hora | sim | Data em que a migração foi aplicada. |

Exemplos:

- `1 - estrutura inicial`.
- `2 - adicionar categoria Estética`.
- `3 - normalizar nomes de categorias`.

Essa tabela é útil se o projeto sair do `localStorage` e passar para SQLite ou
IndexedDB.

## Índices Recomendados

Para manter o aplicativo rápido mesmo com muitos lançamentos:

```txt
categorias:
- indice único por nome_normalizado

gastos:
- indice por data
- indice por categoria_id
- indice composto por data + categoria_id
- indice opcional por descricao, caso a busca cresça muito
```

No SQLite, uma busca mais avançada por descrição poderia usar FTS no futuro.
Para o MVP, busca simples por texto já é suficiente.

## Consultas Principais

### Painel mensal

Entrada:

- `mes_ano`, por exemplo `2026-06`.

Consulta lógica:

- Buscar gastos onde `data` pertence ao mês selecionado.
- Somar `valor_centavos`.
- Contar lançamentos.
- Agrupar por categoria.
- Identificar a categoria com maior total.
- Buscar gastos recentes do mês.

Resultado esperado:

```txt
total_mes
quantidade_gastos
maior_categoria
gastos_recentes
resumo_por_categoria
```

### Histórico por mês

Consulta lógica:

- Agrupar gastos por `YYYY-MM`.
- Considerar apenas meses anteriores ao mês atual.
- Somar valores.
- Contar lançamentos.
- Identificar maior categoria de cada mês.

Resultado esperado:

```txt
mes
total
quantidade
maior_categoria
```

### Histórico de gastos

Filtros:

- Texto de pesquisa.
- Categoria.
- Mês/ano.
- Ordenação por data, categoria, descrição ou valor.

Consulta lógica:

- Buscar gastos.
- Juntar com categoria.
- Aplicar filtros.
- Ordenar conforme escolha da interface.

Campos exibidos:

```txt
data
categoria
descricao
valor
acoes
```

### Pesquisa

A pesquisa deve considerar:

- Descrição do gasto.
- Nome da categoria.
- Valor formatado.

Em banco local simples, isso pode ser feito carregando os registros e filtrando
em memória. Se o volume crescer muito, a busca pode migrar para índice textual.

## Fluxo de Cadastro

1. Usuário preenche data, categoria e valor.
2. Sistema valida campos obrigatórios.
3. Valor é convertido para centavos.
4. Registro é salvo em `gastos`.
5. Painel e histórico são recalculados.

## Fluxo de Edição

1. Usuário seleciona um gasto.
2. Formulário recebe os dados atuais.
3. Usuário altera campos.
4. Sistema valida novamente.
5. Registro é atualizado em `gastos`.
6. Campo `atualizado_em` recebe nova data/hora.

## Fluxo de Exclusão

1. Usuário solicita exclusão.
2. Sistema mostra confirmação.
3. Após confirmação, o gasto é removido.
4. Painel, histórico e resumos são recalculados.

## Categorias Ativas e Inativas

Categorias ativas:

- Aparecem no cadastro de novos gastos.
- Aparecem nos filtros.
- Continuam aparecendo nos gastos antigos.

Categorias inativas:

- Não devem aparecer como opção principal para novos gastos.
- Devem continuar aparecendo em registros antigos.
- Podem continuar aparecendo em filtros, se existirem gastos vinculados.

## Exportação e Importação

Mesmo com banco local, é importante manter exportação/importação.

Formato sugerido:

```json
{
  "type": "controle-gastos-registros",
  "version": 1,
  "exportedAt": "2026-06-24T10:00:00.000Z",
  "categories": [],
  "expenses": []
}
```

Regras de importação:

- Validar estrutura do arquivo.
- Ignorar gastos inválidos.
- Evitar duplicidade por combinação de data, categoria, valor e descrição.
- Preservar categorias existentes.
- Criar categorias ausentes apenas se essa decisão for desejada no futuro.

## Migração do localStorage para Banco Local

O MVP atual usa `localStorage`.

Mapeamento atual provável:

```txt
controle-gastos:categories -> categorias
controle-gastos:expenses -> gastos
controle-gastos:category-defaults-version -> preferencias_app ou migracoes_app
```

Processo futuro:

1. Ler dados atuais do `localStorage`.
2. Criar banco local.
3. Inserir categorias.
4. Inserir gastos.
5. Registrar migração aplicada.
6. Manter exportação como plano de segurança.

## Possível Implementação Local Futura

Opções:

- IndexedDB para continuar como aplicação web/PWA.
- SQLite se virar app mobile.
- SQLite se virar app desktop com Electron ou Tauri.

Escolha recomendada:

- Enquanto for web puro: IndexedDB.
- Se virar mobile ou desktop: SQLite.

O desenho das tabelas acima funciona bem nos dois caminhos.

## Fora do Escopo

Não faz parte deste desenho:

- Cadastro de usuários.
- Login.
- Permissões.
- Instituições.
- Sincronização em nuvem.
- API pública.
- Compartilhamento entre dispositivos.
- Multiusuário.

Esses pontos só fariam sentido se o projeto deixasse de ser local e pessoal.
