---
name: rui-ui-style
description: Enforce RUI's product UI style across editor surfaces, including fixed bottom icon toolbar, fixed right properties sidebar, floating panel treatment, and consistent interaction states.
user-invocable: true
metadata:
  taxonomy: experience/interface/design-system/rui-ui-style
---

## Objectives

- Keep all editor UI visually consistent with the current RUI look and feel.
- Preserve the editor shell pattern: floating bottom toolbar and fixed right properties panel.
- Standardize spacing, shape language, color treatment, and interaction feedback.

## Visual Direction

- Product tone: clean, modern, utility-first with strong affordance for editing tools.
- Primary shell pattern:
  - Bottom toolbar is fixed, centered, icon-first, and offset from screen edge.
  - Right properties panel is fixed, can be resized, and can be minimized.
- Panel language:
  - Rounded corners.
  - Light border with subtle shadow.
  - Layered on top of canvas with intentional spacing.

## Layout Guardrails

- Toolbar:
  - Position fixed at bottom center.
  - Use icon buttons instead of text-first actions.
  - Keep equal button sizes and consistent spacing.
  - Maintain safe-bottom gap so the bar never touches viewport edge.
- Properties sidebar:
  - Position fixed on right side.
  - Support minimize and restore states.
  - Support horizontal resize with explicit drag handle.
  - Keep internal sections scrollable without shifting shell layout.
- Canvas:
  - Remains the primary stage and must not be obscured by accidental overlap.
  - Respect fixed UI overlays with adequate insets/padding.

## Component Rules

- Prefer reusable primitives for icon button, panel header, and resize handle.
- Keep presentational components focused on rendering and interaction affordances.
- Keep feature state and commands behind feature boundaries (context/store/service).
- Do not couple visual components to unrelated domain logic.

## Interaction and Motion

- Hover, focus, active, and selected states must be visibly distinct.
- Minimize and restore should be immediate and predictable.
- Resize interactions should feel direct with no layout jitter.
- Animations should be subtle and functional, not decorative noise.

## Color and Styling

- Use one coherent neutral scale for surfaces and borders.
- Use a single accent family for primary editor actions and selected states.
- Avoid introducing one-off colors without a design reason.
- Keep contrast sufficient for controls and body text.

## Accessibility Requirements

- Icon-only controls must have accessible names.
- Keyboard focus indicators must be visible on all controls.
- Sidebar controls (resize and minimize) must remain operable and discoverable.

## Acceptance Checklist

- Toolbar is fixed bottom-center with icon buttons and consistent spacing.
- Properties panel is fixed right, resizable, minimizable, and visually consistent.
- New UI components reuse the established panel and button language.
- No regressions in keyboard focus visibility or control discoverability.
