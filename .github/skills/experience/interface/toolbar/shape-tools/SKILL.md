---
name: shape-tools
description: Define shape-tool behaviors for fast primitive creation, editing, and media placement in a production-grade design workflow.
user-invocable: true
metadata:
  taxonomy: experience/interface/toolbar/shape-tools
---

## Objectives

- Make primitive creation immediate and precise.
- Keep shape editing consistent across all shape types.
- Support media placement through the same creation mental model.

## Tool Set

- Rectangle
- Line
- Arrow
- Ellipse
- Polygon
- Star
- Place image or video

## UX Behavior Model

- Family defaults:
  - Rectangle is the default shape in the shape family.
  - Last-used shape is remembered and restored when re-entering the shape tool.
- Creation modes:
  - Press and drag creates shape with live bounds preview.
  - Release commits final geometry.
  - Click without drag falls back to a sensible default size (100×100).
- Constraints:
  - Shift enforces equal dimensions for rectangle and ellipse.
  - Alt or Option draws from center.
- Shape-specific controls:
  - Arrow includes start and end styling.
  - Polygon and star expose point count and corner smoothness.

## Toolbar Shape Dropdown Pattern

All shape tools are consolidated into a single toolbar slot to reduce clutter.

### Anatomy
- **Main button** (full 44×44 hit area): shows the icon of the last-used or currently-active shape.
  - Click activates the remembered shape tool immediately.
  - When a shape tool is already active, clicking keeps it active.
- **Dropdown indicator** (small chevron badge in the bottom-right corner):
  - Click opens or closes the shape picker panel.
  - Visually subtle — 16×16 px, white background, border.
- **Shape picker panel**: floats above the toolbar, center-aligned to the button.
  - Lists all available shape variants with icon, label, and shortcut badge.
  - Active row highlighted in blue.
  - Clicking a row activates that tool, updates the button icon, and closes the panel.
  - Clicking outside the panel closes it.

### Selected state
- The main button shows `toolbarSelected` style whenever any shape tool is active.
- The icon always reflects the currently active shape (if active) or last-used shape.

### Tooltip
- Shows the active shape name and shortcut, plus the hint about switching type.
- Suppressed while the dropdown is open.

## Media Placement Model

- Place image or video enters placement mode.
- Users can pick one or more files and place sequentially.
- Placed media should map to shape fills or media layers consistently.

## Interaction Rules

- New shapes adopt sensible style defaults from current theme tokens.
- Shape creation should not deselect active tool unless in single-shot mode.
- Shape edits must produce one history boundary per completed gesture.
- Shape creation lifecycle must be explicit and centralized:
  - pointer down starts draft shape
  - pointer move updates geometry
  - pointer up commits and exits draft state

## Accessibility and Shortcuts

- Keyboard shortcuts:
  - R rectangle, O ellipse, L line, A arrow, P polygon, Y star.
- Shape tooltips include shortcut and one-line behavior summary.
- Toolbar state remains keyboard navigable.

## Acceptance Criteria

- Shape creation supports click and drag workflows.
- Constraint modifiers work consistently across relevant shapes.
- Media placement supports single and multi-file insertion.
- Shape-specific settings are available in properties panel.
