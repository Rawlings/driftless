---
name: system-integration
description: Coordinate between editor components, manage global state, handle cross-component interactions, and ensure overall editor functionality.
user-invocable: true
metadata:
  taxonomy: architecture/coordination/system-integration
---

## Guardrails

- Integrate runtime code through product modules under `src/features` and `src/core`, and keep feature internals organized by ownership (`components`, `interaction`, `model`, `domain`, `context`, `store`).
- Use feature-level state boundaries (context/store/service) to avoid deep prop drilling of editor state and actions.
- Treat agent concepts as development workflow helpers, not runtime folder names.
- Reject structures that introduce or preserve runtime code under `src/agents`.
- During integration refactors, remove obsolete modules and imports in the same pull request.
- Prefer established NPM packages for cross-cutting integration infrastructure before creating custom abstractions.
- When adopting a package, isolate it behind feature-facing adapters to keep replacement cost manageable.
