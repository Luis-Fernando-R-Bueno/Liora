# Controle de Gastos Pessoais

## Ideia do Projeto

Criar um sistema web de controle de gastos pessoais para substituir uma planilha
de Excel. A proposta é permitir que o usuário registre seus gastos de forma
simples, sem precisar preencher manualmente uma tabela por mês e categoria.

O sistema deve ter uma interface limpa, profissional e responsiva, com foco em
praticidade para uso diário. A primeira versão será um MVP funcional, sem
back-end, autenticação ou banco de dados.

## Objetivo do MVP

Entregar um sistema web funcional onde o usuário consiga:

- Cadastrar gastos pessoais.
- Gerenciar categorias.
- Pesquisar lançamentos.
- Visualizar o histórico completo.
- Acompanhar um painel mensal atualizado automaticamente.
- Persistir os dados localmente no navegador usando `localStorage`.

O objetivo visual é parecer um pequeno sistema financeiro pessoal, e não apenas
uma planilha digital.

## Tecnologias Desejadas

- React + Vite no front-end.
- CSS modular ou CSS organizado por componentes.
- `localStorage` para persistência inicial.
- Sem back-end na primeira versão.
- Sem banco de dados na primeira versão.
- Sem autenticação na primeira versão.

## Funcionalidades Principais

### Painel Mensal

A tela inicial deve apresentar um resumo financeiro do mês atual.

Deve exibir:

- Total gasto no mês.
- Quantidade de gastos cadastrados.
- Categoria com maior gasto.
- Lista dos gastos mais recentes.
- Resumo de gastos por categoria.
- Resumo de gastos por mês.

O painel deve ser atualizado automaticamente conforme novos gastos forem
cadastrados, editados ou excluídos.

### Cadastro de Gastos

O sistema deve ter uma área ou modal para cadastrar um novo gasto.

Campos obrigatórios:

- Data.
- Categoria.
- Valor.

Campo opcional:

- Descrição.

Ao cadastrar um gasto, ele deve ser salvo no `localStorage` e aparecer
automaticamente no histórico e no painel.

### Histórico de Gastos

Criar uma tela ou seção com todos os gastos cadastrados.

Cada gasto deve exibir:

- Data.
- Categoria.
- Valor.
- Descrição, se houver.

O usuário deve poder:

- Editar um gasto.
- Excluir um gasto.
- Pesquisar gastos por descrição.
- Filtrar por categoria.
- Filtrar por mês e ano.

### Gerenciamento de Categorias

Criar uma área para gerenciar categorias de gastos.

O sistema deve permitir:

- Criar nova categoria.
- Editar categoria existente.
- Excluir ou inativar categoria.

Categorias iniciais sugeridas:

- Cartão de Crédito.
- Alimentação.
- Transporte.
- Corrida/Esportes.
- Lazer.
- Dízimo.
- Presentes.
- Itens.
- Outros.

As categorias devem ser salvas no `localStorage`.

### Barra de Pesquisa

Criar uma barra de pesquisa simples para localizar gastos pelo texto da
descrição, categoria ou valor.

A pesquisa deve funcionar de forma dinâmica, atualizando a lista de gastos
conforme o usuário digita.

## Design e Experiência

A interface deve ter aparência profissional, moderna e simples.

Preferências visuais:

- Cores sóbrias.
- Boa hierarquia visual.
- Cards para resumos.
- Tabelas ou listas bem organizadas.
- Botões claros para cadastrar, editar e excluir.
- Layout responsivo para computador e celular.

## Estrutura Sugerida do Projeto

Organizar o projeto em componentes, telas, serviços e utilitários.

Exemplo de estrutura:

```txt
src/
  componentes/
    compartilhado/
      header/
      searchBar/
    painel/
      painelCards/
      resumoCategorias/
      resumoMensal/
    gastos/
      expenseForm/
      expenseList/
    categorias/
      categoryManager/
  telas/
    painel/
    gastos/
    categorias/
  servicos/
    storageService.js
  utils/
    formatCurrency.js
    dateUtils.js
```

Observação: a estrutura real deve seguir o padrão adotado no projeto, mantendo
telas finas, hooks para regras de estado e componentes visuais em pastas
próprias.

## Regras Importantes

