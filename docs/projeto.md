# Liora

## Ideia do Projeto

Criar a Liora, uma aplicação web local para substituir uma planilha de Excel no
controle de gastos pessoais. A proposta é permitir que o usuário registre seus
gastos de forma simples, sem precisar preencher manualmente uma tabela por mês e
categoria.

O sistema deve ter uma interface limpa, profissional e responsiva, com foco em
praticidade para uso diário. A primeira versão será um MVP funcional, sem
back-end, autenticação ou banco de dados.

Liora significa luz, clareza e equilíbrio. A identidade visual deve transmitir
uma ferramenta elegante de compreensão financeira pessoal, sem aparência de
banco digital ou fintech.

## Objetivo do MVP

Entregar um sistema web funcional onde o usuário consiga:

- Cadastrar gastos pessoais.
- Gerenciar categorias.
- Pesquisar lançamentos.
- Visualizar o histórico completo.
- Acompanhar um painel mensal atualizado automaticamente.
- Persistir os dados localmente no navegador usando `localStorage`.

O objetivo visual é parecer uma ferramenta pessoal leve, clara e acolhedora para
entender a vida financeira, e não apenas uma planilha digital.

## Tecnologias Desejadas

- React + Vite no front-end.
- TypeScript no código da aplicação.
- CSS modular ou CSS organizado por componentes.
- `localStorage` para persistência inicial.
- Sem back-end na primeira versão.
- Sem banco de dados na primeira versão.
- Autenticação local simples na primeira versão, sem back-end.

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
- Usar apenas autenticação local simples nesta versão.
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

## Atualização do Painel para Layout 2x2 - 01/07/2026

Alterações realizadas:

- O painel mensal agora apresenta os cards em uma grade 2x2 em vez de 4 em
  linha única.
- Cada card foi refinado para ter proporção mais retangular e melhor uso do
  espaço interno.
- Valores numéricos nos cards agora mantêm uma linha única para evitar
  quebra abrupta e melhorar a leitura dos dados.

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

## Atualização da Tela de Perfil - 01/07/2026

Alterações realizadas:

- Reorganizados os campos de perfil para exibir nome, telefone e email antes
  do bloco de salário.
- Mantido o salário como o último item da área de perfil.
- Ajustado o ícone de perfil para ficar centralizado dentro do círculo de foto.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

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

## PWA com Suporte Offline - 24/06/2026

Alterações realizadas:

- Adicionado `manifest.webmanifest` para permitir instalação do sistema no
  celular como aplicativo.
- Criados ícones PNG para instalação do PWA.
- Adicionado `sw.js` com cache local do app para uso offline após o primeiro
  carregamento.
- Criado registro do service worker em `src/pwa/registerServiceWorker.js`,
  ativo apenas em build de produção.
- `index.html` recebeu metatags de PWA, tema, descrição e suporte a instalação
  em dispositivos móveis.

Observações:

- O app precisa ser aberto uma vez com internet para o service worker salvar os
  arquivos no cache.
- Depois disso, a interface pode abrir offline no celular.
- Os dados continuam locais no navegador/dispositivo, sem sincronização entre
  aparelhos.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Responsividade do Menu Principal - 24/06/2026

Alterações realizadas:

- Menu principal ajustado para distribuir os itens em quatro colunas em telas
  menores.
- Em celulares, os textos dos itens do menu são ocultados e ficam apenas os
  ícones.
- Botões mantêm `aria-label` e `title` para preservar acessibilidade e dica do
  item.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Tela de Login Local - 24/06/2026

Alterações realizadas:

- Criada tela de login minimalista antes do acesso ao sistema.
- Credenciais locais configuradas para o usuário `luis.bueno`.
- Sessão salva em `localStorage` para o PWA abrir direto após login.
- Adicionado botão de sair no menu principal.
- Autenticação é apenas uma trava local do aplicativo, sem back-end.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste Visual do Login - 24/06/2026

Alterações realizadas:

