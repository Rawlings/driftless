---
name: interactions
description: Implement canvas rendering, element positioning, drag/resize interactions, and selection logic for the WYSIWYG editor.
user-invocable: true
metadata:
  taxonomy: experience/authoring/canvas/interactions
---

## Objectives

- Deliver smooth and predictable selection, dragging, and resizing.
- Keep rendering components presentational and interaction logic centralized.
- Ensure interaction behavior remains consistent as CSS support expands.
- Ensure canvas rendering remains robust when metadata-driven properties increase style breadth.

## Implementation Workflow

- Route interaction handlers through a feature state boundary.
- Use complete style objects on elements and avoid renderer-level style mutation.
- Keep pointer lifecycle explicit: pointer down, move, up, and cancel semantics.
- Guard against missing selected elements during move and resize updates.

## Interaction Architecture Guardrails

- Use one interaction coordinator for canvas pointer workflows.
- Keep a single active pointer mode at a time:
  - idle
  - creating
  - dragging
  - resizing
  - panning
- Do not mix gesture semantics across `mousedown` and `click` for the same intent.
- Define one canonical background hit-test contract using stage markers such as `data-editor-stage` and `data-editor-element`.
- Keep coordinate conversion centralized:
  - screen coordinates from pointer events
  - world coordinates after viewport offset and zoom transforms
- Keep tool switching and gesture completion rules explicit:
  - single-shot creation tools return to move only when configured
  - panning must never clear selection
  - hand gestures never mutate object geometry

## Anti-Patterns To Avoid

- Scattered `stopPropagation` logic across multiple layers without an ownership map.
- Multiple components each attaching global move or up listeners for the same gesture.
- Recomputing coordinate transforms ad hoc in unrelated handlers.
- Background click handlers that can clear selection immediately after create.
- Conditional tool behavior hidden in render components instead of interaction coordinator logic.

## Acceptance Criteria

- Elements remain selectable and do not auto-deselect due to event bubbling.
- Dragging updates position fields used by rendering without adapter logic.
- Resizing updates width and height with minimum constraints.
- Additional style properties do not break selection, dragging, or resize behavior.
- Shape tools support pointer down, move, and up lifecycle with live geometry preview before commit.