- Usar `localStorage` para persistência dos dados.
- Não usar banco de dados ainda.
- Não usar autenticação nesta versão.
- Manter o código limpo.
- Comentar apenas quando necessário.
- Separar bem componentes, funções utilitárias e estilos.
- Evitar concentrar toda a aplicação em um único arquivo.
- Criar uma base fácil de evoluir depois para back-end com Node.js, Express e
  MySQL ou PostgreSQL.

## Direção de Evolução

A primeira versão deve resolver o uso pessoal diário com armazenamento local.
Depois, o projeto pode evoluir para:

- Sincronização com back-end.
- Autenticação de usuários.
- API com Node.js e Express.
- Banco de dados MySQL ou PostgreSQL.
- Relatórios exportáveis.
- Painel com gráficos mais completos.

## Status da Implementação - 22/06/2026

MVP inicial implementado em React + Vite, substituindo a tela padrão do Vite por
um sistema de controle de gastos pessoais.

Entregas realizadas:

- Painel mensal com total do mês, quantidade de lançamentos, maior categoria,
  média por gasto, gastos recentes, resumo por categoria e resumo por mês.
- Cadastro, edição e exclusão de gastos com persistência em `localStorage`.
- Histórico completo com pesquisa dinâmica por descrição, categoria ou valor.
- Filtros por categoria e por mês/ano.
- Gerenciamento de categorias com criação, edição, ativação, inativação e
  remoção quando a categoria não possui gastos vinculados.
- Categorias iniciais configuradas conforme a proposta do MVP.
- Estrutura organizada em `componentes`, `telas`, `hooks`, `servicos` e `utils`.
- Estilos responsivos e interface com aparência de sistema financeiro pessoal.
- Pacote `lucide-react` instalado para ícones da interface.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Tela de Histórico Mensal - 23/06/2026

Alterações realizadas:

- Criada a aba `Histórico` no menu principal.
- A nova tela lista apenas meses anteriores ao mês atual que possuem gastos
  cadastrados.
- Cada mês exibe total gasto, quantidade de lançamentos e maior categoria.
- Adicionado botão `Ver no painel` para abrir o mês selecionado diretamente no
  painel mensal.
- Consolidação dos meses anteriores adicionada ao hook principal
  `useControleGastos`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Mês de Simulação no Histórico - 23/06/2026

Alterações realizadas:

- Adicionado botão `Criar mês de simulação` na tela `Histórico`.
- O sistema cria lançamentos fictícios em um mês anterior sem registros para
  permitir avaliar o estilo visual da tela.
- Cada novo clique cria a simulação em outro mês anterior livre, permitindo ver
  mais de um card lado a lado no histórico.
- Após criar ou localizar a simulação, o sistema abre automaticamente o período
  no painel mensal.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Limpeza das Simulações - 23/06/2026

Alterações realizadas:

- Botão `Criar mês de simulação` removido da tela `Histórico`.
- Função de criação de meses simulados removida do hook principal.
- Registros fictícios com descrição iniciada por `Simulação -` deixam de ser
  carregados do `localStorage`.
- O salvamento automático passa a regravar os gastos sem esses registros
  simulados após a aplicação carregar.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Correção do Cabeçalho do Histórico - 23/06/2026

Alterações realizadas:

- Cabeçalho da tela `Histórico` corrigido para empilhar rótulo, título e texto
  na vertical após a remoção do botão de simulação.
- Removidas regras CSS antigas relacionadas ao botão que não existe mais.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Estado Vazio do Histórico - 23/06/2026

Alterações realizadas:

- Reduzida a altura do estado vazio da lista de meses anteriores.
- Ícone e mensagem agora ficam agrupados no centro, com menor distância entre
  eles.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Correção de Largura da Tela de Gastos - 23/06/2026

Alterações realizadas:

- Reduzidas as larguras mínimas dos filtros da tela `Gastos`.
- Reduzida a largura mínima da tabela de gastos para evitar quebra da coluna ao
  lado do formulário.
- Layout de duas colunas no desktop preservado.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Corpo do Histórico - 23/06/2026

Alterações realizadas:

- Altura do estado vazio do corpo da tela `Histórico` igualada ao padrão usado
  nos demais estados vazios do sistema.
- Distância entre ícone e mensagem permanece reduzida.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste da Média Mensal do Painel - 24/06/2026

Alterações realizadas:

- Card de média do painel deixou de calcular média por lançamento do mês.
- Novo cálculo soma os totais de todos os meses com gastos e divide pela
  quantidade desses meses.
- Texto do card alterado para `Média mensal`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste da Seta de Voltar - 22/06/2026

