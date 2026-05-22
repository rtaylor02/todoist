# Todoist

Web-based task management (Todoist-inspired). Monorepo: Spring Boot API + React SPA.

**Repository:** [https://github.com/rtaylor02/todoist](https://github.com/rtaylor02/todoist)

## Clone

```bash
git clone https://github.com/rtaylor02/todoist.git
cd todoist
```

## Prerequisites

- **Java 21** (Temurin recommended)
- **Node.js** LTS (22.x matches CI; 20.x works locally)

## Run locally

### Backend (port 8080)

```bash
cd backend
./gradlew bootRun
```

On Windows:

```powershell
cd backend
.\gradlew.bat bootRun
```

Health check: [http://localhost:8080/api/health](http://localhost:8080/api/health) → `{"status":"UP"}`

### Frontend (port 5173)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The hello page calls `/api/health` via the Vite dev proxy to the backend.

Optional: point the SPA at another API host:

```bash
VITE_API_URL=http://localhost:8080 npm run dev
```

## CI on pull requests

GitHub Actions workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every **push to `main`** and every **pull request targeting `main`**:

| Job | Command | Working directory |
|-----|---------|-------------------|
| `backend` | `./gradlew check` | `backend/` |
| `frontend` | `npm ci`, `npm run lint`, `npm test`, `npm run build` | `frontend/` |

Jobs run in parallel. On a PR, open the **Checks** tab (or [Actions](https://github.com/rtaylor02/todoist/actions)) to see `backend` and `frontend` status; both must pass before merge if branch protection is enabled.

### Local parity (same as CI)

```bash
cd backend && ./gradlew check
cd frontend && npm ci && npm run lint && npm test && npm run build
```

## Project layout

| Path | Purpose |
|------|---------|
| `backend/` | Spring Boot REST API (Java 21, Gradle) |
| `frontend/` | React + Vite SPA |
| `specs/` | Mission, tech stack, roadmap |
| `.github/workflows/` | CI/CD |

## Docs

- [Mission & principles](specs/mission.md)
- [Tech stack & CI/CD](specs/tech-stack.md)
- [Implementation roadmap](specs/roadmap.md)

## Branch protection (optional)

On GitHub → **Settings → Branches**, protect `main` with required status checks: `backend`, `frontend`.
