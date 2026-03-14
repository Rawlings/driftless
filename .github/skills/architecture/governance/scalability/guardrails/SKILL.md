---
name: guardrails
description: Define and apply scalability guardrails for feature architecture, state boundaries, and refactor hygiene in the product codebase.
user-invocable: true
metadata:
  taxonomy: architecture/governance/scalability/guardrails
---

## Objectives

- Keep runtime architecture product-oriented: `src/features`, `src/core`, `src/hooks`, `src/components`.
- Prevent anti-patterns that degrade scale, especially state prop drilling across feature trees.
- Ensure refactors are complete: no dead folders, no stale imports, no mixed old/new structures.

## Guardrails

- Feature state and actions should be exposed through a feature boundary (context/store/service), not threaded through multiple parent props.
- Presentation components should be pure: render from current state and invoke boundary actions.
- Prefer domain-oriented modules over role-oriented naming in runtime code.
- Refactor moves must be atomic: move, rewire imports, remove old files, and verify build.
- Prefer metadata-driven registries over manually enumerated advanced property catalogs.
- Separate curated common UX from generated advanced coverage to scale safely.
- Treat control mapping as a first-class architecture layer with explicit ownership.

## Review Checklist

- Is state passed through 3+ component levels only to reach consumers? Replace with feature boundary access.
- Do runtime folders reflect product concerns instead of workflow concepts?
- Are there orphaned files/folders from previous structure?
- Do typecheck and build pass after refactor?
- Are advanced CSS properties sourced from metadata, not hardcoded lists?
- Is there a documented mapping from metadata to control primitives?
