---
name: editing
description: Handle property editing panels, form controls, validation, and style updates for selected elements in the WYSIWYG editor.
user-invocable: true
metadata:
  taxonomy: experience/interface/properties/editing
---

## Objectives

- Enable safe editing of style properties with immediate visual feedback.
- Keep input type handling consistent with property metadata.
- Avoid accidental state corruption from invalid values.
- Convert metadata semantics into the right control primitives for designer ergonomics.

## Implementation Workflow

- Drive property controls from the registry and grouped definitions.
- Source advanced property metadata from mdn-data and normalize into UI schema.
- Parse and normalize input values before state updates.
- Keep update logic centralized through the feature state boundary.
- Support default values when properties are unset.
- Prefer declarative control mapping rules over hardcoded per-property conditionals.
- Display property labels as raw CSS property names in kebab-case.
- Do not humanize labels or strip dashes from CSS property names.
- Prefer PrimeReact form controls for applicable property-editing UI primitives.

## PrimeReact Control Mapping

- Use `InputText` for freeform text fields and search.
- Use `InputNumber` for numeric inputs.
- Use `Slider` for bounded range values such as opacity.
- Use `Dropdown` for enumerated/select values and unit pickers.
- Use `ColorPicker` when color editing is appropriate.
- Use `Accordion` for grouped property sections when a collapsible panel pattern is needed.
- Keep PrimeReact components visually integrated with the editor shell through the shared central UI theme layer, using `className`, `inputClassName`, and pass-through styling instead of stylesheet selectors.

## Opportunities

- Use sliders for constrained numeric ranges such as opacity.
- Use unit-aware controls for length and length-percentage values.
- Add inline syntax hints and validation messages for complex properties.
- Add favorites and recent properties for faster designer workflows.

## Acceptance Criteria

- Edited values appear on canvas immediately.
- Numeric, color, select, and text inputs round-trip reliably.
- Invalid input is handled safely without breaking rendering.
- Property labels match real CSS names exactly, including dashes.
- PrimeReact components are used for supported property input controls.
