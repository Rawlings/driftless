---
name: system-integration
description: Coordinate between editor components, manage global state, handle cross-component interactions, and ensure overall editor functionality.
user-invocable: true
metadata:
  taxonomy: architecture/coordination/system-integration
---

## Guardrails

- Integrate runtime code through product modules under `src/features`, `src/core`, `src/hooks`, and `src/components`.
- Use feature-level state boundaries (context/store/service) to avoid deep prop drilling of editor state and actions.
- Treat agent concepts as development workflow helpers, not runtime folder names.
- Reject structures that introduce or preserve runtime code under `src/agents`.
- During integration refactors, remove obsolete modules and imports in the same pull request.
