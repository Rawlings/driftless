---
name: responsive-design
description: Implement responsive design features for the WYSIWYG editor, handling breakpoints, media queries, and adaptive layouts.
user-invocable: true
metadata:
  taxonomy: styling/system/responsive-design
---

## Objectives

- Enable responsive editing workflows across defined breakpoints.
- Keep responsive overrides explicit and inspectable.
- Prevent breakpoint changes from corrupting base style values.

## Implementation Workflow

- Define breakpoint model and inheritance rules.
- Store overrides separately from base properties where appropriate.
- Surface active breakpoint context clearly in UI.
- Validate fallback behavior when overrides are removed.

## Acceptance Criteria

- Editing at a breakpoint updates only intended responsive values.
- Base styles remain stable when switching breakpoints.
- Rendered output reflects responsive rules consistently.
