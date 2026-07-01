# Liora

<p align="center">
  <img src="./public/liora-logo.svg" width="260" alt="Liora" />
</p>

<p align="center">
  <strong>Clareza para suas finanças.</strong><br />
  Uma aplicação local para registrar gastos, entender o mês e organizar a vida financeira com leveza.
</p>

<p align="center">
  <a href="https://controle-de-gastos-phi-dun.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/ABRIR%20LIORA%20AGORA-C97B18?style=for-the-badge&labelColor=263E35&color=C97B18" alt="Abrir Liora agora" />
  </a>
</p>

<p align="center">
  <strong>Site publicado:</strong><br />
  <a href="https://controle-de-gastos-phi-dun.vercel.app" target="_blank">https://controle-de-gastos-phi-dun.vercel.app</a>
</p>

---

## Visão Geral

Liora é um sistema web de controle de gastos pessoais criado para substituir uma planilha de Excel. A proposta é registrar despesas de forma simples, acompanhar o resumo mensal e visualizar para onde o dinheiro está indo sem depender de fórmulas ou abas manuais.

O projeto funciona como um MVP local: os dados ficam salvos no navegador por `localStorage`, sem back-end, banco externo ou sincronização em nuvem nesta versão.

---

## Caminho Visual Do Produto

O caminho do site é o design: a Liora deve transmitir clareza, luz natural, equilíbrio e organização. A interface não busca parecer um banco digital ou uma fintech, mas uma ferramenta pessoal, elegante e acolhedora para entender melhor a vida financeira.

A direção visual atual segue estes princípios:

- Fundo claro e quente, inspirado em luz natural.
- Cards brancos com sombra suave e bordas discretas.
- Tipografia elegante, com hierarquia forte para valores financeiros.
- Cor primária âmbar para ações e destaques.
- Verde sálvia como apoio visual e sensação de equilíbrio.
- Interface com bastante respiro, cantos suaves e microinterações discretas.

Referência conceitual da marca:

<p align="center">
  <img src="./public/liora-conceito.png" width="100%" alt="Conceito visual da marca Liora" />
</p>

---

## Funcionalidades

- Dashboard mensal com total do mês, saldo restante, maior categoria, média mensal e resumos.
- Cadastro de gastos com data, categoria, valor e descrição opcional.
- Edição e exclusão de lançamentos.
- Histórico completo com pesquisa dinâmica, filtro por categoria e filtro por mês.
- Histórico de meses anteriores.
- Gerenciamento de categorias ativas e inativas.
- Perfil local com salário mensal editável.
- Cálculo do valor restante do salário diante dos gastos do mês.
- Backup e importação/exportação de dados em JSON.
- Login local simples para uso pessoal.
- PWA com suporte offline após o primeiro carregamento.
- Interface responsiva para desktop, tablet e celular.

---

## Tecnologias

- React
- Vite
- JavaScript
- CSS organizado por componentes
- CSS variables para tokens visuais
- LocalStorage
- Service Worker e Manifest para PWA
- Lucide React para ícones

---

## Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/Luis-Fernando-R-Bueno/Controle-de-gastos.git

# Acesse a pasta do projeto
cd Controle-de-gastos

# Instale as dependências
npm install

# Execute a aplicação
npm run dev
```

A aplicação abre em modo desenvolvimento no endereço indicado pelo Vite, normalmente `http://localhost:5173`.

---

## Acesso Local

Credenciais configuradas para o MVP local:

```txt
Usuário: luis.bueno
Senha: rodrigues.bueno
```

A autenticação é apenas uma trava local da interface. Ela não substitui uma autenticação real com servidor.

---

## Estrutura Principal

```txt
src/
  componentes/
  hooks/
  pwa/
  rotas/
  servicos/
  styles/
  telas/
  utils/
```

Arquivos importantes:

- `src/styles/tokens.css`: tokens do design system.
- `src/estilos/global.css`: estilos globais da aplicação.
- `src/rotas`: definição das rotas principais.
- `src/servicos/storageService.js`: persistência local.
- `public/manifest.webmanifest`: configuração do PWA.
- `public/sw.js`: cache offline do aplicativo.

---

## Persistência E Privacidade

Os dados cadastrados ficam no navegador do próprio dispositivo. Nenhuma informação é enviada para servidores externos nesta versão.

Por isso, limpar dados do navegador, trocar de navegador ou usar outro dispositivo pode fazer os dados deixarem de aparecer. A tela de backup existe para exportar os registros quando necessário.

---

## Status Do Projeto

O projeto está em fase de MVP funcional com foco em:

- uso pessoal diário;
- organização dos gastos;
- clareza visual;
- experiência responsiva;
- base visual consistente para evolução futura.

Possíveis evoluções futuras:

- IndexedDB ou SQLite local;
- back-end com Node.js;
- banco MySQL ou PostgreSQL;
- sincronização entre dispositivos;
- gráficos mais completos;
- exportação de relatórios.

---

## Autor

Desenvolvido por **Luis Fernando Rodrigues Bueno**.

