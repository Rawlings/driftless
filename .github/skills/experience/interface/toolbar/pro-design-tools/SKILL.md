---
name: pro-design-tools
description: Define and implement a scalable toolbar tool-system for professional design workflows, including move/hand/scale, region, shape, creation, text, and comment workflows.
user-invocable: true
metadata:
  taxonomy: experience/interface/toolbar/pro-design-tools
---

## Objectives

- Build a professional multi-tool toolbar experience for designers.
- Support mode-based interactions with clear active tool state.
- Keep the toolbar extensible as tool families and capabilities expand.

## Tool Taxonomy

- Move tools:
  - Move: select and reposition objects.
  - Hand: pan and navigate canvas without selection side effects.
  - Scale: resize complete objects or layers proportionally.
- Region tools:
  - Frame: create bounded containers for layout and structure.
  - Section: group and organize design areas for navigation and handoff.
  - Slice: define export regions.
- Shape tools:
  - Rectangle
  - Line
  - Arrow
  - Ellipse
  - Polygon
  - Star
  - Place image or video
- Creation tools:
  - Pen for vector paths and handles.
  - Pencil for freehand drawing with smoothing.
- Text tool:
  - Click to create auto-width text.
  - Drag to create fixed-size text box.
- Comment tools:
  - Comment mode for feedback threads.
  - Annotation mode for implementation notes.
  - Measurement mode for spacing and sizing overlays.

## Interaction Model

- Single active tool at a time with explicit mode indicator.
- Tool families exposed as grouped menus with default tool per family.
- Temporary tool override support (example: hold Space for Hand).
- Cursor changes and affordance overlays must reflect active tool.
- Tool changes should never silently mutate selected objects.

## Keyboard and Input Standards

- Provide fast shortcuts for primary tools:
  - Move default on file open.
  - Text shortcut with single-key activation.
  - Temporary Hand mode via Space hold.
- Touch support:
  - Hand mode enables panning gestures on touch devices.
- Shortcut handling should be centralized and conflict-aware.

## Architecture Pattern

- Define a canonical tool registry with:
  - id
  - family
  - label
  - icon
  - shortcut
  - availability flags
  - interaction strategy key
- Use a toolbar state machine:
  - activeTool
  - temporaryTool
  - previousTool
  - family menu open state
- Keep canvas interaction handlers tool-driven via strategy mapping.

## Extensibility Rules

- Add new tools by extending registry and strategy mapping only.
- Keep tool UI (buttons/menus) decoupled from canvas behavior logic.
- Avoid hardcoding tool branching in multiple components.
- Gate seat-tier or permission-based tools through availability metadata.

## UX Requirements

- Toolbar remains compact, icon-first, and fast to scan.
- Active tool must always be visually obvious.
- Family menu entries must include icon, label, and shortcut hints.
- Tooltips should explain behavior and shortcut in one line.

## Accessibility Requirements

- Icon controls must have accessible names and keyboard focus states.
- Family menus must support keyboard navigation and escape-to-close.
- Active tool state should be exposed to assistive technologies.

## Acceptance Criteria

- All tool families are represented in a structured registry.
- Switching tools updates canvas behavior immediately and predictably.
- Temporary Hand override returns to previous tool on release.
- Text, shape, and region creation workflows are mode-consistent.
- Toolbar and menus remain usable on desktop and touch-capable devices.
