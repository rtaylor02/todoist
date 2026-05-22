# Mission

## Source repository

All application code, workflows, and deployment config live in the canonical Git repository:

**https://github.com/rtaylor02/todoist.git**

Delivery is **trunk-based**: integrate via pull requests into `main`, with CI required before merge. Continuous deployment details are in [tech-stack.md](./tech-stack.md#cicd) and phased in [roadmap.md](./roadmap.md).

## Vision

Build a **web-based**, Java-backed task management application inspired by [Todoist](https://www.todoist.com) that helps Engineering, Product, and Marketing teams organize work in one place—eventually supporting shared projects, filters, labels, priorities, and integrations. The long-term audience is Mary (Engineering), Susan (Product), and Steve (Marketing), as described in [requirements.md](./requirements.md).

## Initial release focus

**Optimize for individual productivity first.** The first meaningful release should let a single user create, edit, complete, and delete personal tasks; organize them into projects; and apply basics such as priorities, due dates, and labels. Team collaboration (shared projects, comments, cross-department views) comes **after** personal workflows are solid and trustworthy.

This ordering matches the acceptance criteria in requirements but deliberately sequences delivery: personal task management → organization (projects, labels, filters) → team spaces → integrations and department-specific needs.

## Success criteria (MVP)

An MVP is successful when:

1. A user can sign in via **OAuth2 / SSO** and manage **personal** tasks and projects in the browser.
2. Tasks support **priority**, **due date**, and **labels**; the user can **filter** by project, label, priority, date, and status.
3. The app is **responsive**, does not lose data on normal operations, and feels fast enough for everyday task updates and search.
4. Foundation is in place to add **shared team projects** and collaboration without rework of core domain or API contracts.

Explicitly **out of scope for MVP** (see [roadmap.md](./roadmap.md)):

- Reminders and push/email **notifications** (deferred).
- Full department-specific workflows (sprint boards, roadmap dependencies, campaign asset workflows) until core task flows are proven.

## Principles

| Principle | Meaning |
|-----------|---------|
| **Personal first** | Nail solo task flows before shared-team complexity. |
| **Web only** | Browser-based UI; no desktop or CLI as primary surfaces. |
| **Secure by default** | Authentication and authorization from the start; role-based access grows with team features. |
| **Incremental value** | Each micro-phase ships something reviewable; avoid big-bang releases. |
| **Maintainable Java** | Clear boundaries between API, domain, and persistence; conventions in [tech-stack.md](./tech-stack.md). |
| **CI-gated quality** | Every change to [rtaylor02/todoist](https://github.com/rtaylor02/todoist) passes automated build and test before merge. |

## Non-goals (for now)

- Native mobile apps.
- Todoist filter query language parity in v1.
- Notification/reminder delivery infrastructure (scheduled for a later phase).
- Replacing specialized tools (Jira, full PM suites)—we integrate and organize tasks, not replicate every workflow.

## Reference

Functional and nonfunctional requirements, user stories, and acceptance criteria: [requirements.md](./requirements.md).

CI/CD and repository workflow: [tech-stack.md](./tech-stack.md#cicd).
