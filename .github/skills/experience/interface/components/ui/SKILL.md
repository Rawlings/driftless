---
name: ui
description: Create, update, and manage UI components for the WYSIWYG editor, including toolbars, panels, buttons, layouts, and the shared visual system.
user-invocable: true
metadata:
  taxonomy: experience/interface/components/ui
---

## Objectives

- Build editor UI components that are reusable and composable.
- Separate presentation from feature state orchestration.
- Keep controls accessible and keyboard reachable.
- Keep the shared visual system, shell treatment, and interaction states centralized in this skill.

## Implementation Workflow

- Keep component APIs focused on domain intent.
- Consume feature context where it reduces deep prop chains.
- Avoid embedding heavy business logic in purely visual components.
- Standardize control patterns for buttons, groups, and panel sections.
- Build reusable property control primitives for slider, color, select, unit input, and syntax text.
- Keep metadata-driven renderer components decoupled from property-specific logic.
- Use a single icon package for editor UI iconography (prefer `lucide-react` line icons) rather than ad-hoc inline SVG snippets.
- Prefer PrimeReact components for applicable editor widgets such as buttons, accordions, selects, text inputs, number inputs, sliders, and color pickers.
- Wrap or skin PrimeReact components to match the editor shell rather than recreating the same controls from native HTML.
- Route all PrimeReact visual customization through one shared theme layer instead of per-component ad hoc styling.
- Reuse existing UI token concepts when building the PrimeReact theme layer so shell, border, text, accent, and motion language stay aligned.
- Keep Tailwind utility composition responsible for layout and component styling decisions.
- Do not define custom CSS classes or selector-driven component styling in `*.css` files.
- Do not add dedicated wrapper classes like `rui-*` purely to target components from stylesheets.

## Visual System

- Preserve the editor shell pattern: floating bottom toolbar and fixed side panels.
- Standardize spacing, shape language, color treatment, and interaction feedback across toolbar, layers, and properties.
- Keep base typography at 16px (`1rem`) across editor surfaces.
- Use PrimeReact CSS variables for all semantic colors — surfaces, borders, text, and accents. Do **not** use Tailwind color utilities for semantic colors.
- Tailwind utilities are allowed for layout, spacing, sizing, and positioning only (e.g. `flex`, `gap-2`, `px-3`, `w-full`).
- Keep hover, focus-visible, active, selected, disabled, dragging, and drop-target states visibly distinct.

### PrimeReact color variables to use

| Need | Variable |
|---|---|
| Primary text | `var(--text-color)` |
| Secondary / muted text | `var(--text-color-secondary)` |
| Accent / action color | `var(--primary-color)` |
| Text on accent | `var(--primary-color-text)` |
| Dividers / borders | `var(--surface-border)` |
| Panel backgrounds | `var(--surface-card)`, `var(--surface-section)` |
| Hover background | `var(--surface-hover)` |
| Selected / highlighted | `var(--highlight-bg)`, `var(--highlight-text-color)` |
| Neutral steps | `var(--surface-0)` … `var(--surface-900)` |
| Named palette | `var(--blue-500)`, `var(--gray-200)`, etc. |

## Layout Guardrails

- Toolbar stays fixed bottom-center with icon-first actions and consistent spacing.
- Side panels stay fixed, support minimize/restore, and preserve explicit resize affordances where required.
- Canvas remains visually primary and must not be obscured by accidental overlay expansion.
- Tailwind utilities should handle shell layout, spacing, and panel positioning directly in component code.

## PrimeReact Theme Contract

- Maintain one central PrimeReact theme module for shared classes, helper functions, and pass-through configuration.
- Prefer reusable theme helpers such as `toolbarButton`, `iconButton`, `searchInput`, `accordion`, `selectButton`, and `overlayPanel` over duplicated local class strings.
- Prefer PrimeReact `unstyled` mode plus `className`, `inputClassName`, and `pt` APIs over stylesheet selectors.
- Do not rely on custom stylesheet classes or component-specific CSS overrides in `*.css` files.
- All color values inside `className`, `style`, and `pt` objects must use `var(--…)` tokens from the active PrimeReact theme — never hardcoded hex values or Tailwind color utilities.

## Interaction and Motion

- Use short, consistent transitions for controls (`~120-180ms`, ease-out).
- Do not animate fixed panel position in ways that create layout jitter.
- Prefer color, border, shadow, and opacity changes over movement for persistent containers.
- Keep selected toolbar states stronger than hover states.

## Acceptance Criteria

- Toolbar and panels remain responsive and functional across viewport sizes.
- UI components are reusable without hidden coupling to parent internals.
- Keyboard and focus behavior are predictable for all interactive controls.
- New UI follows the RUI shell pattern and panel/button styling conventions.
- Property UI additions reuse shared control primitives and mapping rules.
- Icon sizing, stroke weight, and interaction states remain consistent across toolbar and side panels.
- PrimeReact is the default choice for applicable form and panel widgets.
- PrimeReact styling is centralized and reused instead of duplicated across components.
- No custom CSS classes or selector-based component styling are introduced in `*.css` files.
