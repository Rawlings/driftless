# Feature Public API Map

Date: 2026-03-15
Status: finalized

## Purpose

Define stable cross-feature public entry points and guardrails.

## Companion Review Assets

- PR checklist: `.github/pull_request_template.md`
- Common fixes for drift: `.github/architecture/violations-and-how-to-fix.md`

## Boundary Policy

- Features expose stable public APIs from top-level feature entry files.
- Cross-feature imports should target public API files only.
- Deep imports into sibling feature internals are temporary exceptions and must be time-boxed.
- Within a feature, prefer direct local module imports over importing through the same feature barrel to avoid accidental cycles.

## Public Entries

- `src/features/canvas/index.ts`: `Canvas`, `SnapGuide` (from `model/canvasTypes.ts`)
- `src/features/layers/index.ts`: `LayersPanel`
- `src/features/properties/index.ts`: `PropertiesPanel`
- `src/features/state/index.ts`: `EditorProvider` + domain hooks
- `src/features/toolbar/index.ts`: `Toolbar`
- `src/features/workspace/index.ts`: `EditorWorkspace`
- `src/features/ui/index.ts`: shared UI primitives

## Current Compliance

- No deep cross-feature relative imports under `src/features/**`.
- Properties and state feature public entries are narrowed to high-level surfaces.
- Canvas public type API is decoupled from `snapEngine.ts` internals.
- Internal feature structure is ownership-oriented (`components`, `interaction`, `model`, `domain`, `context`, `store`).

## Next Steps

1. Maintain public entries as features evolve.
2. Keep deep-import checks in PR review and architecture checklist usage.
3. Keep exception register empty; add entries only with explicit expiry criteria.
4. Prefer feature-local barrels for internal discoverability while keeping cross-feature imports on top-level feature entries.

## Exception Register

No active exceptions recorded yet.
