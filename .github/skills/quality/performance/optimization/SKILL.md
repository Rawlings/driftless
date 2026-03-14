---
name: optimization
description: Optimize performance of the WYSIWYG editor, focusing on rendering speed, memory usage, and smooth interactions.
user-invocable: true
metadata:
  taxonomy: quality/performance/optimization
---

## Objectives

- Keep canvas interactions responsive under increasing element counts.
- Minimize unnecessary re-renders across editor panels.
- Prevent expensive updates during high-frequency pointer movement.

## Implementation Workflow

- Profile interaction paths before and after changes.
- Use memoization and stable callbacks where measurable.
- Batch or coalesce move updates when needed.
- Avoid repeated expensive lookups in per-frame paths.
- Cache normalized metadata and derived groups to avoid repeated recomputation.
- Use search indexing and optional list virtualization for large property sets.
- Keep heavy metadata processing off critical interaction paths.

## Acceptance Criteria

- Drag and resize remain smooth for typical project sizes.
- No obvious frame drops from avoidable rerender cascades.
- Performance changes are validated with before and after measurements.
- Property panel remains responsive with large metadata-backed catalogs.
