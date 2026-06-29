# Observatório de Turismo de Olímpia - TourDev

Este projeto é uma plataforma para análise e previsão do fluxo turístico em Olímpia. Ele permite que gestores, empresários e turistas visualizem dados históricos e realizem previsões sobre o comportamento de diferentes perfis de turistas na região.

O sistema é dividido em duas partes principais: uma API em **Python (FastAPI)** responsável pelo processamento de dados e previsões, e um frontend moderno construído com **React e Vite**.

## Tecnologias Utilizadas

### Backend (`/backend`)
A inteligência dos dados e a geração das visualizações estão no backend.
- **FastAPI**: Framework web rápido e moderno para construção de APIs.
- **Prophet**: Biblioteca do Facebook (Meta) especializada em previsão de séries temporais.
- **Matplotlib e Pandas**: Usados para processamento de dados (agregação, filtragem) e geração dos gráficos em formato de imagem (PNG).
- **Uvicorn**: Servidor ASGI para rodar a aplicação.

### Frontend (`/frontend`)
Interface web limpa e amigável para o usuário, responsável por montar os filtros e requisitar os gráficos.
- **React (com TypeScript)**: Biblioteca para a criação da interface do usuário.
- **Vite**: Ferramenta de build e servidor de desenvolvimento extremamente rápido.
- **Tailwind CSS**: Framework utilitário de CSS para estilização moderna e ágil.
- **React Query (@tanstack/react-query)**: Gerenciamento de estado de requisições, fazendo o cache das imagens e cuidando do carregamento dinâmico dos gráficos.

---

## Como Executar o Projeto

Para rodar o projeto localmente, você precisará iniciar o backend e o frontend em terminais separados.

### 1. Rodando o Backend (API)

Acesse a pasta do backend e prepare o ambiente virtual:

```bash
cd backend

# Crie o ambiente virtual
python3 -m venv .venv

# Ative o ambiente virtual
# No Linux/macOS:
source .venv/bin/activate
# No Windows:
# .venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Inicie a aplicação
uvicorn api.main:app --reload --port 8000
```
A API estará disponível em: `http://localhost:8000`

### 2. Rodando o Frontend (Interface Web)

Em outro terminal, acesse a pasta do frontend e inicie o servidor do Vite:

```bash
cd frontend

# Instale as dependências caso seja a primeira vez
npm install

# Inicie o servidor
npm run dev
```
O frontend estará disponível em: `http://localhost:8080` (ou na porta informada pelo Vite no terminal).

---

## Funcionalidades Principais

O sistema permite filtrar e visualizar dados através de três dimensões principais:

1. **Dados Históricos**:
   - **Quantidade de Turistas por Perfil**: Gráfico de linha mostrando o fluxo de determinado perfil (ex: Família, Casal, Corporativo) ao longo do tempo.
   - **Presença dos Perfis por Serviço**: Gráfico de pizza que detalha o market share dos turistas em um serviço específico (ex: Restaurantes, Parques Aquáticos, Hotéis).
   - **Gasto Diário de turistas por perfil**: Gráfico de barras com o gasto diário dos visitantes que frequentam os estabelecimentos.

2. **Previsões (Machine Learning)**:
   - Projeta o volume futuro de turistas por perfil, exibindo o gráfico de tendências gerado pelo algoritmo Prophet, incluindo margens de incerteza da previsão.

*(Todos os gráficos são gerados no backend e devolvidos ao frontend como URLs de imagens em cache.)*