- Mensagem de erro do login movida para cima do campo `Usuário`.
- Ícone do cadeado no cabeçalho substituído por logo circular azul com cifrão.
- Cabeçalho do formulário centralizado para destacar a marca.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Logo da Guia e Tela de Login - 24/06/2026

Alterações realizadas:

- Criada uma logo circular azul com cifrão para o sistema.
- Favicon da guia atualizado para usar a nova logo.
- Tela de login passou a exibir a logo no cabeçalho e como marca d'água discreta
  atrás do formulário.
- Manifesto do PWA e cache offline passaram a incluir a logo.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Configurações, Backup e Segurança - 24/06/2026

Alterações realizadas:

- Aba `Configurações` mantida no menu principal do sistema.
- Tela de configurações reorganizada seguindo a lógica do projeto
  `SC-Censo-Diario`, adaptada ao domínio de controle de gastos.
- `Categorias` passou a ficar em `Configurações > Categorias`.
- Backup de registros passou a ficar em `Configurações > Backup`, substituindo a
  antiga tela isolada de importação/exportação.
- Removidos a tela antiga `src/telas/importar` e o atalho flutuante de
  importação.
- Saída do sistema removida do menu principal e movida para
  `Configurações > Segurança e acesso`.
- Adicionadas páginas de `Saiba mais`, `Suporte` e `Termos de uso`.
- Estilização das novas telas usa as cores e variáveis atuais do projeto.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Hierarquia de Configurações - 24/06/2026

Alterações realizadas:

- Lista principal de `Configurações` alterada para cards verticais, seguindo a
  organização visual usada no projeto `SC-Censo-Diario`.
- Criada a tela `Configurações > Perfil`, com dados do acesso local, último
  login e foto de perfil salva no navegador.
- `Saiba mais` passou a funcionar como agrupador de informações do projeto.
- Criada a tela `Saiba mais > Quem somos`, com origem e linha do tempo resumida
  do Controle de Gastos.
- `Termos de uso` foi movido para `Saiba mais > Termos de uso e privacidade`.
- `Suporte` passou a ter subpáginas funcionais:
  - `Suporte > Dúvidas frequentes`.
  - `Suporte > Participe do projeto`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajustes Visuais de Configurações - 24/06/2026

Alterações realizadas:

- Cabeçalho principal de `Configurações` simplificado para exibir apenas
  `Olá, Luis`, sem o card branco ao redor.
- Ordem da lista principal ajustada para:
  - Perfil.
  - Categorias.
  - Segurança e acesso.
  - Suporte.
  - Saiba mais.
  - Backup.
- Tela `Perfil` refeita com identidade local, foto de perfil, último login e
  indicação de dados salvos no navegador.
- Tela `Quem somos` refeita com apresentação própria do Controle de Gastos e
  pilares do projeto.
- Criado rodapé compartilhado inspirado no `SC-Censo-Diario`, com contatos e
  links do projeto.
- Rodapé adicionado ao layout logado do sistema.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Correção da Navegação Interna de Configurações - 24/06/2026

Alterações realizadas:

- Renderização das subpáginas de `Configurações` centralizada em uma função com
  `switch` sobre `settingsView`.
- Telas internas de `Perfil`, `Suporte > Dúvidas frequentes`,
  `Suporte > Participe do projeto`, `Saiba mais > Quem somos` e
  `Saiba mais > Termos de uso e privacidade` ficaram explicitamente mapeadas em
  um único ponto.
- Imports das subpáginas foram conferidos e validados pelo build.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste das Subpáginas de Configurações - 24/06/2026

Alterações realizadas:

- Removidos os cabeçalhos informativos grandes das subpáginas de
  `Configurações`.
- Subpáginas mantêm apenas o botão `Voltar` no topo.
- Tela `Configurações > Categorias` passou a usar layout vertical:
  - cadastro de nova categoria no topo;
  - campo e botão lado a lado no desktop;
  - lista de categorias abaixo do cadastro.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Conteúdo de Saiba Mais e Suporte - 24/06/2026

Alterações realizadas:

