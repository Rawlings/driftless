---
name: editor-architecture
description: Define the desired long-term architecture for the editor and guide incremental, advisory refactors toward clear boundaries, stable contracts, and scalable module ownership.
user-invocable: true
metadata:
  taxonomy: architecture/governance/target-state/editor-architecture
---

## Authoritative Source

This skill is the single source of truth for editor runtime architecture policy in this repository.
Companion governance skills should reference this document instead of redefining policy.
Operational workflow defaults and implementation checklists are maintained in `AGENTS.md`.

## Objectives

- Establish a single architecture source of truth for editor runtime structure.
- Reduce coupling across canvas, layers, properties, toolbar, and shared state.
- Keep refactors incremental and advisory while preserving product velocity.
- Make architectural decisions reviewable through explicit boundaries and contracts.

## Current-State Risks This Skill Addresses

- Split runtime entry patterns and shell ownership across app paths.
- Broad, shared command surfaces that increase cross-feature coupling.
- Distributed viewport and interaction math across multiple components and hooks.
- Property metadata and control mapping logic concentrated in fragile utility chains.
- Duplicate style entry points and inconsistent ownership of styling conventions.

## Wanted-State Architecture Blueprint

### 1) Runtime Shell and Entry

- Maintain one runtime application entry path and one shell ownership model.
- Keep theme/provider bootstrap centralized.
- Route-level pages should compose feature modules, not embed feature internals.

### 2) Product Module Layout

- Runtime code belongs under product-oriented paths such as `src/features` and `src/core`, with feature internals grouped by ownership (`components`, `interaction`, `model`, `domain`, `context`, `store`).
- Keep feature internals private by default; export stable public APIs at feature boundaries.
- Avoid role-oriented runtime folders and workflow-oriented runtime placement.

### 3) State and Command Boundaries

- Separate query surfaces from mutation surfaces.
- Prefer narrow feature command APIs over broad global command bags.
- Expose state/actions through feature boundaries, not deep prop threading.
- Keep command semantics explicit (selection, layering, transform, metadata, creation).

### 4) Interaction and Viewport Model

- Centralize screen/world transform logic in a single reusable module.
- Define one interaction state model for pointer workflows (idle, drag, resize, text edit).
- Keep event ownership unambiguous: one gesture maps to one handler chain.
- Treat snapping and guide rendering as interaction-domain concerns, not ad hoc UI side effects.

### 5) Properties and Metadata Pipeline

- Keep mdn-data as canonical source for property metadata and syntax semantics.
- Separate registry concerns from control inference concerns and hint-generation concerns.
- Favor syntax-driven control mapping over property-name branching.
- Keep extensibility points explicit for additional metadata and control families.

### 6) UI and Styling System

- Use PrimeReact components and PrimeReact CSS variables for semantic color usage.
- Keep Tailwind utilities focused on layout, spacing, sizing, and positioning.
- Avoid duplicate style entry points and ad hoc local styling rules when shared conventions exist.
- Keep reusable UI primitives discoverable and consistent across toolbar, panels, and tree controls.

## Dependency Rules (Advisory)

- Features may depend on `src/core` and shared UI primitives.
- Features should not import deep internals from sibling features.
- Cross-feature workflows should integrate through public feature APIs or integration modules.
- Non-differentiating infrastructure should follow dependency-first selection before custom implementation.

## Migration Heuristics

- Prioritize changes that reduce coupling without changing behavior.
- Use strangler-style migrations: introduce boundary API, migrate callsites, remove old paths.
- Complete structural moves end-to-end in one change set when feasible.
- Track and remove dead files/folders as part of each migration.
- If a full migration is not feasible, document interim boundaries and follow-up steps.

## Suggested Review Prompts

- Does this change move architecture toward a single runtime shell and clear ownership?
- Does it reduce prop drilling or context overreach?
- Does it centralize transforms/interaction logic instead of spreading them further?
- Does it preserve metadata-driven property control mapping?
- Does it remove obsolete paths introduced by refactor work?

## Acceptance Checklist (Advisory)

- Runtime code organization aligns with product modules.
- Feature boundaries are clearer than before this change.
- No new deep cross-feature internal imports are introduced.
- Build and typecheck expectations are documented and run when relevant.
- Any custom infrastructure decision records package options considered.

## When To Invoke This Skill

- Planning medium/large refactors across editor features.
- Reviewing architecture drift after rapid feature expansion.
- Defining migration sequence from current state to target state.
- Evaluating whether a proposed change improves or degrades architectural boundaries.

## Execution Assets

- Program overview: `.github/architecture/README.md`
- Current boundary map: `.github/architecture/current-boundary-map.md`
- Feature public API map: `.github/architecture/feature-public-api-map.md`
- ADR index and templates: `.github/architecture/adrs/README.md`

## Governance Cross-References

- React implementation patterns: `.github/skills/architecture/governance/implementation/react-patterns/SKILL.md`
- Tactical guardrails: `.github/skills/architecture/governance/scalability/guardrails/SKILL.md`
- Review and validation criteria: `.github/skills/architecture/governance/enforcement/architecture-validation/SKILL.md`
- Active architecture decisions: `.github/architecture/adrs/README.md`
