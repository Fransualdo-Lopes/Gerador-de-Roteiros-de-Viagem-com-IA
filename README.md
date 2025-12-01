# ✈️ ViajaIA - Planejador de Viagens Inteligente

> Sua próxima aventura, planejada em segundos com Inteligência Artificial.

![Project Banner](https://via.placeholder.com/1200x400?text=ViajaIA+Preview)

## 📖 Sobre o Projeto

O **ViajaIA** é uma aplicação web moderna desenvolvida para transformar a maneira como as pessoas planejam suas viagens. Utilizando o poder da **Inteligência Artificial Generativa**, a plataforma cria roteiros personalizados, detalhados e otimizados com base nas preferências únicas de cada viajante.

O objetivo é eliminar as horas gastas em pesquisas fragmentadas na internet, entregando um plano completo, com estimativas de custos e sugestões curadas, em uma interface intuitiva e responsiva.

---

## 🚀 Funcionalidades Principais

### 🗺️ Geração de Roteiros Inteligentes
- **Personalização Total:** O usuário define o destino, duração, orçamento (Econômico, Moderado, Luxo) e companhia (Solo, Casal, Família, Amigos).
- **Curadoria via IA:** Utiliza a API do Google Gemini para sugerir atrações, restaurantes e atividades que se encaixam no perfil.
- **Detalhamento Diário:** Cronograma manhã, tarde e noite com descrições, localizações e estimativas de preço.

### 📊 Dashboard do Viajante
- **Gestão de Viagens:** Área logada para salvar, visualizar e gerenciar múltiplos roteiros.
- **Análise de Dados:** Gráficos interativos (Recharts) que mostram a distribuição do tipo de atividade (Turismo, Gastronomia, Relax, etc.).
- **Estimativa Orçamentária:** Cálculo aproximado dos custos diários com transporte e alimentação.

### 🔐 Autenticação e Segurança
- **Controle de Acesso:** Sistema de login simulado (expansível para OAuth) para proteger os dados do usuário.
- **Guest Gating:** Fluxo otimizado onde usuários não logados podem configurar o roteiro, mas precisam se cadastrar para visualizar o resultado final, aumentando a conversão.

### 🎨 UI/UX Moderna
- **Design Responsivo:** Interface fluida construída com Tailwind CSS, funcionando perfeitamente em desktop e mobile.
- **Feedback Visual:** Loaders, transições suaves e tipografia hierárquica para melhor legibilidade.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as melhores práticas de desenvolvimento web moderno:

- **Frontend:** [React 19](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para tipagem estática e segurança de código.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) para design system e responsividade.
- **Inteligência Artificial:** Integração com **Google Gemini API** (`gemini-2.5-flash`) para geração de conteúdo.
- **Roteamento:** [React Router v7](https://reactrouter.com/) para navegação SPA (Single Page Application).
- **Visualização de Dados:** [Recharts](https://recharts.org/) para gráficos estatísticos.
- **Ícones:** [Lucide React](https://lucide.dev/).

---

## 📦 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação em seu ambiente local:

### Pré-requisitos
- Node.js (v18 ou superior)
- Gerenciador de pacotes (npm, yarn ou pnpm)
- Uma chave de API do Google Gemini

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/viajaia.git
   cd viajaia
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto e adicione sua chave de API:
   ```env
   API_KEY=sua_chave_api_aqui
   ```
   > **Nota:** A aplicação espera que a chave seja injetada via `process.env.API_KEY` no build ou configuração do bundler (ex: Vite/Webpack).

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm start
   # ou comando equivalente do seu script
   ```

5. **Acesse a aplicação**
   Abra seu navegador em `http://localhost:3000` (ou a porta indicada).

---

## 💎 Valor para o Usuário

O ViajaIA agrega valor ao cliente final ao atuar em três pilares:

1.  **Economia de Tempo:** Reduz o planejamento de dias ou semanas para segundos.
2.  **Assertividade:** Remove a indecisão com recomendações baseadas em dados e contexto.
3.  **Organização:** Centraliza todas as informações da viagem em um único local acessível.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com 💙 por [Seu Nome]
