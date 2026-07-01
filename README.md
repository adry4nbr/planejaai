# Planej.ai

🚀 **Deploy da aplicação:** [Planejaai](https://planejaai-lake.vercel.app/)

## 1. O que o projeto faz

O Planej.ai é uma aplicação focada em planejamento financeiro inteligente. Ele recebe os dados de renda, custos fixos, dívidas e objetivos financeiros do usuário e, através da integração com a Inteligência Artificial (Google Gemini), gera um plano de ação e insights personalizados para ajudar o usuário a alcançar a sua meta financeira. Além disso, permite realizar consultas via chat e manter o histórico completo das simulações.

## 2. Como executar a aplicação

Siga o passo a passo abaixo para rodar o projeto localmente:

1. Clone o repositório ou baixe o código-fonte.
2. Certifique-se de ter o **Node.js** instalado na sua máquina.
3. Abra o terminal na pasta raiz do projeto e instale as dependências executando:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` na raiz do projeto contendo a sua chave da API do Google Gemini:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_aqui
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse o link exibido no terminal (geralmente `http://localhost:5173`).

## 3. Quais tecnologias foram usadas

- **React (Vite)** para a estruturação rápida e leve do front-end.
- **TypeScript** garantindo tipagem forte, previsibilidade e menos bugs durante o desenvolvimento.
- **Tailwind CSS** para estilização moderna, limpa e responsiva.
- **Lucide React** para os ícones.
- **React Router DOM** para o gerenciamento de navegação entre as páginas.
- **React Markdown** para interpretar e estilizar as respostas retornadas pela inteligência artificial.
- **Google Generative AI (Gemini 1.5 Flash)** como motor de inteligência artificial para insights financeiros e respostas via chat.

## 4. Melhorias implementadas

Como parte dos desafios do projeto, implementamos duas features principais (Melhorias):

1. **Chat Inteligente com o Educador Financeiro:** A página de resultado da simulação agora possui um chat funcional acoplado aos insights. Nele, o usuário tem a liberdade de fazer quantas perguntas quiser relacionadas ao seu planejamento para a IA, gerando um histórico de conversa que salva mensagens formatadas adequadamente, com rolagem automática e feedback visual.
2. **Histórico de Simulações (`/historico`):** Foi desenvolvida uma nova página inteira de gerenciamento. Nela, o usuário visualiza um resumo (Goal, Data, Prazo, Economia Mensal Necessária) de todos os planejamentos gerados. O sistema oferece a opção de apagar simulações que não fazem mais sentido ou revisitar diretamente os insights gerados clicando em "Ver detalhes". Adicionalmente, ocorreu a refatoração das funções globais de moedas para respeitar o princípio DRY (Don't Repeat Yourself).

## 5. Como testar o fluxo principal

1. Acesse a aplicação a partir do navegador.
2. No menu principal, inicie uma **Nova Simulação** respondendo etapa por etapa as perguntas com dados reais ou fictícios (como receita, custos, qual seu objetivo, qual valor desejado, e o prazo da sua meta).
3. Chegando na etapa de **Resultados**, aguarde a IA processar suas informações e leia o Card de Insight gerado com o seu plano de ação para aquele prazo.
4. Logo abaixo do plano, escreva alguma dúvida no campo de texto e teste as perguntas interativas com a IA para conferir a formatação em Markdown e o histórico sendo criado e persistido na tela.
5. Clique na aba **Histórico** no cabeçalho superior e valide que a sua simulação consta na listagem, com a economia mensal dividida corretamente. Experimente navegar com o "Ver detalhes" ou deletar no ícone de lixeira.

## 6. O que eu aprendi com esse desafio

Durante o desenvolvimento deste projeto e a conclusão dos desafios, obtive diversos aprendizados técnicos e práticos que elevaram minha visão de arquitetura front-end:

- **Arquitetura de Projetos Reais**: Compreendi na prática como desenvolvedores de alto nível estruturam um projeto React (com Vite, TypeScript e Tailwind) do zero. A separação em múltiplas pastas com funções distintas (como hooks, pages, components, utils) garante que a aplicação seja altamente escalável a longo prazo.
- **Estilização Inteligente com Tailwind**: Aprender a definir estilos base usando variáveis no CSS aliadas às classes utilitárias mudou a forma como eu penso no design do projeto. Facilita muito a implementação e alternância de temas, como o _Dark Mode_, de forma global e simplificada.
- **Potencial Real do TypeScript**: Aprofundei meus conhecimentos sobre tipagem. Utilizar o TypeScript para definir `interfaces`, `types` rígidos e recursos como `satisfies` me mostrou como prever e mitigar bugs antes mesmo do código rodar, indo muito além do básico.
- **Componentização Avançada**: Evoluí o meu entendimento sobre a utilização de componentes, passagem de propriedades (`props`) e a criação de `hooks` customizados (como de armazenamento no localStorage) para isolar lógicas visuais e de dados.
- **Integração com Inteligência Artificial**: Consumir a API do Google Gemini pela primeira vez e ver o chat funcional, processando contexto e respondendo dinamicamente, foi uma experiência incrível. Agora tenho clareza técnica para implementar IA em projetos futuros.
- **Uso de IA como Mentor**: Por fim, utilizei a Inteligência Artificial não como um construtor mágico de código, mas como um professor para me ajudar a raciocinar as lógicas dos desafios. Isso evidenciou que a jornada de estudos é contínua e a prática diária será o meu grande direcionamento a partir de agora.

## 7. Estrutura de Pastas

Para manter o projeto organizado e escalável, a arquitetura foi dividida da seguinte forma dentro do diretório `src/`:

```text
planejaai/
├── public/
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── piggy-bank.png
│   ├── components/
│   │   ├── features/
│   │   │   ├── Insights/
│   │   │   │   ├── Chat.tsx
│   │   │   │   ├── Content.tsx
│   │   │   │   └── Error.tsx
│   │   │   ├── Simulation/
│   │   │   │   ├── Form.tsx
│   │   │   │   ├── FormStep.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   └── Progress.tsx
│   │   │   └── SimulationResults/
│   │   │       ├── AIInsightCardProps.tsx
│   │   │       └── Card.tsx
│   │   ├── layout/
│   │   │   └── RootLayout.tsx
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Divider.tsx
│   │       ├── Header.tsx
│   │       ├── Input.tsx
│   │       └── PageHero.tsx
│   ├── context/
│   │   └── theme/
│   │       ├── ThemeContext.tsx
│   │       └── ThemeProvider.tsx
│   ├── data/
│   │   ├── aiPrompt.ts
│   │   └── simulation.ts
│   ├── hooks/
│   │   ├── useInsight.tsx
│   │   ├── useSimulationStorage.tsx
│   │   └── useTheme.tsx
│   ├── pages/
│   │   ├── SimulationFormPage.tsx
│   │   ├── SimulationHistoryPage.tsx
│   │   └── SimulationResultsPage.tsx
│   ├── services/
│   │   └── aiService.ts
│   ├── styles/
│   │   └── theme.css
│   ├── utils/
│   │   ├── currency.ts
│   │   └── simulation.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── router.tsx
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
