---
name: guardrails
description: Define and apply scalability guardrails for feature architecture, state boundaries, and refactor hygiene in the product codebase.
user-invocable: true
metadata:
  taxonomy: architecture/governance/scalability/guardrails
---

## Objectives

- Align tactical guardrails to the canonical editor target-state architecture skill.
- Keep runtime architecture product-oriented: `src/features` and `src/core`, with feature internals grouped by ownership (`components`, `interaction`, `model`, `domain`, `context`, `store`).
- Prevent anti-patterns that degrade scale, especially state prop drilling across feature trees.
- Ensure refactors are complete: no dead folders, no stale imports, no mixed old/new structures.
- Prioritize proven dependencies for non-differentiating infrastructure to reduce custom maintenance burden.

## Canonical Source

- Use `architecture/governance/target-state/editor-architecture/SKILL.md` as the primary architecture blueprint.
- Use this skill for tactical guardrails and review prompts during active implementation.
- If guidance conflicts, target-state skill policy takes precedence.

## Guardrails

- Feature state and actions should be exposed through a feature boundary (context/store/service), not threaded through multiple parent props.
- Presentation components should be pure: render from current state and invoke boundary actions.
- Prefer domain-oriented modules over role-oriented naming in runtime code.
- Refactor moves must be atomic: move, rewire imports, remove old files, and verify build.
- Prefer metadata-driven registries over manually enumerated advanced property catalogs.
- Separate curated common UX from generated advanced coverage to scale safely.
- Treat control mapping as a first-class architecture layer with explicit ownership.
- For pointer-heavy features, define a single interaction state model before implementation.
- Keep event ownership explicit so one gesture maps to one handler chain.
- Keep world and screen coordinate transforms centralized and reusable.
- Do not couple selection-clearing logic to creation gestures in separate event phases.
- Require regression checks for create, select, drag, resize, and pan after any input-system changes.
- Apply dependency-first delivery for generic concerns (input gestures, drag and drop, keyboard shortcuts, parsing, validation, tree virtualization, export helpers).
- Apply dependency-first delivery for non-differentiating UI primitives including iconography packages.
- Before writing custom infrastructure, run a package audit and evaluate mature options by maintenance health, bundle impact, API fit, and browser behavior coverage.
- If custom implementation is chosen, document why in the change summary and identify an owner for long-term maintenance.

## Review Checklist

- Is state passed through 3+ component levels only to reach consumers? Replace with feature boundary access.
- Do runtime folders reflect product concerns instead of workflow concepts?
- Are there orphaned files/folders from previous structure?
- Do typecheck and build pass after refactor?
- Are advanced CSS properties sourced from metadata, not hardcoded lists?
- Is there a documented mapping from metadata to control primitives?
- Was an NPM package audit performed for new non-core infrastructure?
- If custom code was chosen, is there a documented justification and maintenance plan?

## Common Drift Fixes

- For recurring anti-patterns and approved remediations, use `.github/architecture/violations-and-how-to-fix.md`.
