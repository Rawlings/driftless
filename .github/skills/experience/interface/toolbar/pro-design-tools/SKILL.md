---
name: pro-design-tools
description: Orchestrate a scalable toolbar tool-system through focused tool-family skills and shared UX guardrails.
user-invocable: true
metadata:
  taxonomy: experience/interface/toolbar/pro-design-tools
---

## Objectives

- Build a professional multi-tool toolbar experience for designers.
- Support mode-based interactions with clear active tool state.
- Keep the toolbar extensible as tool families and capabilities expand.

## Sub-Skills

- Move tools: `experience/interface/toolbar/move-tools/SKILL.md`
- Region tools: `experience/interface/toolbar/region-tools/SKILL.md`
- Shape tools: `experience/interface/toolbar/shape-tools/SKILL.md`
- Creation tools: `experience/interface/toolbar/creation-tools/SKILL.md`
- Text tool: `experience/interface/toolbar/text-tool/SKILL.md`

## Integration Contract

- Keep one canonical tool registry for IDs, labels, icons, shortcuts, and strategy keys.
- Route canvas behavior through active tool strategy, not component-local branching.
- Ensure temporary overrides such as Space-for-hand are centralized and deterministic.
- Make toolbar and canvas state transitions reversible with clear undo boundaries.
- Keep one interaction owner per pointer sequence to avoid conflicting handlers.
- Keep stage hit testing and event routing defined in one shared contract.
- Keep tool transition policy explicit:
  - persistent tools stay active until changed
  - single-shot tools may auto-return to move
  - temporary overrides must restore previous tool

## UX Guardrails

- Single active tool at a time with explicit mode indicator.
- Tool families exposed as grouped menus with stable defaults.
- Temporary tool override support for viewport navigation.
- Cursor changes and affordance overlays must reflect active tool.
- Tool changes should never silently mutate selected objects.

## Accessibility and Input Standards

- Move is default on file open.
- Shortcuts must be conflict-aware, discoverable, and documented in tooltips.
- Touch and pointer interactions must keep pan behavior available without accidental selection.
- Active tool state must be exposed to assistive technologies.

## Acceptance Criteria

- Tool families are implemented through dedicated sub-skills with no duplicated logic contracts.
- Switching tools updates canvas behavior immediately and predictably.
- Tool-specific workflows preserve selection integrity and undo quality.
- Toolbar remains compact, keyboard-friendly, and touch-aware.
