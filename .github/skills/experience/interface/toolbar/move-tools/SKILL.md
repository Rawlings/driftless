---
name: move-tools
description: Define move-tool behaviors for object manipulation, viewport navigation, and proportional scaling with designer-first ergonomics.
user-invocable: true
metadata:
  taxonomy: experience/interface/toolbar/move-tools
---

## Objectives

- Make selection and movement fast, predictable, and reversible.
- Separate object manipulation from viewport navigation to prevent accidental edits.
- Support temporary navigation override without mode confusion.

## Tool Set

- Move:
  - Default active tool on file open.
  - Select single or multiple objects.
  - Drag selection with axis constraints and snapping support.
- Hand:
  - Pan viewport only, never mutate object state.
  - Support pointer drag panning and touch panning.
- Scale:
  - Resize entire selected objects or groups proportionally.
  - Preserve aspect ratio by default with optional modifier override.

## UX Behavior Model

- Move defaults:
  - Click empty canvas clears selection.
  - Click object selects it.
  - Drag selected object starts move after threshold to avoid jitter.
- Temporary hand override:
  - Holding Space switches to Hand while pressed.
  - Releasing Space returns to previous tool.
- Cursor and affordance:
  - Move: directional move cursor on draggable objects.
  - Hand: grab and grabbing cursor states.
  - Scale: visible corner and edge handles with proportional feedback.

## Interaction Rules

- Ignore move or scale drag starts when pointer begins in text-edit mode.
- Use one history entry per completed drag or scale gesture.
- Keep selection stable when panning.
- If touch input is detected, hand panning must remain frictionless and non-selecting.

## Accessibility and Shortcuts

- Keyboard shortcuts:
  - V activates Move.
  - H activates Hand.
  - K activates Scale.
  - Space temporarily activates Hand.
- Announce active tool changes to assistive tech.
- Maintain visible focus style on toolbar buttons.

## Acceptance Criteria

- Move is active by default on open.
- Hand never changes selection or object geometry.
- Space override enters and exits Hand without losing prior tool.
- Scale changes object dimensions consistently and creates clean undo boundaries.
