---
name: undo-redo
description: Implement undo/redo functionality for the WYSIWYG editor, managing state history and user actions using immutable data structures.
user-invocable: true
metadata:
  taxonomy: architecture/state/history/undo-redo
---

## Objectives

- Provide reliable undo and redo for all user-visible editor state changes.
- Keep history updates predictable and cheap to compute.
- Prevent history corruption during drag and resize interactions.

## Implementation Workflow

- Define snapshot boundaries: element add, remove, move, resize, and style edit.
- Store immutable snapshots or reversible operations in a bounded history stack.
- Coalesce high-frequency pointer updates into a single history entry per interaction.
- Keep redo stack invalidation explicit after new forward actions.

## Acceptance Criteria

- Undo and redo return the canvas to exact previous and next visual states.
- Drag and resize produce one logical history entry per interaction sequence.
- History depth is bounded and does not cause unbounded memory growth.