- Tela `Saiba mais > Quem somos` refeita como linha do tempo vertical, seguindo
  o estilo usado na tela equivalente do `SC-Censo-Diario`.
- Linha do tempo adaptada à história do Controle de Gastos: origem na planilha,
  cadastro de gastos, categorias, dashboard, histórico, PWA, backup e evolução
  futura.
- Tela `Suporte > Dúvidas frequentes` recebeu cards mais espaçados e detalhados
  sobre dados locais, uso offline, backup e segurança do acesso local.
- Tela `Saiba mais > Termos de uso e privacidade` recebeu o texto completo
  atualizado em 22 de junho de 2026, organizado em blocos estilizados.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Remoção da Tela de Ajuda - 24/06/2026

Alterações realizadas:

- Tela `Suporte > Ajuda` removida do projeto.
- Card de `Ajuda` removido da tela `Configurações > Suporte`.
- Import e renderização interna de `ConfiguracoesAjuda` removidos da tela
  principal.
- A pasta `src/telas/configuracoes/suporte/ajuda` foi excluída.
- A opção `Suporte` passou a apontar apenas para `Dúvidas frequentes` e
  `Participe do projeto`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Design System Visual - 24/06/2026

Alterações realizadas:

- Criados os arquivos `src/styles/tokens.css` e `src/styles/base.css`.
- `src/estilos/global.css` passou a importar os estilos globais centralizados.
- Tokens de cores, espaçamento, tipografia, bordas e sombras foram definidos em
  variáveis CSS.
- Aplicado tema fixo azul marinho com padrão geométrico em linhas e overlay
  escuro para preservar legibilidade.
- Cards, botões, inputs, tabelas, cabeçalho, menu, rodapé, modal e telas de
  configurações foram alinhados ao padrão glass com `backdrop-filter`, bordas
  suaves e cores por tokens.
- Estilos antigos remanescentes da tela padrão do Vite também foram alinhados
  aos aliases do Design System.
- Nenhuma regra de negócio foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Padronização das Cores de Categorias - 24/06/2026

Alterações realizadas:

- Criado o utilitário `src/utils/categoryColors.js` com o mapa central
  `categoryColors` e a função `getCategoryColor(nome)`.
- Tokens de cores de categoria adicionados em `src/styles/tokens.css`.
- Categorias padrão e categorias já salvas passam a carregar cores consistentes
  a partir do nome da categoria.
- Novas categorias recebem cor determinística por nome, evitando cores
  aleatórias espalhadas pelo código.
- Badges de categoria passaram a usar fundo translúcido, texto sólido e borda
  sutil com a própria cor da categoria.
- Indicadores do dashboard, lista de gastos e tela de categorias foram
  alinhados ao mesmo padrão visual.
- Nenhuma regra de negócio foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Fundo Visual com Imagem - 24/06/2026

Alterações realizadas:

- O fundo global do sistema passou a usar a imagem `public/fundo.png`.
- O token `--app-background-image` foi adicionado ao Design System para
  centralizar a referência da imagem.
- O fundo mantém overlay escuro sobre a imagem para preservar a legibilidade dos
  cards, textos e controles.
- `public/sw.js` foi atualizado para incluir `fundo.png` no cache do PWA.
- A versão do cache do service worker foi incrementada para forçar atualização
  do arquivo em instalações existentes.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Rodapé Completo e Fundo Mais Legível - 24/06/2026

Alterações realizadas:

- Rodapé refeito com blocos de resumo do sistema, recursos, projeto e contatos.
- Informações do rodapé passaram a usar painéis sólidos, sem aparência
  translúcida.
- Tokens de texto e superfícies foram ajustados para reduzir opacidade visual e
  melhorar contraste.
- O fundo global deixou de aplicar overlay escuro sobre `public/fundo.png`,
  mantendo as linhas do padrão visual brancas.
- Cards, inputs e superfícies passam a usar cores sólidas do Design System,
  preservando contraste sobre o fundo com imagem.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajustes de Login, Rodapé e Salário - 25/06/2026

Alterações realizadas:

