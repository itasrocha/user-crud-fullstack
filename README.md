# Aplicação Full-Stack de Gerenciamento de Usuários

Uma aplicação web full-stack moderna para gerenciamento de usuários com autenticação, construída com **React (Frontend)** e **FastAPI (Backend)**.

## 🏗 Arquitetura

O projeto segue uma arquitetura modular e escalável:

### Frontend (React + TypeScript)
- **Framework**: React com Vite
- **Biblioteca de UI**: Chakra UI
- **Gerenciamento de Estado**: React Query (Estado do Servidor), Context API (Estado de Autenticação)
- **Estrutura**: Arquitetura baseada em features (conceitos de Domain Driven Design)
  - `features/`: Contém código específico do domínio (auth, users)
  - `components/`: Componentes de UI compartilhados
  - `pages/`: Componentes de rota
  - `services/`: Integração com API

### Backend (FastAPI + Python)
- **Framework**: FastAPI
- **Banco de Dados**: PostgreSQL (Async via SQLAlchemy + asyncpg)
- **Autenticação**: JWT (JSON Web Tokens) com fluxo de senha OAuth2
- **Estrutura**: Arquitetura em camadas
  - `api/`: Manipuladores de rota e dependências
  - `core/`: Configuração e segurança
  - `services/`: Lógica de negócios
  - `repositories/`: Camada de acesso ao banco de dados
  - `schemas/`: Modelos Pydantic para validação
  - `models/`: Modelos de banco de dados SQLAlchemy

### Banco de Dados
- **PostgreSQL**: Banco de dados relacional rodando em um container Docker.

---

## 🚀 Começando com Docker

Você pode rodar toda a stack usando Docker Compose.

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Executando a Aplicação

1. **Clone o repositório** (se ainda não o fez):
   ```bash
   git clone <url-do-repositorio>
   cd <pasta-do-repositorio>
   ```

2. **Inicie os containers**:
   Rode o seguinte comando no diretório raiz:
   ```bash
   docker-compose up --build
   ```

   Isso iniciará três serviços:
   - `database` (PostgreSQL)
   - `backend` (FastAPI)
   - `frontend` (React)

3. **Acesse a Aplicação**:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Docs da API Backend**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Banco de Dados**: Porta `5432`

### Parando a Aplicação

Para parar os containers, pressione `Ctrl+C` no terminal ou rode:
```bash
docker-compose down
```

### Variáveis de Ambiente

A aplicação vem com variáveis de ambiente padrão configuradas no `docker-compose.yml` para conveniência de desenvolvimento.

**Backend (`docker-compose.yml`)**:
- `DATABASE_URL`: `postgresql+asyncpg://user_admin:password123@database:5432/user_db`

**Frontend**:
- Usa a configuração padrão do Vite. Certifique-se de que a URL do backend esteja configurada corretamente se rodar fora da rede do Docker (padrão é `http://localhost:8000`).
