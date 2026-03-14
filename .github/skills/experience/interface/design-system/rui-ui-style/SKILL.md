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
- Enforce Tailwind CSS utility classes for all internal UI styling.
- Keep base typography at 16px (`1rem`) across editor surfaces.

## Design Token Standard

- Define and use explicit Tailwind token categories across all UI controls:
  - `surface`: shell backgrounds, panel backgrounds, elevated surfaces
  - `border`: neutral, hover, selected, and focus borders
  - `text`: primary, secondary, muted, and inverse text roles
  - `accent`: selected, active, and focus intent color family
  - `radius`: shell, panel, control, and micro-control corner scales
  - `space`: control paddings, panel paddings, and inter-control gaps
  - `motion`: durations and easing for hover/active/focus transitions
  - `state`: hover, active, selected, disabled, dragging, drop-target

## Token Targets By Element Type

- `panel shell`:
  - rounded corners, neutral border, elevated shadow, no positional jitter on hover
- `icon button`:
  - neutral base, accent hover, explicit selected style, pressed depth feedback
- `text input/select/number`:
  - consistent height, border, placeholder style, and focus ring
- `range/color controls`:
  - same focus behavior and cursor affordance as other controls
- `accordion summary`:
  - no browser-default marker, explicit chevron affordance, open-state indicator
- `toolbar button`:
  - selected state visually stronger than hover state
  - selected button should not inherit hover transforms that obscure selected intent

## State Guardrails

- Every interactive element must define all applicable states:
  - default
  - hover
  - focus-visible
  - active/pressed
  - selected (if toggleable)
  - disabled (if supported)
- State precedence:
  - selected styles must remain visible while hovered.
  - focus-visible styles must remain visible during hover and selected states.
  - pressed feedback should be brief and never cause layout shift.

## Motion Guardrails

- Use short, consistent transitions for controls (`~120-180ms`, ease-out).
- Do not animate fixed layout positioning for shell containers unless explicitly intentional.
- Prefer opacity, color, border, and shadow transitions over movement for persistent containers.
- Micro-lift on hover is allowed for buttons, but avoid stacking multiple parent/child lifts that feel unstable.

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

- Internal styling must be implemented with Tailwind utility classes.
- Do not introduce custom component CSS classes for internal UI widgets.
- Use utility composition (including variant utilities) instead of bespoke stylesheet selectors.
- Keep presentational components focused on rendering and interaction affordances.
- Keep feature state and commands behind feature boundaries (context/store/service).
- Do not couple visual components to unrelated domain logic.
- Centralize reusable Tailwind class tokens in shared UI token modules for consistency.

## Interaction and Motion

- Hover, focus, active, and selected states must be visibly distinct.
- Minimize and restore should be immediate and predictable.
- Resize interactions should feel direct with no layout jitter.
- Animations should be subtle and functional, not decorative noise.
- Use consistent transitions for controls: short duration, ease-out curves, and visible active feedback.
- Cursor affordances must match intent (`cursor-pointer`, resize cursors, drag affordances) on interactive elements.
- Every form control and button must include visible keyboard focus states.

## General Purpose Guardrails

- Toolbar, side panels, and close/minimize controls must share the same icon-button language.
- Search fields across panels must share the same input token stack.
- Accordion sections across side panels must use one summary style and one open/close affordance pattern.
- Drag/drop target indicators must use a single accent treatment and thickness scale.
- Cursor styles must map to intent consistently:
  - pointer for clickable controls
  - resize cursors only for resize handles
  - drag affordance only for draggable items

## Color and Styling

- Use one coherent neutral scale for surfaces and borders.
- Use a single accent family for primary editor actions and selected states.
- Avoid introducing one-off colors without a design reason.
- Keep contrast sufficient for controls and body text.
- Base font size is 16px (`1rem`) and should not be reduced for primary control text.

## Accessibility Requirements

- Icon-only controls must have accessible names.
- Keyboard focus indicators must be visible on all controls.
- Sidebar controls (resize and minimize) must remain operable and discoverable.

## Acceptance Checklist

- Toolbar is fixed bottom-center with icon buttons and consistent spacing.
- Properties panel is fixed right, resizable, minimizable, and visually consistent.
- New UI components reuse the established panel and button language.
- No regressions in keyboard focus visibility or control discoverability.
- Internal UI styling remains Tailwind-only (no custom component-class CSS).
- UI token set is documented and applied across toolbar, side panels, accordions, and form controls.
- Selected toolbar state remains obvious and stable while hovered.
- Accordion headers look and behave consistently in side panels.
