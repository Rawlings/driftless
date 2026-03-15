# Skills Taxonomy

This directory is organized by high-level architecture domains with deeper nesting for scope clarity.

## Top-level domains

- architecture: coordination, governance, orchestration, integration, and state history
- experience: authoring tools and interface editing workflows
- styling: CSS system, motion, responsive behavior, and API expansion
- quality: accessibility, testing, and performance
- data: serialization and exchange workflows

## Canonical skill locations

- architecture/coordination/multi-agent/orchestration/SKILL.md
- architecture/coordination/system-integration/SKILL.md
- architecture/coordination/workflows/agent-orchestration/SKILL.md
- architecture/governance/target-state/editor-architecture/SKILL.md
- architecture/governance/implementation/react-patterns/SKILL.md
- architecture/governance/scalability/guardrails/SKILL.md
- architecture/governance/enforcement/architecture-validation/SKILL.md
- architecture/state/history/undo-redo/SKILL.md
- experience/authoring/canvas/interactions/SKILL.md
- experience/authoring/layers/layer-tree/SKILL.md
- experience/authoring/layers/management/SKILL.md
- experience/authoring/shapes/management/SKILL.md
- experience/interface/components/ui/SKILL.md
- experience/interface/properties/editing/SKILL.md
- experience/interface/properties/metadata-control-mapping/SKILL.md
- experience/interface/toolbar/creation-tools/SKILL.md
- experience/interface/toolbar/move-tools/SKILL.md
- experience/interface/toolbar/pro-design-tools/SKILL.md
- experience/interface/toolbar/region-tools/SKILL.md
- experience/interface/toolbar/shape-tools/SKILL.md
- experience/interface/toolbar/text-tool/SKILL.md
- styling/advanced/css-api/expansion/SKILL.md
- styling/advanced/css-api/mdn-driven-registry/SKILL.md
- styling/motion/animations/SKILL.md
- styling/system/responsive-design/SKILL.md
- styling/system/themes/SKILL.md
- quality/accessibility/wcag/SKILL.md
- quality/performance/optimization/SKILL.md
- quality/testing/automation/SKILL.md
- data/serialization/export-import/SKILL.md

## Invocation Routing

Use this quick map before implementation:

- canvas interactions: `experience/authoring/canvas/interactions/SKILL.md` + `architecture/governance/target-state/editor-architecture/SKILL.md`
- snapping/performance: `experience/authoring/canvas/snapping/SKILL.md` + `quality/performance/optimization/SKILL.md`
- properties editing: `experience/interface/properties/editing/SKILL.md` + `experience/interface/properties/metadata-control-mapping/SKILL.md`
- toolbar changes: `experience/interface/toolbar/*` skills + `experience/interface/components/ui/SKILL.md`
- state/command boundaries: `architecture/governance/target-state/editor-architecture/SKILL.md` + `architecture/governance/scalability/guardrails/SKILL.md`
- react implementation patterns: `architecture/governance/implementation/react-patterns/SKILL.md` + `architecture/governance/target-state/editor-architecture/SKILL.md`
- cross-feature integration: `architecture/coordination/system-integration/SKILL.md` + `architecture/governance/enforcement/architecture-validation/SKILL.md`
- styling/theming: `styling/system/themes/SKILL.md` + repository AGENTS theming baseline

## Invocation Examples

- "Using the editor-architecture skill, assess whether this refactor improves module boundaries before I start coding."
- "Using the canvas interactions skill and guardrails, implement drag behavior without introducing state prop threading."
- "Using the react-patterns skill, refactor this component into boundary hook + presentational split without changing behavior."
- "Using the metadata-control-mapping skill, add a control for this CSS property using syntax-driven mapping."
- "Using the architecture-validation skill, review this PR for boundary regressions and dependency drift."

## Standards

- Skill frontmatter only uses supported attributes.
- Canonical entries are `name`, `description`, `user-invocable`, and `metadata`.
- Legacy path aliases are documented in aliases.json.

## Product Architecture Guardrails

- Canonical architecture target-state guidance lives in `architecture/governance/target-state/editor-architecture/SKILL.md`.
- Governance and validation skills should reference that target-state skill rather than duplicating policy text.

- Runtime product code must use product-oriented structure such as `src/features` and `src/core`, with feature internals organized by ownership (for example `components`, `interaction`, `model`, `domain`, `context`, `store`).
- Do not place runtime UI or domain logic under `src/agents`.
- Agent terminology is workflow-only and belongs in documentation or Copilot skill/agent configuration, not product runtime folders.
- Every refactor must remove dead paths and stale imports in the same change.
- Moves must be completed end-to-end: relocate files, update imports, delete obsolete folders, and validate with build and diagnostics.
- For non-differentiating infrastructure, audit mature NPM packages before implementing custom solutions.
- If custom infrastructure is selected, document package options considered and why custom code is the better fit.

## MDN-Driven Guardrails

- Use mdn-data as canonical CSS property metadata.
- Hardcode only curated common-first UX groups; derive advanced catalogs from metadata.
- Map property controls from metadata semantics and syntax, not ad-hoc name lists.
- Keep control mapping and validation test-covered as the catalog scales.

## Maintenance Cadence

- Monthly: verify canonical skill paths and invocation routing examples remain accurate.
- Quarterly: reconcile governance skill wording with architecture ADR status and boundary maps.
