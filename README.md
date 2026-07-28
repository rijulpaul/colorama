# Colorama

AI-powered design tool for color palette generation, design suggestions, visual asset creation, palette extraction from images, and scenario visualization — all through vector search and AI agents via OpenRouter.

**Stack**: TypeScript / Next.js 16 / React 19 / Tailwind 4 (frontend) + Elysia / Bun (API) + Python / FastAPI (vector service) + Weaviate (vector DB)

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Browser   │────▶│  Next.js    │────▶│     Elysia      │
│   (User)    │     │   (Web)     │     │     (API)       │
└─────────────┘     └─────────────┘     └────────┬────────┘
                                                  │
                    ┌─────────────────────────────┼─────────────────────────────┐
                    ▼                             ▼                             ▼
             ┌─────────────┐              ┌─────────────┐              ┌─────────────┐
             │   Agent     │─────────────▶│  Vector Svc │◀────────────▶│  Weaviate   │
             │  (Bun/TS)   │ tool calls   │  (FastAPI)  │  embeddings  │  (Vector DB)│
             └──────┬──────┘              └─────────────┘              └─────────────┘
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │  Redis  │ │ Clerk   │ │Postgres │
    │(Rate    │ │(Auth)   │ │(User DB)│
    │ Limit)  │ └─────────┘ └─────────┘
    └─────────┘
```

### Data Flow Examples

**Text → Palette (Agent Chat)**

```
User: "sunset colors for a travel app"
    │
    ▼
Frontend (SSE) ──▶ API (/agent/stream) ──▶ Agent
    │                                       │
    │                                       ▼
    │                              Tool: refine_query
    │                                       │
    │                                       ▼
    │                              Tool: search_colors ──▶ Vector Service ──▶ Weaviate
    │                                       │
    │                                       ▼
    │                              Tool: generate_palette ──▶ OpenRouter
    │                                       │
    ◀───────────────────────────────────────┘
    │
    ▼
Stream tokens to chat UI
```

**Image → Palette**

```
Upload image → S3 (presigned URL)
    │
    ▼
Agent: extract_colors → Extraction Service (k-means)
    │
    ▼
Enrich with color names (vector search)
    │
    ▼
Return palette to user
```

**Scenario Visualization**

```
Saved palette → Click "Visualize" → Select template
    │
    ▼
API /scenarios/render → Renderer (Canvas/SVG)
    │
    ▼
