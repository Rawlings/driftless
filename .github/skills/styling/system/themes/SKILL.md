---
name: themes
description: Implement theme management for the WYSIWYG editor, allowing global style sets and design system consistency.
user-invocable: true
metadata:
  taxonomy: styling/system/themes
---

## Objectives

- Provide consistent global theming across editor and created designs.
- Consume PrimeReact theme tokens for all editor UI coloring.
- Keep theme switching predictable and reversible.

## Color Sourcing — PrimeReact CSS Variables

All UI color values must come from the active PrimeReact theme via CSS variables. Do **not** use Tailwind color utilities (e.g. `text-slate-500`, `bg-slate-100`) for semantic colors.

### General variables

| Variable | Description |
|---|---|
| `--text-color` | Primary font color |
| `--text-color-secondary` | Muted secondary text color |
| `--primary-color` | Theme accent/action color |
| `--primary-color-text` | Text on a `--primary-color` background |
| `--border-radius` | Common component border radius |
| `--inline-spacing` | Space between adjacent inline items |
| `--surface-border` | Divider / border color |
| `--surface-hover` | Background on hover |
| `--highlight-bg` | Background of a highlighted / selected item |
| `--highlight-text-color` | Text on a highlighted item |

### Surface palette

Use named surface variables for layered backgrounds:

```
--surface-ground     base canvas / app background
--surface-section    section within a ground surface
--surface-card       card-level surface
--surface-overlay    overlay / tooltip surface
--surface-border     divider color
--surface-hover      hover background
```

Numeric surface steps are also available: `--surface-0` through `--surface-900`.

### Color palette

Named palette tokens follow the pattern `--{color}-{shade}`, e.g. `var(--blue-500)`, `var(--surface-200)`.  
Available families: `primary`, `blue`, `green`, `yellow`, `cyan`, `pink`, `indigo`, `teal`, `orange`, `bluegray`, `purple`, `red`, `gray`.

## Usage pattern

```tsx
// Correct — uses PrimeReact theme token
<span style={{ color: 'var(--text-color-secondary)' }} />

// Correct in Tailwind — layout only (no color)
<div className="flex items-center gap-2 px-3 py-2">

// Incorrect — hardcoded Tailwind color for semantic meaning
<span className="text-slate-500" />
```

## Implementation Workflow

- Source all UI colors from PrimeReact CSS variables, not Tailwind color utilities.
- Apply surface variables for panel backgrounds and dividers.
- Support theme presets and user overrides with clear precedence.
- Validate export compatibility for themed values.

## Acceptance Criteria

- Theme changes propagate to dependent styled elements.
- No hardcoded Tailwind color utilities for semantic color in editor UI.
- Token references remain stable across save and load operations.
- Theme application does not break individual element editing.