- Tela de login passou a usar fundo sólido do Design System, sem as linhas da
  imagem `fundo.png` atrás do formulário.
- Campo de senha recebeu botão para mostrar ou ocultar a senha digitada.
- Campos do login receberam correção visual para autofill do navegador.
- Cabeçalho `Olá, Luis` nas configurações ganhou painel sólido, borda de
  destaque e maior contraste.
- Rodapé simplificado para exibir apenas contatos, dentro de largura máxima
  controlada.
- Tela `Perfil` recebeu campo editável de `Salário mensal`, salvo em
  `localStorage`.
- Card de `Lançamentos` no painel passa a mostrar `Sobra do salário` quando há
  salário cadastrado, calculando salário mensal menos total gasto no mês
  selecionado.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajustes Visuais de Fundo, Configurações e Perfil - 25/06/2026

Alterações realizadas:

- Fundo global do sistema igualado ao fundo sólido da tela de login, removendo
  o uso visual da imagem `fundo.png` nas telas internas.
- Service worker atualizado para `controle-gastos-pwa-v4`, removendo
  `fundo.png` do cache inicial do PWA.
- Texto `Olá, Luis` movido para o cabeçalho da lista principal de
  configurações, substituindo `Opções` e `O que deseja configurar?`.
- Tela `Perfil` deixou de exibir `Conta local` e o usuário `luis.bueno` na área
  de identidade.
- Botões de foto do perfil receberam tamanho menor e mais proporcional.
- Bloco informativo de resumo do perfil foi removido.
- Rodapé passou a exibir apenas os contatos centralizados, sem título visível
  `Contato`, sem caixa e com linha superior de separação.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Edição Recolhida do Salário - 25/06/2026

Alterações realizadas:

- Campo de edição do salário mensal deixou de ficar aberto por padrão na tela
  `Perfil`.
- Valor do salário passa a aparecer em modo leitura com botão de lápis à
  direita.
- Input e botão `Salvar salário` aparecem apenas após clicar no ícone de
  edição.
- Ao salvar, o card volta automaticamente para o modo leitura.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Bloco de Foto do Perfil - 25/06/2026

Alterações realizadas:

- Botão `Alterar foto` removido da tela `Perfil`.
- Alteração da foto permanece disponível pelo clique direto no avatar.
- Espaçamento entre a foto e o nome foi reduzido.
- Conteúdo do bloco de perfil foi centralizado verticalmente no painel.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste do Rodapé e Card de Salário - 26/06/2026

Alterações realizadas:

- Número de telefone removido do rodapé.
- Card de `Lançamentos` no painel substituído definitivamente por
  `Sobra do salário`.
- O cálculo exibido passa a ser sempre `salário mensal - total gasto do mês`,
  mesmo quando nenhum salário foi informado.
- Texto auxiliar do card alterado para `Salário menos gastos do mês`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Retorno ao Tema Claro - 26/06/2026

Alterações realizadas:

- Paleta central de `src/styles/tokens.css` voltou para base clara.
- Fundo geral passou a usar gradiente claro e discreto.
- Cards, inputs, header, login e painéis permanecem usando variáveis do Design
  System, mas com superfícies brancas e texto escuro.
- Botões primários e confirmações passaram a usar `--color-on-accent` para
  manter contraste correto no tema claro.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Rebranding para Liora - 01/07/2026

Alterações realizadas:

- Nome visual do aplicativo alterado para `Liora`.
- Identidade visual reposicionada para transmitir luz, clareza e equilíbrio,
  evitando aparência de banco digital, fintech ou dashboard corporativo.
- Paleta centralizada em `src/styles/tokens.css` com fundo claro, cards brancos,
  texto escuro, âmbar como cor primária e verde sálvia como cor secundária.
- `src/styles/base.css` ajustado para fundo claro, tipografia mais leve,
  microinterações discretas, botões arredondados e superfícies com sombras
  suaves.
- Login, cabeçalho, cards do painel, tabelas, filtros, calendário, modais,
  rodapé, perfil e telas de configurações foram realinhados à nova identidade.
