---
name: management
description: Implement layer management for the WYSIWYG editor, handling element stacking, z-index, grouping, and visual hierarchy.
user-invocable: true
metadata:
  taxonomy: experience/authoring/layers/management
---

## Objectives

- Provide explicit control over stacking order and visual hierarchy.
- Keep layer operations reversible and predictable.
- Ensure selected layer state stays synchronized with canvas selection.

## Implementation Workflow

- Represent order in a single source of truth.
- Implement move up, move down, bring to front, send to back operations.
- Keep z-index derivation deterministic from layer ordering.
- Integrate with undo and redo boundaries for each layer operation.

## Acceptance Criteria

- Layer operations update visual stacking immediately.
- Selection remains stable when reordering adjacent elements.
- Export preserves layer order semantics.
