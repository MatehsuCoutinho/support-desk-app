# 🎫 Support Desk App

> Mini helpdesk fullstack com autenticação JWT, controle de permissões por roles, tickets e comentários.

**Backend:** Node.js · TypeScript · Express · Prisma · PostgreSQL · Docker  
**Frontend:** React · TypeScript · Vite · Axios · CSS puro

---

## Índice

- [Visão geral](#visão-geral)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Arquitetura](#arquitetura)
- [Backend — setup e endpoints](#backend--setup-e-endpoints)
- [Frontend — setup e estrutura](#frontend--setup-e-estrutura)
- [Documentação interativa (Swagger)](#documentação-interativa-swagger)
- [Exemplos de requests (curl)](#exemplos-de-requests-curl)
- [Segurança](#segurança)

---

## Visão geral

O Support Desk App é um sistema de tickets de suporte com:

- Autenticação via JWT (register / login)
- Roles: `USER`, `AGENT`, `ADMIN`
- Tickets com `title`, `description` e `status` (`OPEN`, `IN_PROGRESS`, `CLOSED`)
- Comentários vinculados a tickets, com validação de permissão por role
- Backend dockerizado com PostgreSQL
- Frontend React com rotas protegidas, dashboard de métricas e gerenciamento inline de tickets

---

## Tech stack

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js >= 20 | Runtime |
| TypeScript | Tipagem |
| Express | Framework HTTP |
| Prisma | ORM |
| PostgreSQL | Banco de dados |
| bcrypt | Hash de senhas |
| jsonwebtoken | Autenticação JWT |
| express-rate-limit | Throttling nas rotas de auth |
| Docker + docker-compose | Containerização |
| ts-node-dev | Dev server com hot reload |

### Frontend
| Tecnologia | Uso |
|---|---|
| React + TypeScript | UI |
| Vite | Bundler |
| react-router-dom | Roteamento |
| Axios | HTTP client com interceptor |
| Chart.js | Gráficos do dashboard |
| CSS puro | Estilização |

---

## Features

### Backend
- Registro e login com geração de JWT
- Middleware de autenticação (`authMiddleware`) e guard de roles (`roleMiddleware`)
- Prisma models: `User`, `Ticket`, `Comment` com enums `Role` e `TicketStatus`
- Tickets: criar, listar (com filtro por `status`), atualizar status via `PATCH`
- Comments: criar e listar — `USER` só interage com seus próprios tickets; `AGENT`/`ADMIN` acessam qualquer um
- Rate limiting nas rotas de auth
- Migrations automáticas no startup via docker-compose

### Frontend
- Login e Register integrados com o backend
- `AuthContext` com `token`, `user`, `loading`, `login()` e `logout()`
- `PrivateRoute` que aguarda o loading antes de redirecionar
- Navbar com nome do usuário e botão de logout
- Dashboard com cards de métricas e gráfico de distribuição por status
- `TicketsList`: listagem, criação e atualização de status com comentários inline
- `CommentsSection`: listar e criar comentários por ticket
- Axios centralizado em `src/services/api.ts` com interceptor de token

---

## Arquitetura

```
/support-desk-app
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── tickets/
│   │   │   └── comments/
│   │   ├── middlewares/
│   │   ├── database/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── Dashboard.tsx
│       │   ├── TicketsList.tsx
│       │   └── CreateTicket.tsx
│       ├── components/
│       │   └── DashboardCard.tsx
│       ├── services/
│       │   ├── api.ts
│       │   ├── auth.service.ts
│       │   └── tickets.service.ts
│       ├── context/
│       │   └── AuthContext.tsx
│       └── modules/
│           └── comments/
│               ├── commentsService.ts
│               └── CommentsSection.tsx
│
├── docker-compose.yml
└── README.md
```

---

## Backend — setup e endpoints

### Arquivo `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/support_desk"
JWT_SECRET="supersecretkey"
JWT_EXPIRES_IN="1d"
```

> Para desenvolvimento local sem Docker, substitua `@db` por `@localhost` na `DATABASE_URL`.

### Schema Prisma (resumo)

```prisma
enum Role         { USER AGENT ADMIN }
enum TicketStatus { OPEN IN_PROGRESS CLOSED }

model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(USER)
  tickets   Ticket[]
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Ticket {
  id          String       @id @default(uuid())
  title       String
  description String
  status      TicketStatus @default(OPEN)
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  comments    Comment[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

### Comandos úteis

```bash
# Instalar dependências
cd backend && npm install

# Gerar Prisma client
npx prisma generate

# Rodar em desenvolvimento (local)
npm run dev

# Criar e migrar banco (local)
npx prisma migrate dev --name init

# Subir tudo via Docker (recomendado)
docker compose up --build
```

> O `docker-compose.yml` sobe dois serviços: `db` (PostgreSQL 15) e `api` (porta `3333`). O startup da API roda `npx prisma migrate deploy` automaticamente.

### Endpoints

Base URL: `http://localhost:3333`

#### Auth

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/register` | Registra novo usuário | ❌ |
| `POST` | `/auth/login` | Autentica e retorna JWT | ❌ |
| `GET` | `/auth/me` | Retorna dados do usuário logado | ✅ |

**Body — register / login:**
```json
{ "name": "Matheus", "email": "matheus@example.com", "password": "123456" }
```

#### Tickets

| Método | Rota | Descrição | Role mínima |
|--------|------|-----------|-------------|
| `POST` | `/tickets` | Cria novo ticket | USER |
| `GET` | `/tickets` | Lista tickets (`?status=OPEN`) | USER |
| `PATCH` | `/tickets/:id/status` | Atualiza status do ticket | AGENT / ADMIN |

**Body — criar ticket:**
```json
{ "title": "Erro no login", "description": "Não consigo acessar minha conta." }
```

**Body — atualizar status:**
```json
{ "status": "IN_PROGRESS" }
```

> `USER` lista apenas seus próprios tickets. `AGENT` e `ADMIN` visualizam todos.

#### Comments

| Método | Rota | Descrição | Role mínima |
|--------|------|-----------|-------------|
| `POST` | `/comments/:ticketId` | Cria comentário no ticket | USER |
| `GET` | `/comments/:ticketId` | Lista comentários do ticket | USER |

> `USER` só pode comentar e visualizar comentários de seus próprios tickets.

---

## Frontend — setup e estrutura

```bash
cd frontend
npm install
npm run dev
# Disponível em http://localhost:5173
```

### Axios central (`src/services/api.ts`)

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### AuthContext

Responsável por manter o estado de autenticação global:

- Inicializa lendo o token do `localStorage`
- Injeta o header `Authorization` no Axios
- Busca os dados do usuário via `GET /auth/me`
- Expõe `token`, `user`, `loading`, `login(token)` e `logout()`

### Rotas

| Rota | Componente | Proteção |
|------|-----------|----------|
| `/login` | `Login.tsx` | Pública |
| `/register` | `Register.tsx` | Pública |
| `/` | `Dashboard.tsx` | Privada |
| `/tickets` | `TicketsList.tsx` | Privada |
| `/tickets/new` | `CreateTicket.tsx` | Privada |

---

## Documentação interativa (Swagger)

A API conta com documentação interativa via **Swagger UI**, disponível após subir o backend:

```
http://localhost:3333/api-docs
```

Nela você pode visualizar todos os endpoints, seus parâmetros, schemas de request/response e testar as chamadas diretamente pelo navegador, inclusive com autenticação JWT.

---

## Exemplos de requests (curl)

**Registrar usuário**
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Matheus","email":"matheus@example.com","password":"123456"}'
```

**Login**
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"matheus@example.com","password":"123456"}'
```

**Dados do usuário logado**
```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3333/auth/me
```

**Criar ticket**
```bash
curl -X POST http://localhost:3333/tickets \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Erro no login","description":"Não consigo logar"}'
```

**Listar tickets**
```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3333/tickets

# Com filtro de status
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:3333/tickets?status=OPEN"
```

**Atualizar status**
```bash
curl -X PATCH http://localhost:3333/tickets/<TICKET_ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

**Criar comentário**
```bash
curl -X POST http://localhost:3333/comments/<TICKET_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Estamos verificando o problema."}'
```

**Listar comentários**
```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3333/comments/<TICKET_ID>
```

---

## Segurança

- Senhas armazenadas com hash via **bcrypt**
- Autenticação stateless com **JWT** (secret via `.env`)
- **Rate limiting** nas rotas de auth para prevenir brute force
- Middleware de **role guard** protegendo rotas sensíveis
- `USER` isolado dos dados de outros usuários em tickets e comentários