- Logo temporária criada com símbolo de luz/horizonte, sem cifrão, moeda ou
  elementos bancários.
- Favicon, manifesto PWA, ícones PNG e metadados do `index.html` atualizados
  para `Liora`.
- Textos visíveis de suporte, saiba mais, termos, backup e README foram
  ajustados para a nova marca.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Segunda Iteração Visual da Liora - 01/07/2026

Alterações realizadas:

- Paleta central de `src/styles/tokens.css` ajustada para a nova direção visual:
  fundo `#F4F2EC`, cards brancos, texto principal mais escuro, âmbar mais
  profundo e verde sálvia mais presente.
- Sombras, bordas, espaçamentos e tamanhos de fonte foram reforçados nos tokens
  para evitar a aparência de `bege sobre bege`.
- `src/styles/base.css` recebeu fundo com luz natural discreta, botões mais
  confiáveis, hover suave e microinterações com escala leve.
- Menu superior passou a usar fundo branco, sombra leve, ícones em âmbar e aba
  ativa com aparência de botão destacado.
- Dashboard ganhou maior hierarquia visual, com destaque para `Total do mês`,
  números maiores, cards com mais respiro e hover em escala discreta.
- Formulários, filtros, tabelas, histórico, categorias, perfil, FAQ, termos,
  quem somos e configurações receberam cards mais presentes, foco âmbar e
  sombras mais elegantes.
- Logo temporária, favicon, ícones PWA, manifesto, tema do navegador e badge do
  README foram alinhados à nova paleta.
- O `icons.svg` antigo deixou de ser carregado no cache inicial do PWA.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajustes de Header, Favicon e Cards - 01/07/2026

Alterações realizadas:

- Navegação principal do menu superior centralizada em relação à largura da
  tela.
- Guia do navegador passou a usar explicitamente `favicon.svg`, com fallback em
  `icon-192.png`.
- Valores numéricos dos cards do painel passaram a usar classe visual própria
  com `white-space: nowrap`, evitando quebra em `R$ 0,00` e outros valores.
- Textos de categoria, como `Sem dados`, continuam podendo quebrar naturalmente
  quando necessário.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Rotas por Tela no App - 25/06/2026

Alterações realizadas:

- Adicionado `react-router-dom` ao projeto para seguir o padrão de navegação
  usado no `SC-Censo-Diario`.
- `main.jsx` passou a envolver a aplicação com `BrowserRouter`.
- Menu principal deixou de navegar por estado interno e passou a usar links
  reais com `NavLink`.
- Tela inicial foi refatorada para renderizar telas por `Routes` e `Route`.
- Cada área principal passou a ter URL própria:
  - `/painel`
  - `/gastos`
  - `/historico`
  - `/configuracoes`
- A rota `/` permanece apenas como redirecionamento para o painel.
- Subtelas de configurações também passaram a ter links próprios, como
  `/configuracoes/perfil`, `/configuracoes/categorias`,
  `/configuracoes/suporte/duvidas-frequentes` e
  `/configuracoes/saiba-mais/termos-de-uso-e-privacidade`.
- O estado central dos gastos, categorias, filtros, painel e salário permaneceu
  concentrado na tela `Inicial`, sem alteração de regra de negócio.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Redirecionamento Seguro Após Logout - 25/06/2026

Alterações realizadas:

- `App.jsx` passou a usar `useNavigate` e `useLocation` para controlar a rota
  durante autenticação local.
- Ao sair do sistema, a sessão é limpa e a URL volta para `/login`, evitando manter
  uma rota protegida como `/configuracoes/seguranca-e-acesso` na tela de login.
- Ao fazer login novamente, o usuário sempre retorna para o painel inicial,
  sem reabrir a tela protegida anterior.
- Caso o app esteja sem sessão em qualquer rota interna, a URL é substituída por
  `/login`.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Rotas Explícitas de Login e Painel - 25/06/2026

Alterações realizadas:

