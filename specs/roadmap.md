# Roadmap

High-level implementation order in **very small phases** (roughly 1–3 days each). Each phase should end in something demonstrable or mergeable. Sequencing follows [mission.md](./mission.md): **scaffold → personal tasks → organization → team → integrations**; **notifications/reminders deferred**.

Tech choices: [tech-stack.md](./tech-stack.md).

**Repository:** [https://github.com/rtaylor02/todoist.git](https://github.com/rtaylor02/todoist.git) — all phases land here via PRs to `main`. CI/CD plan: [tech-stack.md#cicd](./tech-stack.md#cicd).

---

## Phase 0 — Scaffold, repository, and CI

- Initialize monorepo and **first push** to [rtaylor02/todoist](https://github.com/rtaylor02/todoist) (`main`).
- Gradle: `backend/` (Spring Boot 3, Java 21).
- `frontend/` SPA skeleton (React or Vue—choose at kickoff).
- Health endpoint (`GET /api/health`) and static “hello” page calling it.
- **GitHub Actions** — `.github/workflows/ci.yml`:
  - Trigger: `push` to `main`, `pull_request` → `main`
  - Parallel jobs: `backend` (`./gradlew check`), `frontend` (`npm ci`, lint, build)
- README: clone URL, how to run backend/frontend, how to read CI status on PRs.
- Optional: branch protection on `main` requiring `backend` + `frontend` checks.

**Done when:** clone from GitHub → run both apps locally → open a PR and see green CI on [Actions](https://github.com/rtaylor02/todoist/actions).

---

## Phase 1 — Dev database and migrations

- Flyway/Liquibase wired; H2 under `dev` profile.
- Empty schema migration v1; application starts cleanly.

**Done when:** `./gradlew bootRun` applies migrations with no errors.

---

## Phase 2 — OAuth2 / SSO login

- Spring Security OAuth2 client (e.g. Google); dev redirect URIs documented.
- `User` entity + persistence; login creates or loads user.
- SPA: login button, callback handling, authenticated shell (logout).

**Done when:** user can sign in and see a protected placeholder page.

---

## Phase 3 — Domain: Task (personal)

- `Task` entity: title, description, status, owner, timestamps.
- Repository + service + `POST/GET/PATCH/DELETE` for **current user’s tasks only**.
- SPA: list tasks, create, complete, delete.

**Done when:** acceptance “create a task” works for one signed-in user.

---

## Phase 4 — Domain: Project (personal)

- `Project` entity; tasks belong to a project.
- CRUD projects; assign task to project on create/update.
- SPA: project list + filter task list by project.

**Done when:** “create a task in a project with a due date” is possible (due date in Phase 5 if splitting further).

---

## Phase 5 — Due dates and priorities

- Due date (and optional time zone policy) on `Task`.
- Priority enum or integer; sort/filter in API.
- SPA: date picker, priority selector, sort by due date/priority.

**Done when:** user can set due date and priority on personal tasks.

---

## Phase 6 — Labels

- `Label` entity; many-to-many task–label.
- API assign/remove labels; filter tasks by label.
- SPA: label chips, label filter.

**Done when:** acceptance “filter by label” works for personal tasks.

---

## Phase 7 — Filters (basic)

- Query params or filter resource: project, label, priority, date range, status.
- SPA: filter bar matching Todoist-like basics (not full filter language).

**Done when:** acceptance “filter by label, priority, and date” works.

---

## Phase 8 — Search

- Search endpoint (title/description); indexed or DB `LIKE` for MVP.
- SPA: search box with debounced results.

**Done when:** user can find tasks quickly across personal projects.

---

## Phase 9 — PostgreSQL, prod profile, and CD foundation

- `prod` profile + PostgreSQL datasource; Testcontainers test for one critical path.
- Docker Compose optional for local Postgres.
- Document env vars for deploy.
- **CI:** optional `integration` job in `ci.yml` (Testcontainers PostgreSQL).
- **CD:** add `.github/workflows/deploy.yml`; GitHub Environments `staging` / `production`; secrets for `DATABASE_URL`, OAuth, API URL for SPA build.
- Choose hosting; staging deploy on green `main`; production via manual approval or release tag.

**Done when:** same features run against Postgres in CI; staging deploy succeeds and `/api/health` returns 200.

---

## Phase 10 — Comments (personal tasks)

- `Comment` on task; author, body, timestamp.
- API + SPA thread on task detail.

**Done when:** Mary’s story “attach comments” works on owned tasks.

---

## Phase 11 — Team and shared projects

- Team/space concept; project visibility `personal` vs `shared`.
- Invite or membership model; members can view shared project tasks.
- Authorization rules beyond owner-only.
- SPA: shared project indicator; separate personal vs team views.

**Done when:** acceptance “team shares a project and all members can view it” and “separate personal from team tasks.”

---

## Phase 12 — Assignments and collaboration

- Assign task to another user (optional for MVP+); activity on shared tasks.
- Refine roles if needed (viewer vs editor).

**Done when:** Susan/Steve shared stories for collaboration are minimally satisfied.

---

## Phase 13 — Recurring tasks

- Recurrence rule on task (simple RRULE or preset: daily/weekly).
- Generation or display of next occurrence (scope TBD in implementation note).

**Done when:** Steve’s recurring campaign deadlines can be modeled at basic level.

---

## Phase 14 — External integration (one)

- Pluggable integration interface; first connector (e.g. calendar read-only or email stub).
- Config per user; OAuth or API key stored securely.

**Done when:** acceptance “connect at least one external integration.”

---

## Phase 15+ — Deferred and department features

| Item | Notes |
|------|--------|
| **Reminders & notifications** | Explicitly deferred; design after Phase 14 |
| Advanced filter language | Post-MVP |
| Dependencies between tasks | Susan; post shared projects |
| Sprint/engineering views | Mary; post core filters |
| Campaign assets / attachments | Steve; post comments |
| Full integration suite | Calendar + email + more |

---

## Dependency graph (simplified)

```mermaid
flowchart LR
  P0[Phase 0 Scaffold] --> P1[Phase 1 DB]
  P1 --> P2[Phase 2 OAuth]
  P2 --> P3[Phase 3 Tasks]
  P3 --> P4[Phase 4 Projects]
  P4 --> P5[Phase 5 Dates Priority]
  P5 --> P6[Phase 6 Labels]
  P6 --> P7[Phase 7 Filters]
  P7 --> P8[Phase 8 Search]
  P8 --> P9[Phase 9 Postgres]
  P9 --> P10[Phase 10 Comments]
  P10 --> P11[Phase 11 Shared projects]
  P11 --> P12[Phase 12 Collaboration]
  P12 --> P13[Phase 13 Recurring]
  P13 --> P14[Phase 14 Integration]
  P14 --> P15[Phase 15+ Notifications etc]
```

---

## How to use this roadmap

- Treat each phase as a small PR or series of commits.
- Do not start team features (Phase 11+) until personal flows (Phases 3–8) pass manual smoke tests.
- Revisit phase boundaries if a phase exceeds ~3 days—split further, don’t swell scope.

Requirements traceability: [requirements.md](./requirements.md).

CI/CD detail: [tech-stack.md#cicd](./tech-stack.md#cicd) · Repository: [github.com/rtaylor02/todoist](https://github.com/rtaylor02/todoist).
