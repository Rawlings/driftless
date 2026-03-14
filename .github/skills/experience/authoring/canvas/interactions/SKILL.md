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

## Acceptance Criteria

- Elements remain selectable and do not auto-deselect due to event bubbling.
- Dragging updates position fields used by rendering without adapter logic.
- Resizing updates width and height with minimum constraints.
- Additional style properties do not break selection, dragging, or resize behavior.