- Criada a rota pública `/login` para a tela de acesso local.
- Criada a rota autenticada `/painel` para o dashboard principal.
- Login bem-sucedido passa a redirecionar para `/painel`.
- Logout passa a redirecionar para `/login`.
- A navegação principal passou a apontar o item `Painel` para `/painel`.
- A rota `/` passou a redirecionar para `/painel` quando houver sessão ativa.

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

## Logo Oficial Importada - 01/07/2026

Alterações realizadas:

- Imagem `Logo Liora.png` importada para `public/logo-liora.png`.
- Arquivo otimizado para uso na interface, reduzindo o peso da imagem original.
- Header principal e tela de login passaram a usar `logo-liora.png` no lugar da logo temporária em SVG.
- Service worker atualizado para incluir a nova logo no cache offline do PWA.
- Removido parâmetro `session` sem uso da tela `Perfil`, mantendo o lint limpo.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Refinamento da Logo no Header - 01/07/2026

Alterações realizadas:

- `public/logo-liora.png` foi recriada a partir da imagem original com recorte específico da marca.
- O arquivo deixou de carregar o quadro grande completo da imagem enviada, melhorando nitidez e encaixe visual.
- Header e login passaram a usar `object-fit: contain`, evitando corte, compressão ou distorção da logo.
- Dimensões da logo foram ajustadas separadamente para header e login.
- Service worker atualizado para `liora-pwa-v4`, garantindo atualização do asset no PWA.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ajuste da Logo no Login - 01/07/2026

Alterações realizadas:

- Textos `Entrar com clareza` e `Um espaço leve para entender para onde seu dinheiro está indo.` removidos da tela de login.
- Logo da Liora centralizada no topo do card de login.
- Área visual da logo aumentada para dar mais destaque à marca.
- Regras CSS antigas do título e parágrafo do login foram removidas.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Ampliação da Logo no Login - 01/07/2026

Alterações realizadas:

- `public/logo-liora.png` recriada com recorte mais justo da marca, reduzindo margem interna entre a logo e o texto da própria arte.
- Logo da tela de login ampliada para `390px` de largura máxima.
- Altura visual da logo ajustada para reduzir o espaço vazio antes dos campos.
- Espaçamento interno do card de login reduzido de `spacing-xl` para `spacing-lg`.
- Service worker atualizado para `liora-pwa-v5` para renovar o asset no PWA.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Correção de Escala da Logo no Login - 01/07/2026

Alterações realizadas:

- Card de login ampliado para `520px`, dando mais área útil para a marca.
- Logo do login ampliada para `420px` de largura máxima e `190px` de altura.
- Imagem da logo passou a usar `object-fit: cover` no login para reduzir o espaço visual vazio dentro do PNG.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Logo Provisória Específica do Login - 01/07/2026

Alterações realizadas:

- Nova imagem `logo-liora-login.png` importada como fonte provisória da marca na tela de login.
- Gerado asset otimizado em `public/logo-liora-login.png` com transparência e dimensões de `1200x654`.
- Tela de login passou a usar `/logo-liora-login.png`, mantendo o header com a logo atual.
- Logo do login configurada com `object-fit: contain`, evitando corte visual enquanto não há SVG profissional.
- Service worker atualizado para `liora-pwa-v6` e passou a incluir `logo-liora-login.png` no cache offline.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Retorno da Logo Anterior no Login - 01/07/2026

Alterações realizadas:

- Tela de login voltou a usar `/logo-liora.png`.
- Imagem provisória `public/logo-liora-login.png` removida do projeto.
- Service worker atualizado para `liora-pwa-v7` e deixou de carregar a imagem provisória no cache offline.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Logo SVG Provisória Apenas com Texto - 01/07/2026

Alterações realizadas:

- `public/liora-logo.svg` simplificado para exibir apenas a palavra `Liora` em fonte cursiva/serifada provisória.
- Header e tela de login passaram a usar `/liora-logo.svg` como marca visível.
- Dimensões da marca foram ajustadas no header e no login para o SVG textual.
- Service worker atualizado para `liora-pwa-v8` e passou a cachear `liora-logo.svg`.
- Logo PNG anterior deixou de ser usada na interface principal.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## SVG Vetorizado na Logo do Login - 01/07/2026

