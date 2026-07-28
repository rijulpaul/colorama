# Colorama API

Backend service for the Colorama design assistant. Built with **Elysia** on **Bun**, using **MongoDB**, **Redis**, and **LangChain**.

## Project structure

```
apps/api/
├── src/
│   ├── index.ts                 # Application bootstrap & graceful shutdown
│   ├── app.ts                   # Elysia app composition (plugins, routes)
│   ├── config/
│   │   └── env.ts               # Typed environment validation (Zod)
│   ├── infrastructure/          # External service clients
│   │   ├── ai/
│   │   │   └── langchain.ts     # LangChain model factories
│   │   ├── cache/
│   │   │   └── redis.ts         # Redis client
│   │   └── database/
│   │       └── mongodb.ts       # MongoDB / Mongoose connection
│   ├── lib/
│   │   └── logger.ts            # Structured JSON logging
│   ├── middleware/
│   │   └── error-handler.ts     # Global error handling
│   ├── models/                  # Mongoose schemas & models
│   │   └── session.model.ts
│   ├── modules/                 # Feature modules (routes + services)
│   │   ├── ai/
│   │   │   ├── ai.routes.ts
│   │   │   ├── ai.schema.ts
│   │   │   └── ai.service.ts
│   │   └── health/
│   │       └── health.routes.ts
│   └── types/
│       └── index.ts             # Shared API types
├── .env.example
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

## Prerequisites

- [Bun](https://bun.sh) (runtime)
- Docker (for MongoDB, Redis, Ollama, Weaviate)

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Start infrastructure from the repo root:

```bash
docker compose up -d mongodb redis ollama
```

3. Install dependencies from the repo root:

```bash
npm install
```

4. Run the API:

```bash
npm run dev --workspace=api
# or from this directory:
bun run dev
```

The server starts at `http://localhost:3001`.

## Endpoints

| Method | Path            | Description                     |
| ------ | --------------- | ------------------------------- |
| GET    | `/`             | API metadata                    |
| GET    | `/health`       | Liveness probe                  |
| GET    | `/health/ready` | Readiness probe (Mongo + Redis) |
| POST   | `/ai/chat`      | Chat with the design assistant  |
| GET    | `/docs`         | Swagger UI                      |

### Example: chat request

```bash
curl -X POST http://localhost:3001/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Suggest a calm palette for a wellness app"}'
```

## Scripts

| Script        | Description             |
| ------------- | ----------------------- |
| `dev`         | Start with hot reload   |
| `start`       | Start production server |
| `build`       | Bundle to `dist/`       |
| `check-types` | Run TypeScript checks   |
| `lint`        | Run ESLint              |

## Adding a new feature module

1. Create `src/modules/<feature>/` with:
   - `<feature>.schema.ts` — Zod request/response schemas
   - `<feature>.service.ts` — Business logic
   - `<feature>.routes.ts` — Elysia routes
2. Add Mongoose models under `src/models/` if persistence is needed.
3. Register routes in `src/app.ts`.

## LLM configuration

- **Ollama (default):** Set `OLLAMA_BASE_URL` and `OLLAMA_MODEL`. Requires the Ollama container.
- **OpenAI:** Set `OPENAI_API_KEY`. OpenAI takes precedence when present.
