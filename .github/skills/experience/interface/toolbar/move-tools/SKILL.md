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
- Keep primary navigation tools compact with one consolidated toolbar control.

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

## Toolbar Navigation Dropdown Pattern

- Move, Hand, and Scale are represented by one toolbar slot.
- Main button:
  - Shows the icon of the active navigation tool when one is active.
  - Otherwise shows the last-used navigation tool (default Move).
  - Click activates the displayed navigation tool.
- Chevron trigger badge:
  - Opens a menu with Move, Hand, and Scale.
  - Choosing an item activates it, updates last-used, and closes the menu.
- Selected state:
  - Main button uses selected styling when any navigation tool is active.
- Tooltip:
  - Shows current navigation tool label and short behavior summary.
  - Tooltip is hidden while the dropdown is open.

## UX Behavior Model

- Move defaults:
  - Click empty canvas clears selection.
  - Click object selects it.
  - Drag selected object starts move after threshold to avoid jitter.
- Cursor and affordance:
  - Move: directional move cursor on draggable objects.
  - Hand: grab and grabbing cursor states.
  - Scale: visible corner and edge handles with proportional feedback.

## Interaction Rules

- Ignore move or scale drag starts when pointer begins in text-edit mode.
- Use one history entry per completed drag or scale gesture.
- Keep selection stable when panning.
- If touch input is detected, hand panning must remain frictionless and non-selecting.
- Hand mode must never change selection when pressing existing elements.
- Move and Scale modes may select elements; creation modes must not steal selection from existing elements.

## Accessibility

- Announce active tool changes to assistive tech.
- Maintain visible focus style on toolbar buttons.

## Acceptance Criteria

- Move is active by default on open.
- Hand never changes selection or object geometry.
- Move, Hand, and Scale are reachable from one dropdown control.
- Scale changes object dimensions consistently and creates clean undo boundaries.
