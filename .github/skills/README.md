# Skills Taxonomy

This directory is organized by high-level architecture domains with deeper nesting for scope clarity.

## Top-level domains

- architecture: coordination, orchestration, integration, and state history
- experience: authoring tools and interface editing workflows
- styling: CSS system, motion, responsive behavior, and API expansion
- quality: accessibility, testing, and performance
- data: serialization and exchange workflows

## Canonical skill locations

- architecture/coordination/multi-agent/orchestration/SKILL.md
- architecture/coordination/system-integration/SKILL.md
- architecture/coordination/workflows/agent-orchestration/SKILL.md
- architecture/governance/scalability/guardrails/SKILL.md
- architecture/governance/enforcement/architecture-validation/SKILL.md
- architecture/state/history/undo-redo/SKILL.md
- experience/authoring/canvas/interactions/SKILL.md
- experience/authoring/layers/management/SKILL.md
- experience/authoring/shapes/management/SKILL.md
- experience/interface/components/ui/SKILL.md
- experience/interface/design-system/rui-ui-style/SKILL.md
- experience/interface/properties/editing/SKILL.md
- experience/interface/properties/metadata-control-mapping/SKILL.md
- experience/interface/toolbar/pro-design-tools/SKILL.md
- styling/advanced/css-api/expansion/SKILL.md
- styling/advanced/css-api/mdn-driven-registry/SKILL.md
- styling/motion/animations/SKILL.md
- styling/system/responsive-design/SKILL.md
- styling/system/themes/SKILL.md
- quality/accessibility/wcag/SKILL.md
- quality/performance/optimization/SKILL.md
- quality/testing/automation/SKILL.md
- data/serialization/export-import/SKILL.md

## Standards

- Skill frontmatter only uses supported attributes.
- Canonical entries are `name`, `description`, `user-invocable`, and `metadata`.
- Legacy path aliases are documented in aliases.json.

## Product Architecture Guardrails

- Runtime product code must use product-oriented structure such as `src/features`, `src/components`, `src/core`, and `src/hooks`.
- Do not place runtime UI or domain logic under `src/agents`.
- Agent terminology is workflow-only and belongs in documentation or Copilot skill/agent configuration, not product runtime folders.
- Every refactor must remove dead paths and stale imports in the same change.
- Moves must be completed end-to-end: relocate files, update imports, delete obsolete folders, and validate with build and diagnostics.

## MDN-Driven Guardrails

- Use mdn-data as canonical CSS property metadata.
- Hardcode only curated common-first UX groups; derive advanced catalogs from metadata.
- Map property controls from metadata semantics and syntax, not ad-hoc name lists.
- Keep control mapping and validation test-covered as the catalog scales.
