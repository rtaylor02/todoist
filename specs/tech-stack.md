# Tech Stack

Constitution for how we build the application. Aligned with [mission.md](./mission.md) (web-only, personal-first MVP) and [requirements.md](./requirements.md).

## Repository

| Item | Value |
|------|--------|
| **Canonical remote** | [https://github.com/rtaylor02/todoist.git](https://github.com/rtaylor02/todoist.git) |
| **Default branch** | `main` |
| **Hosting platform** | GitHub (Actions for CI/CD, Environments for deploy gates) |
| **Layout** (target) | Monorepo: `backend/` (Gradle), `frontend/` (SPA), `.github/workflows/` |

Local clone should set upstream once:

```bash
git remote add origin https://github.com/rtaylor02/todoist.git
git push -u origin main
```

## Overview

| Layer | Choice |
|-------|--------|
| Language | **Java 21** |
| Build | **Gradle** (Kotlin DSL or Groovy—pick one at scaffold and keep consistent) |
| Backend | **Spring Boot 3.x** — REST API, validation, scheduling hooks for later |
| Frontend | **Separate SPA** (e.g. React or Vue)—not server-rendered pages as the primary UI |
| Persistence | **JPA/Hibernate**; **H2** for local dev, **PostgreSQL** for production |
| Auth | **OAuth2 / SSO** (e.g. Google) via **Spring Security** from the start |
| API style | REST, JSON; OpenAPI document generated or maintained alongside controllers |

## Backend

- **Spring Boot** modules: web, data-jpa, security, validation, optional springdoc-openapi.
- **Package layout** (suggested): `domain` (entities, value objects), `application` (use cases/services), `infrastructure` (JPA, OAuth adapters), `api` (REST controllers, DTOs).
- **Database migrations**: Flyway or Liquibase—schema changes are versioned, not ad hoc.
- **Profiles**: `dev` (H2), `prod` (PostgreSQL); secrets and OAuth client IDs via environment variables, never committed.

## Frontend

- SPA in its own directory (e.g. `frontend/`) with its own package manager (npm/pnpm).
- Talks to backend over HTTPS in prod; local dev uses configured API base URL and CORS on Spring.
- UI priorities for MVP: task list, task detail/edit, project sidebar, filter controls, auth login/logout flow.

## Data

| Environment | Database |
|-------------|----------|
| Local dev | H2 (in-memory or file), optional H2 console behind dev profile only |
| CI / integration tests | H2 or Testcontainers PostgreSQL |
| Production | PostgreSQL |

Entities at minimum (evolve in roadmap): `User`, `Task`, `Project`, `Label`, associations for task–label and task–project membership.

## Security

- **OAuth2 login** with Spring Security; map provider subject to internal `User`.
- **Session or token strategy**: document in API README once chosen (e.g. session cookie for same-site SPA, or JWT for API—prefer simplicity for MVP).
- **Authorization**: start with “user owns resource”; extend to team/project roles when shared projects land.
- HTTPS in production; secure cookies; CSRF policy consistent with SPA + OAuth flow.

## Integrations (later)

- Calendar and email connectors per requirements—implemented as bounded modules behind interfaces, not hard-coded in task services.
- Defer implementation until post-MVP phases in [roadmap.md](./roadmap.md); notifications/reminders infrastructure is also deferred.

## Quality and delivery

- **Tests**: JUnit 5, Spring Boot Test, Testcontainers for PostgreSQL where integration tests matter; frontend unit tests for critical components.
- **Formatting**: Spotless or similar for Java; Prettier/ESLint for frontend—configure in Phase 0 scaffold.
- **CI/CD**: GitHub Actions on [rtaylor02/todoist](https://github.com/rtaylor02/todoist)—see below.

## CI/CD

Automation runs in **GitHub Actions** on the [todoist](https://github.com/rtaylor02/todoist) repository. CI starts in Phase 0; CD is introduced after the stack is deployable (Phase 9+).

### Branch and merge policy

| Rule | Detail |
|------|--------|
| **Integration branch** | `main` is always deployable (or CI-green) |
| **Feature work** | Short-lived branches `feature/<topic>` → pull request → `main` |
| **Merge gate** | Required status checks: `backend`, `frontend` (see workflows below) |
| **Secrets** | Never commit; use GitHub **Secrets** and **Variables** (repository or environment scope) |

Recommended GitHub branch protection on `main` (enable when CI exists): require PR, require status checks, no force-push.

### Continuous integration (Phase 0+)

Workflow file: **`.github/workflows/ci.yml`**

**Triggers**

- `push` to `main`
- `pull_request` targeting `main`

**Job: `backend`**

- Runner: `ubuntu-latest`
- JDK **21** (Temurin), Gradle cache via `actions/setup-java` + `gradle/actions/setup-gradle`
- Commands: `./gradlew check` (or `test` + `build` once `check` is configured)
- Working directory: `backend/` (after scaffold)

**Job: `frontend`**

- Runner: `ubuntu-latest`
- Node.js **LTS** (e.g. 22.x), npm cache on `frontend/package-lock.json`
- Commands: `npm ci`, `npm run lint`, `npm test` (if present), `npm run build`
- Working directory: `frontend/`

Jobs run **in parallel**. PRs show both checks; merges blocked until green.

**Optional later (not Phase 0)**

- Path filters so only changed `backend/` or `frontend/` runs
- `integration` job with Testcontainers PostgreSQL (Phase 9)
- Dependency review / CodeQL on `main`

### Continuous delivery (Phase 9+)

CD stays **off** until PostgreSQL prod profile and a hosting target exist. Then add **`.github/workflows/deploy.yml`** (or split `deploy-staging.yml` / `deploy-production.yml`).

| Stage | Trigger | Purpose |
|-------|---------|---------|
| **Staging** | Push to `main` after CI passes | Smoke-test latest `main` against staging DB and OAuth redirect URIs |
| **Production** | Manual `workflow_dispatch` or GitHub **Release** tag | Controlled promotion; requires environment approval |

**GitHub Environments**

- `staging` — auto-deploy from `main`; secrets: staging DB URL, OAuth client, API base URL for SPA build
- `production` — required reviewers; secrets: prod DB URL, OAuth prod credentials

**Deploy steps (conceptual)**

1. Build backend JAR (`./gradlew bootJar`) and frontend static assets (`npm run build`).
2. Publish artifacts (GitHub Actions artifacts, container image, or platform-specific deploy).
3. Run Flyway/Liquibase migrations against target DB before or during app rollout.
4. Health check against `/api/health` post-deploy; fail workflow on non-200.

**Hosting (choose at Phase 9; document in repo README)**

- Examples: Railway, Render, Fly.io, AWS ECS, or VM + Docker Compose.
- SPA: static host (GitHub Pages, CloudFront, or CDN behind same domain) with API on subdomain.
- PostgreSQL: managed provider (Neon, RDS, Supabase, etc.); connection string only in secrets.

Until hosting is chosen, **CI-only** is sufficient: every merge to `main` is validated, not automatically published.

### Secrets inventory (repository / environments)

| Secret | Used by | Phase |
|--------|---------|-------|
| `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` | Backend + deploy | 2+ |
| `DATABASE_URL` (JDBC) | Staging/prod deploy | 9+ |
| `SESSION_SECRET` or JWT signing key | Backend prod | 2+ |
| Frontend build: `VITE_API_URL` / `REACT_APP_API_URL` | SPA build in CD | 9+ |

OAuth redirect URIs must include staging and production callback URLs registered with the identity provider.

### Local parity

- Developers run the same Gradle and npm commands as CI before pushing.
- Optional: `docker compose up` for local PostgreSQL (documented in Phase 9), not required for Phase 0 CI (H2 in tests).

## Explicitly not chosen

- JavaFX or desktop UI.
- Plain Java without Spring (framework supports velocity and security).
- In-memory-only persistence for production.
- Stub auth replaced later—OAuth2/SSO from the start per constitution.

## Reference

Requirements and acceptance criteria: [requirements.md](./requirements.md).

Repository: [github.com/rtaylor02/todoist](https://github.com/rtaylor02/todoist).