Returns preview URL → Frontend displays
```

---

## Monorepo Structure

```
colorama/
├── apps/
│   ├── web/          # Next.js 16 frontend (React 19, Tailwind 4, Clerk)
│   ├── api/          # Elysia/Bun API backend (OpenAPI, Zod, Redis rate limit)
│   ├── vector/       # FastAPI/Python vector service (embeddings, Weaviate)
│   └── agent/        # Bun/TypeScript AI agent (OpenRouter, tool calling, SSE)
├── packages/
│   ├── ui/           # Shared React components (Tailwind 4)
│   ├── eslint-config/ # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
├── services/
│   └── vectorize/    # Python embedding pipeline (DVC, model benchmarking)
├── specs/            # All planning documents (see below)
├── docker-compose.yaml
├── .env              # Single environment file for all services
├── .env.example      # Template for environment variables
├── turbo.json
└── package.json
```

---

## Specs Documentation

All planning documents live in `specs/` following the bigpowers spec-driven workflow:

| Layer        | File                                        | Purpose                                     |
| ------------ | ------------------------------------------- | ------------------------------------------- |
| Session      | `state.yaml`                                | Active flow, epic, git state                |
| Release      | `release-plan.yaml`                         | Epic list, WSJF, BCPs, milestones           |
| Progress     | `execution-status.yaml`                     | Story/epic/task status                      |
| Scope        | `product/SCOPE_LATEST.yaml`                 | In/out of scope, phases                     |
| Vision       | `product/VISION_LATEST.yaml`                | North star, success metrics, journeys       |
| Glossary     | `product/GLOSSARY_LATEST.yaml`              | Domain terms                                |
| Architecture | `tech-architecture/tech-stack.md`           | Stack & modules                             |
| Design       | `tech-architecture/DESIGN_PLAN_LATEST.md`   | Detailed system design                      |
| Impact       | `tech-architecture/IMPACT_LATEST.md`        | Performance, scalability, reliability, cost |
| Refactor     | `tech-architecture/REFACTOR_LATEST.md`      | Planned/in-progress refactors               |
| Security     | `tech-architecture/SECURITY_PLAN_LATEST.md` | Threat model, controls, compliance          |
| Test         | `tech-architecture/TEST_PLAN_LATEST.md`     | Testing strategy by service                 |
| ADRs         | `adr/`                                      | Architectural decisions                     |
| Bugs         | `bugs/`                                     | Bug investigations                          |
| Epics        | `epics/*/epic.yaml`                         | Epic breakdown with stories/tasks           |

---

## 🚀 Development Setup (Updated for Single .env File)

### Prerequisites

- **Bun** (v1.0+) - for JavaScript/TypeScript apps
- **Node.js** (v18+) - alternative runtime
- **Python** (v3.11+) - for vector service and embedding pipeline
- **uv** (optional but recommended) - for Python package management
- **Docker** & **docker-compose** - for local development (Weaviate, Redis, Postgres)
- **Git**

### Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd colorama

# 2. Install JavaScript/TypeScript dependencies (all apps and packages)
#    This will also install Python dependencies via postinstall script using uv
npm install
# OR
bun install  # Recommended for faster installs

# 3. Setup environment variables (SINGLE .env file at project root)
cp .env.example .env
# Edit .env with your values (see below for required variables)

# 4. Start infrastructure services (Weaviate, Redis, Postgres)
docker compose up -d weaviate redis postgres

# 5. Start all application services
npm run dev
# OR
bun run dev

# Services will be available at:
# - Web: http://localhost:3000
# - API: http://localhost:3001
# - Vector Service: http://localhost:8000
# - Agent: http://localhost:3002
```

### Alternative: Individual Service Startup

```bash
# Web (Next.js)
cd apps/web && bun run dev

# API (Elysia/Bun)
cd apps/api && bun run dev

# Vector Service (FastAPI/Python)
cd apps/vector && python src/app.py  # Assumes .env is in root and Python deps installed

# Agent (Bun)
cd apps/agent && bun run dev
```

---

## Docker (Recommended for Full Stack)

```bash
# Start all services (including infrastructure)
docker compose up -d

# View logs for specific service
docker compose logs -f api

# Stop all services
docker compose down

# Rebuild images after code changes
docker compose up -d --build
```

> **Note**: With a single `.env` file at the project root, Docker Compose will automatically pass these variables to all services that reference them in their configuration.

---

## Environment Variables (Single .env File)

All services read from the **single `.env` file at the project root**. Copy `.env.example` to `.env` and fill in the values.

### Required Variables

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_key_here

# AI Services
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# Vector Database
WEAVIATE_URL=http://weaviate:8080
WEAVIATE_GRPC_PORT=50051

# Infrastructure
REDIS_URL=redis://redis:6379
DATABASE_URL=sqlite://./dev.db  # or postgresql://user:pass@postgres:5432/dbname

# Application URLs (for internal service communication)
API_URL=http://api:3001
VECTOR_SERVICE_URL=http://vector:8000
AGENT_URL=http://agent:3002
FRONTEND_URL=http://web:3000

# Optional: AWS S3 for image storage (for production)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_S3_BUCKET=
# AWS_REGION=us-east-1
```

### Common Variables Reference

| Variable                            | Purpose                               | Services Using       |
| ----------------------------------- | ------------------------------------- | -------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key                    | web                  |
| `CLERK_SECRET_KEY`                  | Clerk backend secret                  | api, web (SSR)       |
| `OPENROUTER_API_KEY`                | OpenRouter API key                    | agent                |
| `OPENROUTER_BASE_URL`               | OpenRouter API base                   | agent                |
| `DEFAULT_MODEL`                     | Default LLM model                     | agent                |
| `WEAVIATE_URL`                      | Weaviate HTTP endpoint                | vector, api, agent   |
| `WEAVIATE_GRPC_PORT`                | Weaviate gRPC port                    | vector               |
| `REDIS_URL`                         | Redis connection string               | api, agent           |
| `DATABASE_URL`                      | Database connection (SQLite/Postgres) | api                  |
| `API_URL`                           | Internal API service URL              | web, agent           |
| `VECTOR_SERVICE_URL`                | Internal vector service URL           | api, agent           |
| `AGENT_URL`                         | Internal agent service URL            | api, web             |
| `FRONTEND_URL`                      | Internal frontend URL                 | api, agent           |
| `AWS_ACCESS_KEY_ID`                 | AWS S3 access key                     | vectorize (optional) |
| `AWS_SECRET_ACCESS_KEY`             | AWS S3 secret key                     | vectorize (optional) |
| `AWS_S3_BUCKET`                     | AWS S3 bucket name                    | vectorize (optional) |
| `AWS_REGION`                        | AWS region                            | vectorize (optional) |

---

## 📦 Dependency Management

### JavaScript/TypeScript (Bun/npm)

- Root `package.json` uses workspaces to manage all JS/TS packages
- Run `npm install` or `bun install` from root to install everything
- Individual apps can be managed with `npm run <command>` or `bun run <command>`

### Python (uv/venv)

- **Vector Service** (`apps/vector/`): Uses `requirements.txt` with `uv` or `pip`
- **Embedding Pipeline** (`services/vectorize/`): Uses `pyproject.toml` with `uv`
- **Note**: The `postinstall` script in the root `package.json` automatically handles Python dependency installation using `uv` when you run `npm install` or `bun install`
- **Alternative**: Use standard venv + pip

  ```bash
  python -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  ```

---

## Development Commands

Run from project root unless specified:

```bash
# Install all JS/TS and Python dependencies
npm install

# Start all services in development mode
npm run dev

# Build all packages for production
npm run build

# Lint all packages
npm run lint

# Type check all packages
npm run check-types

# Run all tests
npm run test

# Preflight (MUST PASS BEFORE MERGE)
npm run test && npm run lint && npm run build

# Format code
npm run format

# Individual service commands
npm run dev --filter=web       # Next.js dev server
npm run dev --filter=api       # Elysia API dev server
npm run dev --filter=agent     # Agent dev server
# For vector service, see above (Python)
```

---

## Docker Services Reference

| Service  | Container | Port                      | Purpose                         |
| -------- | --------- | ------------------------- | ------------------------------- |
| weaviate | weaviate  | 8080 (HTTP), 50051 (gRPC) | Vector database                 |
| redis    | redis     | 6379                      | Caching & rate limiting         |
| postgres | postgres  | 5432                      | User database (optional)        |
| web      | nextjs    | 3000                      | Frontend (Next.js)              |
| api      | elysia    | 3001                      | Backend API (Elysia/Bun)        |
| vector   | fastapi   | 8000                      | Vector service (FastAPI/Python) |
| agent    | bun       | 3002                      | AI agent (Bun/TS)               |

> **Note**: With a single `.env` file at the project root, Docker Compose automatically injects these variables into services using `${VAR_NAME}` syntax in `docker-compose.yml`.

---

## Key Development Notes

1. **Single Environment File**: All services read from the root `.env` file. No need for individual `.env` files in each service directory.
2. **Python Dependencies**: The `postinstall` script in `package.json` automatically installs Python dependencies using `uv` when you run `npm install` or `bun install`.
3. **Database**: For development, SQLite is used by default (`DATABASE_URL=sqlite://./dev.db`). To use PostgreSQL, set `DATABASE_URL=postgresql://user:pass@postgres:5432/dbname` and ensure the Postgres container is running.
4. **Hot Reloading**:
   - JS/TS services (web, api, agent) use Bun's watch mode for instant reloads
   - Python vector service requires manual restart after code changes (or use tools like `watchdog`)
5. **Testing**:
   - JS/TS: Vitest (`npm run test`)
   - Python: Pytest (run in respective service directories)
   - E2E: Playwright tests (coming soon)

---

## License

MIT — Built for portfolio/resume but engineered as production-grade AWS deployment.
