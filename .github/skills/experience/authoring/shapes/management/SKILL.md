---
name: management
description: Manage shape definitions, creation logic, type-specific rendering, and manipulation for the WYSIWYG editor.
user-invocable: true
metadata:
  taxonomy: experience/authoring/shapes/management
---

## Objectives

- Add and manage shape types through a consistent data contract.
- Keep shape-specific defaults and constraints explicit.
- Avoid shape logic leaking into unrelated feature modules.

## Implementation Workflow

- Define shape defaults in one module and reuse during creation.
- Keep shared style fields in common types and shape overrides additive.
- Validate shape-specific constraints during resize and property edits.
- Keep renderer behavior based on shape data, not hardcoded branches in many files.

## Acceptance Criteria

- New shape types can be added with minimal changes to existing code.
- Shape defaults are applied consistently on creation.
- Shape interactions remain compatible with selection, drag, and resize flows.
