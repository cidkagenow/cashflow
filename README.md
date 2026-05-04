# IASSAT PayFlow

Milestone-based collections management platform for B2B professional services firms. Track project milestones through a 12-state financial lifecycle, manage deliverables, reconcile payments, and maintain a full audit trail.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM v6
- **Database:** SQLite
- **Testing:** Jest (unit/integration), Playwright (e2e)
- **Package Manager:** pnpm

## Key Features

- **12 Financial States** — Milestones follow a strict state machine: Configurado → Bloqueado → Exigible → Notificado → EnMora → CompromisoPago → PagadoParcial → PagoEnRevision → PagoObservado → Pagado → Conciliado, with Suspendido as a side state
- **6 Technical States** — Deliverables track their own lifecycle: Pendiente → EnCurso → Terminado → Observado → Subsanacion → Aprobado
- **6 Project States** — Borrador → PendienteAdelanto → EnCurso → Pausado → Finalizado → Cancelado
- **State Machine Validation** — All transitions are validated server-side; invalid transitions are rejected
- **Partial Payments** — Support for multiple partial payments per milestone with automatic status updates
- **Payment Reconciliation** — Two-column reconciliation interface with cascade updates to milestone status
- **Suspension Workflow** — Suspend milestones with mandatory reason tracking, reactivate when ready
- **Audit Trail** — Every state change is logged with user, timestamp, previous/new state, and reason
- **Dashboard** — Executive KPIs, overdue alerts, analyst effectiveness chart, reconciliation feed

## Prerequisites

- Node.js >= 20
- pnpm >= 9

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Set up the database
cp .env.example .env   # or create .env with: DATABASE_URL="file:./dev.db"
npx prisma migrate dev

# 3. Seed the database with sample data
pnpm seed

# 4. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the project root:

```
DATABASE_URL="file:./dev.db"
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm seed` | Seed the database with sample data |
| `pnpm db:reset` | Wipe and re-seed the database |
| `pnpm test` | Run Jest tests (141 unit/integration tests) |
| `pnpm test:e2e` | Run Playwright e2e tests (26 tests, needs dev server) |

## Project Structure

```
app/
  page.tsx                    # Dashboard
  projects/                   # Project list, detail, create
  milestones/                 # Portfolio grid with filters
  reconciliation/             # Payment reconciliation
  automation/                 # Rules and templates
  api/
    dashboard/                # KPIs, alerts, effectiveness
    projects/                 # CRUD + state transitions
    milestones/               # List + individual transitions
    deliverables/             # CRUD + technical transitions
    reconciliation/           # Payment reconciliation with cascade
    audit/                    # Audit log viewer
    clients/                  # Client list
    analysts/                 # Analyst list
    automation/               # Templates and rules

lib/
  state-machine.ts            # All state transition rules
  audit.ts                    # Audit logging utility
  prisma.ts                   # Prisma client singleton

prisma/
  schema.prisma               # Database schema
  seed.ts                     # Sample data (12 projects, 39 milestones)

__tests__/                    # Jest tests
e2e/                          # Playwright tests
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard KPIs, alerts, stats |
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project with milestones |
| GET | `/api/projects/:id` | Project detail with milestones, deliverables, audit |
| PATCH | `/api/projects/:id` | Project state transition |
| GET | `/api/milestones` | List milestones (filterable by status/analyst) |
| GET | `/api/milestones/:id` | Milestone detail with valid transitions |
| PATCH | `/api/milestones/:id` | Financial state transition |
| GET | `/api/deliverables` | List deliverables |
| PATCH | `/api/deliverables/:id` | Technical state transition |
| GET | `/api/reconciliation` | Pending payments |
| PATCH | `/api/reconciliation` | Reconcile/observe payment (cascades to milestone) |
| GET | `/api/audit` | Audit logs (filterable by project/milestone) |