Alterações realizadas:

- Seta de voltar da tela de importação reposicionada para o canto superior
  esquerdo do corpo do site.
- Painel de importação mantido centralizado após a mudança de posicionamento da
  seta.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste da Tela de Importação e Exportação - 22/06/2026

Alterações realizadas:

- Botão de voltar da tela de importação/exportação movido para o corpo da página,
  acima do painel principal.
- Botão de exportação removido da tela `Gastos`.
- Exportação permanece disponível na tela de importação/exportação.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste da Tela de Importação - 22/06/2026

Alterações realizadas:

- Tela de importação recebeu também o botão `Exportar registros`.
- Atalho flutuante de importação alterado para ícone cinza discreto no canto
  inferior direito, sem fundo azul.
- Botão de voltar da tela de importação virou botão de ícone fixado no canto
  superior esquerdo.
- Lógica de download dos registros centralizada em utilitário compartilhado.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Tela de Importação e Atalho Flutuante - 22/06/2026

Alterações realizadas:

- Criada a tela `src/telas/importar` para concentrar a importação de registros.
- Adicionado botão flutuante apenas com ícone no canto inferior direito para
  abrir a tela de importação.
- Botão textual de importação removido da tela `Gastos`.
- Tela `Gastos` mantém apenas a exportação de registros.
- A regra de ignorar registros 100% idênticos aos já cadastrados permanece na
  importação.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Painel e Importação/Exportação de Registros - 22/06/2026

Alterações realizadas:

- Texto visível do menu alterado para `Painel`.
- Botões `Exportar registros` e `Importar registros` adicionados na tela
  `Gastos`.
- Exportação gera arquivo `.json` com os registros cadastrados.
- Importação aceita arquivo `.json` e ignora registros que já existam no sistema
  com os mesmos campos de data, categoria, valor e descrição.
- Importação informa quantos registros foram importados, ignorados como
  duplicados ou considerados inválidos.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ordenação dos Selects de Categoria - 22/06/2026

Alterações realizadas:

- Select de categoria do cadastro passa a exibir opções em ordem alfabética.
- Select de categoria dos filtros também segue a mesma ordenação.
- Categoria `Outros` permanece sempre como última opção.
- `Cartão de Crédito` segue como seleção padrão do cadastro quando está ativa,
  mas aparece na posição alfabética dentro da lista.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ordenação da Lista de Categorias - 22/06/2026

Alterações realizadas:

- Lista de categorias exibida em ordem alfabética.
- Categoria `Outros` permanece sempre como última opção da lista.
- Ordenação aplicada apenas na exibição, sem alterar a estrutura salva no
  `localStorage`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Nova Categoria Padrão - 22/06/2026

Alterações realizadas:

- Adicionada a categoria padrão `Estética`.
- Criada migração local para adicionar `Estética` também em navegadores que já
  possuem categorias salvas no `localStorage`.
- A migração é versionada para não recriar a categoria caso o usuário remova
  depois.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Modais de Confirmação do Sistema - 22/06/2026

Alterações realizadas:

- Confirmações nativas do navegador removidas das ações de exclusão.
- Criado modal visual próprio do sistema para confirmar exclusão de gastos.
- Criado modal visual próprio do sistema para confirmar exclusão ou inativação
  de categorias.
- Nenhum `window.confirm` permanece no código da aplicação.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste de Espaçamento do Seletor do Painel - 22/06/2026

Alterações realizadas:

- Espaçamento vertical do seletor de mês do painel ajustado para equilibrar
  a distância superior e inferior antes dos cards.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Remoção do Rótulo do Seletor do Painel - 22/06/2026

Alterações realizadas:

- Removido o rótulo `Mês` acima do seletor de mês do painel.
- Seletor permanece centralizado e destacado.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Destaque do Seletor de Mês no Painel - 22/06/2026

Alterações realizadas:

- Seletor de mês do painel centralizado.
- Campo recebeu mais destaque visual com tamanho maior, borda azul e sombra.
- Ajuste aplicado apenas no painel, sem alterar o seletor de mês da tela de
  gastos.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Seletor de Mês no Painel - 22/06/2026

Alterações realizadas:

- Adicionado seletor de mês no painel.
- Cards mensais, maior categoria, gastos recentes e resumo por categoria passam
  a considerar o mês selecionado.
- `Gastos recentes` continua ignorando lançamentos com data futura, mesmo quando
  o mês selecionado possui gastos cadastrados para dias posteriores ao atual.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Correção de Gastos Recentes - 22/06/2026

