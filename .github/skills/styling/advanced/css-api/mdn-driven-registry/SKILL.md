---
name: mdn-driven-registry
description: Drive CSS property coverage from mdn-data metadata and map syntax-aware controls for scalable designer UX.
user-invocable: true
metadata:
  taxonomy: styling/advanced/css-api/mdn-driven-registry
---

## Objectives

- Use mdn-data as the canonical source for CSS property metadata.
- Minimize hardcoded property definitions to a curated common layer only.
- Convert metadata into strongly typed, UI-ready property definitions.

## Metadata Strategy

- Source of truth: mdn-data css properties dataset.
- Derived model fields:
  - cssProperty
  - label
  - syntax
  - initial
  - category
  - tier
  - controlType
  - options
  - constraints
- Keep generated and curated layers separate.

## Control Mapping Model

- Map by syntax and semantics, not by property name only.
- Preferred mapping examples:
  - <alpha-value> -> slider 0 to 1
  - <length> and <length-percentage> -> unit-aware numeric input
  - <color> -> color picker with text fallback
  - enum-like keywords -> select
  - complex grammar -> advanced text editor with validation hints

## Architecture Pattern

- Curated common registry for designer-first flow.
- MDN-derived advanced registry for full coverage.
- Merged view layer with search, filters, and category grouping.
- Validation layer that checks syntax compatibility before commit.

## Opportunities

- Add browser support badges using compatibility data.
- Add semantic templates per use case: layout, type, effects, interaction.
- Add contextual recommendations based on selected element display model.
- Add AI-assisted suggestions constrained by valid CSS grammar.

## Acceptance Criteria

- Registry generation path is deterministic from mdn-data.
- New MDN properties become available without manual property hardcoding.
- Control mapping is testable and property-type aware.
- Common-first UX remains stable while advanced catalog scales.
