---
name: expansion
description: Expand the WYSIWYG editor to support the entire CSS API, adding advanced properties, selectors, and styling capabilities.
user-invocable: true
metadata:
  taxonomy: styling/advanced/css-api/expansion
---

## Objectives

- Expand CSS support without destabilizing existing editing flows.
- Keep property additions driven by registry metadata.
- Preserve rendering fidelity between editor and exported output.
- Use mdn-data as canonical metadata for property inventory and baseline semantics.

## Implementation Workflow

- Derive advanced property catalogs from mdn-data metadata.
- Keep a curated common-first subset for designer productivity.
- Map metadata to controls through shared control mapping rules.
- Introduce specialized controls only when shared mapping cannot represent syntax well.
- Document any browser support caveats for advanced properties.
- Validate that new properties round-trip through state and UI.

## Opportunities

- Syntax-aware controls: alpha sliders, unit-aware numeric controls, keyword selects.
- Context-aware property suggestions based on display model and selected element type.
- Preset bundles for common workflows: cards, sections, typography, motion.
- Optional compatibility overlays from browser support datasets.

## Acceptance Criteria

- New CSS properties are editable from the properties panel.
- Values render correctly on canvas and survive state updates.
- Added properties do not regress existing controls.
