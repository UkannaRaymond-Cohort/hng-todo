# AGENT.md — Taskflow

## Purpose
Taskflow is an advanced, focused todo/work-management application built with Next.js, React, TypeScript, and Zustand. It is intentionally lightweight and local-first in this starter implementation.

## Product principles
- Tasks should be fast to create, inspect, filter, and complete.
- Prefer progressive disclosure: the list stays dense; detailed editing lives in the detail panel.
- Keyboard accessibility matters: `N` focuses quick add and `Cmd/Ctrl + K` focuses search.
- Never make destructive actions one click away without a clear action target.
- Preserve user data. Persist task state through the Zustand persistence layer.

## Stack
- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Zustand for client state and persistence
- lucide-react for icons
- Plain CSS in `app/globals.css` for the UI layer

## Architecture
- `app/page.tsx`: application shell, task list, quick-add flow, filters, and task detail panel.
- `lib/types.ts`: domain types. Keep task-related types here rather than duplicating them in components.
- `lib/store.ts`: Zustand store and local persistence. Business operations such as add/update/toggle/delete belong here.
- `app/globals.css`: visual system and responsive layout.

## Task model
A task currently supports:
- title and notes
- status: `todo | in_progress | done`
- priority: `none | low | medium | high | urgent`
- due date and time
- project
- tags
- assignee
- subtasks
- recurrence: none/daily/weekly/monthly
- created/completed timestamps

## Important implementation rules
1. Keep `Task` as the source of truth for task shape.
2. Mutations should go through `useTaskStore` instead of directly changing arrays in components.
3. Do not put server-only code in `app/page.tsx`; it is a client component.
4. If adding a backend, replace the persistence implementation behind the store rather than coupling UI components directly to a database SDK.
5. Validate dates and recurrence rules at the domain boundary when adding a backend.
6. Keep filters composable. Adding a new filter should not break search, view filters, or project/tag filtering.
7. Preserve keyboard behavior when modifying inputs or dialogs.
8. Avoid adding a large UI library unless it solves a concrete accessibility or interaction problem.

## Backend roadmap
If evolving this into a multi-user production application:
1. Add authentication.
2. Move tasks/projects/tags/subtasks into PostgreSQL.
3. Add an API/server action layer with authorization checks.
4. Add optimistic updates with rollback for mutations.
5. Add recurring-task generation rather than storing only a recurrence label.
6. Add reminders/notifications using a durable job system.
7. Add activity history and audit events.
8. Add full-text search and indexed filtering.
9. Add real-time synchronization for collaborative workspaces.
10. Add tests for task mutations, recurrence, filters, permissions, and synchronization conflicts.

## Testing expectations
Before considering a feature complete:
- Run TypeScript/build checks.
- Test task creation, editing, completion, deletion, and duplication.
- Test empty states and mobile layout.
- Test filters in combination with search.
- Test persisted state after a browser reload.
- For backend changes, test authorization and invalid input.

## Agent workflow
When an agent receives a task:
1. Inspect existing types/store/UI before creating new abstractions.
2. Make the smallest coherent change that satisfies the requirement.
3. Reuse existing components and styles where possible.
4. Update `AGENT.md` if architecture, commands, domain rules, or important workflows change.
5. Do not silently remove existing functionality to make a new feature easier.
6. Report changed files and any verification that could not be run.
