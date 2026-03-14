---
name: metadata-control-mapping
description: Design and enforce a generalized metadata-to-control mapping architecture that scales across CSS value families and complex syntax grammars.
user-invocable: true
metadata:
  taxonomy: experience/interface/properties/metadata-control-mapping
---

## Objectives

- Replace property-name heuristics with syntax-aware control mapping.
- Cover broad CSS data families with reusable control primitives.
- Keep mapping rules centralized, testable, and extensible.

## Problem Framing

- CSS value space is heterogeneous and grammar-heavy.
- A one-off per-property approach does not scale to full API coverage.
- Designer UX requires progressive disclosure and sane defaults.

## Target Architecture

- Metadata source layer:
  - mdn-data provides syntax and initial values.
- Normalization layer:
  - Convert raw metadata into canonical property records.
- Classification layer:
  - Detect value families from syntax tokens and property semantics.
- Mapping layer:
  - Resolve control config by ordered declarative rules.
- Rendering layer:
  - Render reusable controls from control config only.
- Validation layer:
  - Parse and validate control output before commit.

## Value Family Coverage Model

- Scalar numeric:
  - number
  - integer
  - percentage
  - alpha-value
- Dimensional:
  - length
  - length-percentage
  - angle
  - time
- Visual:
  - color
  - image
  - url
- Keyword-driven:
  - enum-like keyword sets
  - custom-ident and dashed-ident
- Composite grammar:
  - token sequences and function-like values

## Control Mapping Strategy

- Use a prioritized rule table, not ad-hoc branching.
- Recommended primitive controls:
  - slider
  - number input
  - unit-number input
  - keyword select
  - color picker
  - tokenized composite editor
  - raw text fallback
- Always keep a fallback path for unsupported grammar.

## UX Strategy

- Common mode:
  - show curated high-frequency controls.
- All mode:
  - expose full metadata-derived catalog.
- Expert fallback:
  - allow direct text editing for complex values.

## Extensibility Rules

- Add new family mappings in one mapper module.
- Keep control primitive API stable and reusable.
- Avoid property-specific rendering logic in generic UI controls.
- Separate generated advanced metadata from curated common definitions.

## Performance and Reliability

- Cache normalized metadata and derived control configs.
- Pre-group and index properties for search and filtering.
- Add tests for:
  - family classification
  - control selection
  - constraints mapping
  - fallback behavior

## Acceptance Criteria

- New CSS properties become operable through metadata and mapper rules.
- Control selection is deterministic and covered by tests.
- Complex grammar still has a safe fallback editor path.
- Designer-focused common mode remains clean while advanced mode scales.