Alterações realizadas:

- Gastos com data superior ao dia atual não aparecem mais em `Gastos recentes`.
- Gastos futuros continuam salvos e visíveis no histórico, apenas deixam de
  compor a lista de registros recentes do painel.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Remoção do Cabeçalho da Lista de Gastos - 22/06/2026

Alterações realizadas:

- Removida a faixa com `Histórico completo`, `Gastos cadastrados` e contador.
- A lista de gastos agora inicia diretamente pelos cabeçalhos ordenáveis.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Remoção dos Ícones de Ordenação - 22/06/2026

Alterações realizadas:

- Removida também a seta da coluna ativa da tabela de gastos.
- A coluna que ordena a lista agora é indicada apenas pelo texto em azul.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste Visual da Ordenação - 22/06/2026

Alterações realizadas:

- Ícones removidos das colunas que não estão ordenando a lista.
- Coluna ativa passa a ficar em azul.
- Seta mantida apenas na coluna ativa para indicar a direção da ordenação.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ordenação do Histórico de Gastos - 22/06/2026

Alterações realizadas:

- Cabeçalhos `Data`, `Categoria`, `Descrição` e `Valor` transformados em botões
  de ordenação.
- Clique em uma coluna ordena a lista; novo clique na mesma coluna inverte a
  direção.
- Adicionado indicador visual de ordenação nos cabeçalhos da tabela.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Botão de Cadastro - 22/06/2026

Alterações realizadas:

- Botão `Cadastrar gasto` ajustado para ocupar a largura disponível do formulário,
  seguindo o padrão visual do botão `Adicionar` na tela de categorias.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste de Colunas Entre Telas - 22/06/2026

Verificação realizada:

- As telas `Gastos` e `Categorias` usam a mesma regra de colunas no desktop:
  `minmax(300px, 420px) minmax(0, 1fr)`.
- O breakpoint responsivo foi igualado para `1020px` nas duas telas, garantindo
  que ambas mudem para uma coluna no mesmo tamanho de viewport.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Cabeçalho do Formulário - 22/06/2026

Alterações realizadas:

- Removido o rótulo `Cadastro` acima do título `Novo gasto`.
- Formulário mantém apenas o título principal no cabeçalho.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Cabeçalho de Categorias - 22/06/2026

Alterações realizadas:

- Removido o texto acima do título `Categorias`.
- Removido o ícone do cabeçalho do painel de categorias.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Campo de Pesquisa - 22/06/2026

Alterações realizadas:

- Adicionado o rótulo `Pesquisa` acima do campo, seguindo o padrão visual de
  `Categoria` e `Mês`.
- Adicionado placeholder curto e útil: `Descrição, categoria ou valor`.
- Mantido o ícone de pesquisa alinhado à direita dentro do campo.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste da Barra de Pesquisa - 22/06/2026

Alterações realizadas:

- Placeholder da barra de pesquisa removido.
- Ícone de pesquisa corrigido para permanecer alinhado à direita do campo.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste de Filtros, Calendário e Textos - 22/06/2026

Alterações realizadas:

- Ícone da barra de pesquisa movido para a lateral direita.
- Placeholder da pesquisa ajustado para exibir a informação completa.
- Campo de mês substituído por um seletor compacto e estilizado.
- Campo de data substituído por um calendário próprio estilizado.
- Textos visíveis revisados com acentuação correta em português.
- Categorias padrão antigas salvas sem acento passam a ser exibidas com acento.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste de Menu e Painel - 22/06/2026

Alterações realizadas:

- Menu principal centralizado no topo e com mais destaque visual.
- Botão `Novo gasto` removido do menu.
- Formulário de cadastro de novo gasto removido do painel.
- Cadastro de gastos mantido apenas na tela `Gastos`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

Servidor local iniciado para teste:

- `http://127.0.0.1:5173`

## Ajuste de Interface - 22/06/2026

Removidas as informações textuais do topo solicitadas pelo usuário:

- Marca do cabeçalho com `R$`, `Controle de Gastos` e `Financas pessoais`.
- Bloco de introdução com `Controle local`, `Painel financeiro pessoal` e o
  texto sobre dados salvos no navegador.

Após a alteração, a tela inicia diretamente pelos cards do painel e o
cabeçalho mantém apenas a navegação principal e o botão de novo gasto.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`
