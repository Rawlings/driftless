---
name: themes
description: Implement theme management for the WYSIWYG editor, allowing global style sets and design system consistency.
user-invocable: true
metadata:
  taxonomy: styling/system/themes
---

## Objectives

- Provide consistent global theming across editor and created designs.
- Encourage token-based styling for reuse and maintainability.
- Keep theme switching predictable and reversible.

## Implementation Workflow

- Define a theme token model for colors, spacing, and typography.
- Apply tokens through style generation paths and defaults.
- Support theme presets and user overrides with clear precedence.
- Validate export compatibility for themed values.

## Acceptance Criteria

- Theme changes propagate to dependent styled elements.
- Token references remain stable across save and load operations.
- Theme application does not break individual element editing.
