---
name: creation-tools
description: Define vector and freehand creation-tool behaviors for path authoring, node editing, and annotation workflows.
user-invocable: true
metadata:
  taxonomy: experience/interface/toolbar/creation-tools
---

## Objectives

- Provide precise path authoring with low-friction controls.
- Support expressive freehand drawing with cleanup and smoothing.
- Keep editing transitions between drawing and selection clear.

## Tool Set

- Pen:
  - Build vector paths from anchors and curves.
  - Support node insertion, deletion, and handle adjustment.
- Pencil:
  - Draw freehand strokes with adaptive smoothing.
  - Convert rough input to editable vector paths.

## UX Behavior Model

- Pen behavior:
  - Click creates corner point.
  - Click-drag creates curve handles.
  - Closing path on first point is explicit and visible.
- Pencil behavior:
  - Press and draw creates continuous path.
  - Smoothing intensity can be adjusted in properties.
  - Path can be simplified after stroke completion.

## Editing and Feedback

- Nodes and handles remain visible when a path is selected.
- Hover states indicate editable anchors and segments.
- Escape exits path creation cleanly.

## Interaction Rules

- Pen and pencil must not interfere with viewport panning override.
- Path creation commits should generate clean undo boundaries.
- Hit testing must prioritize active path control points in edit mode.

## Accessibility and Shortcuts

- Keyboard shortcuts:
  - P activates Pen.
  - Shift P activates Pencil.
- Node operations must be accessible through keyboard alternatives where feasible.

## Acceptance Criteria

- Pen supports corner and curved segments with predictable handle behavior.
- Pencil produces smoothed paths that remain editable.
- Path editing is stable across zoom levels.
- Undo and redo for drawing operations are consistent.
