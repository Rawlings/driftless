---
name: region-tools
description: Define region-tool behaviors for structural containers, file organization regions, and export slices with clear lifecycle and controls.
user-invocable: true
metadata:
  taxonomy: experience/interface/toolbar/region-tools
---

## Objectives

- Provide clear structural region primitives for layout, grouping, and export.
- Keep region creation and editing discoverable without cluttering canvas interactions.
- Ensure region-specific behaviors are explicit in properties and layers.

## Tool Set

- Frame:
  - Create container regions with custom drag dimensions.
  - Offer preset sizes in the properties panel.
  - Support nesting and clipping behaviors.
- Section:
  - Organize related canvas areas for navigation and handoff grouping.
  - Allow section naming and status tagging.
- Slice:
  - Define export bounds independent of object hierarchy.
  - Manage multiple slices with explicit export settings.

## UX Behavior Model

- Creation:
  - Click and drag draws region bounds.
  - Shift constrains proportions when relevant.
  - Escape cancels in-progress creation.
- Selection and editing:
  - Region boundary highlights on hover and active selection.
  - Handles appear only for selected region.
  - Region title chips are always visible at practical zoom levels.
- Panel integration:
  - Frame presets and custom size controls surfaced in properties panel.
  - Slice export settings surfaced in contextual properties.

## Interaction Rules

- Frames can contain and reorder child elements with clear insertion feedback.
- Sections do not mutate child geometry on creation.
- Slices do not alter visual output unless export is requested.
- Region operations must preserve undo and redo integrity.

## Accessibility and Shortcuts

- Keyboard shortcuts:
  - F activates Frame.
  - S activates Section.
  - E activates Slice.
- Region names and statuses must be keyboard editable.
- Selection outlines must meet contrast requirements.

## Acceptance Criteria

- Frames, sections, and slices can be created with drag gestures.
- Frame presets are available in properties.
- Regions remain manageable in layers and properties panels.
- Slice definitions export correct bounds without side effects on design objects.
