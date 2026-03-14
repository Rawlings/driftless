---
name: layer-tree
description: Design and implement a hierarchical layers panel that reflects rendered canvas structure and keeps ordering, nesting, and selection synchronized.
user-invocable: true
metadata:
  taxonomy: experience/authoring/layers/layer-tree
---

## Objectives

- Present a clear tree UI of all rendered canvas elements.
- Keep layer panel structure synchronized with visible canvas hierarchy.
- Support robust selection, ordering, and grouping operations without divergence.

## Real-Structure-First Principle

- Treat rendered hierarchy as the canonical structure contract.
- Avoid maintaining a parallel, conflicting hierarchy model.
- Keep a minimal document model for persistence and operations, then derive render and layer views from that same structure.
- Layer panel must be a projection of the same hierarchy used to render the canvas.

## UX Behavior Model

- Layer tree displays:
  - parent-child nesting
  - visibility state
  - lock state
  - selected and hovered states
- Interaction:
  - click selects layer and corresponding canvas element
  - hover highlights corresponding canvas element
  - drag and drop supports three explicit targets: before sibling, inside parent, after sibling
  - dropping on root header unnests to top-level
  - drag and drop reorders within valid hierarchy constraints
  - collapse and expand branches for navigation
- Multi-select:
  - support range and additive selection where available

## Architecture Guardrails

- One source hierarchy for:
  - canvas rendering
  - layers panel tree
  - export ordering
- Use stable node ids for all elements and containers.
- Keep tree derivation pure and memoized; avoid side effects in render.
- Centralize reorder and reparent operations in one command layer.
- Validate parent-child constraints before commit.
- Preserve world position when reparenting so elements do not visually jump.
- Prevent cycle creation when moving nodes across branches.

## Anti-Patterns To Avoid

- Storing a separate panel-only hierarchy that can drift from canvas structure.
- Ad-hoc z-index mutations outside centralized reorder commands.
- Updating UI tree and canvas tree through separate code paths.
- Recomputing large tree transforms on every pointer move.

## Acceptance Criteria

- Layers panel tree always matches rendered hierarchy.
- Selection and hover are synchronized both directions.
- Reorder and nesting updates are reflected immediately in canvas and tree.
- Before/inside/after drop zones produce deterministic sibling placement.
- Export order semantics match panel and rendered structure.
- No hierarchy desync under undo and redo.