Alterações realizadas:

- SVG `liora-logo-vetorizada.svg` copiado de Downloads para `public/liora-logo-login.svg`.
- `viewBox` do SVG ajustado para recortar a área útil da marca no login.
- Tela de login passou a usar `/liora-logo-login.svg`.
- Header permanece usando a logo textual provisória `/liora-logo.svg`.
- Service worker atualizado para `liora-pwa-v9`, incluindo o novo SVG no cache offline.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`


## Refinamento da Logo do Login - 01/07/2026

Alterações realizadas:

- `public/liora-logo-login.svg` substituído por uma versão vetorial limpa, menor e sem ruído de vetorização de imagem.
- Logo do login redesenhada com wordmark `Liora`, símbolo de nascer do sol e tagline em SVG puro.
- Tamanho exibido da logo no login reduzido para evitar excesso de ocupação visual no formulário.
- Cache do PWA atualizado para `liora-pwa-v10` para forçar a atualização do novo SVG.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Logo Tipográfica Liora - 01/07/2026

Alterações realizadas:

- `public/liora-logo.svg` e `public/liora-logo-login.svg` substituídos por uma marca tipográfica simples, exibindo apenas `Liora`.
- Símbolo de sol, rio e tagline foram removidos da logo do site e da tela de login.
- `public/favicon.svg` e `public/logo.svg` substituídos por um ícone tipográfico com a letra `L`, mais legível na guia do navegador.
- Cache do PWA atualizado para `liora-pwa-v11`.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run lint`
- `npm.cmd run build`

## Atualização do README e Conceito Visual - 01/07/2026

Alterações realizadas:

- Imagem `Conceito.png` copiada para `public/liora-conceito.png` para uso direto na documentação do repositório.
- README reescrito com foco na identidade atual da Liora, proposta do produto, direção de design, funcionalidades, tecnologias, execução local, acesso local, estrutura principal, persistência e status do MVP.
- Botão `Acessar Liora` no README destacado com badge visual em destaque.
- Demonstracao do README passou a usar a imagem conceitual da marca Liora.
- Nenhuma regra de negocio, persistencia ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run build`

## Migração para TypeScript - 10/07/2026

Alterações realizadas:

- Arquivos da aplicação em `src` migrados de `.js` e `.jsx` para `.ts` e `.tsx`.
- Adicionado `tsconfig.json` com configuração compatível com React, Vite e DOM.
- `vite.config.js` migrado para `vite.config.ts`.
- Entrada do HTML atualizada para carregar `src/main.tsx`.
- ESLint configurado para analisar arquivos TypeScript com `typescript-eslint`.
- Script `build` passou a executar `tsc -b` antes do `vite build`.
- Adicionado script `check` para rodar `tsc -b --noEmit`.
- Criada tipagem global para variáveis CSS customizadas usadas nos estilos inline.
- Hook principal recebeu tipos locais para categorias, gastos e resumos.
- Nenhuma regra de negócio, persistência ou fluxo visual foi alterado.

Validações executadas:

- `npm.cmd run check`
- `npm.cmd run lint`
- `npm.cmd run build`



## README no Padrão do SC-Censo-Diario - 03/07/2026

Alterações realizadas:

- Repositório `SC-Censo-Diario` localizado em `C:\Users\User\Desktop\Pessoal\SC-Censo-Diario` e README usado como referência estrutural.
- README da Liora refeito com título com emoji, logo central, badges, botão destacado, navegação interna, história do projeto, funcionalidades, demonstração, tecnologias, execução local, estrutura, próximas funcionalidades e documentação complementar.
- Adicionadas seções interativas com `<details>` para caminho visual, acesso local, rotas principais, dados locais e design system.
- Imagem `public/liora-conceito.png` mantida como demonstração visual principal.
- Nenhuma regra de negócio, persistência ou estrutura de dados foi alterada.

Validações executadas:

- `npm.cmd run build`

