---
name: ui
description: Create, update, and manage UI components for the WYSIWYG editor, including toolbars, panels, buttons, and layouts.
user-invocable: true
metadata:
  taxonomy: experience/interface/components/ui
---

## Objectives

- Build editor UI components that are reusable and composable.
- Separate presentation from feature state orchestration.
- Keep controls accessible and keyboard reachable.
- Enforce the shared visual language defined in `experience/interface/design-system/rui-ui-style/SKILL.md`.

## Implementation Workflow

- Keep component APIs focused on domain intent.
- Consume feature context where it reduces deep prop chains.
- Avoid embedding heavy business logic in purely visual components.
- Standardize control patterns for buttons, groups, and panel sections.
- Build reusable property control primitives for slider, color, select, unit input, and syntax text.
- Keep metadata-driven renderer components decoupled from property-specific logic.
- Use a single icon package for editor UI iconography (prefer `lucide-react` line icons) rather than ad-hoc inline SVG snippets.

## Acceptance Criteria

- Toolbar and panels remain responsive and functional across viewport sizes.
- UI components are reusable without hidden coupling to parent internals.
- Keyboard and focus behavior are predictable for all interactive controls.
- New UI follows the RUI shell pattern and panel/button styling conventions.
- Property UI additions reuse shared control primitives and mapping rules.
- Icon sizing, stroke weight, and interaction states remain consistent across toolbar and side panels.
