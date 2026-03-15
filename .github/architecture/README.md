# Architecture Program

This directory operationalizes the editor architecture target state.

## Canonical Source

- Skill blueprint: `.github/skills/architecture/governance/target-state/editor-architecture/SKILL.md`

## Execution Artifacts

- ADR index and templates: `.github/architecture/adrs/README.md`
- Current boundary map: `.github/architecture/current-boundary-map.md`
- Feature public API map: `.github/architecture/feature-public-api-map.md`
- Common violations playbook: `.github/architecture/violations-and-how-to-fix.md`
- PR checklist template: `.github/pull_request_template.md`

## Program Rules

- Sequence work by dependency order from ADR decisions and boundary maps.
- Keep changes incremental and reversible.
- Every architecture stream records decisions in an ADR before broad rollout.
- Every refactor PR includes rollback notes and risk checks.
- Every architecture-sensitive PR should complete the checklist in `.github/pull_request_template.md`.
- If a temporary boundary exception is required, record owner and expiry in `.github/architecture/feature-public-api-map.md`.
- Keep runtime structure product-oriented under `src/features` and `src/core`, with feature internals grouped by ownership (`components`, `interaction`, `model`, `domain`, `context`, `store`).

## Definition Of Progress

A stream is considered progressing when it has:

1. Boundary API introduced.
2. At least one production callsite migrated.
3. Legacy path marked for removal.
4. Follow-up tasks captured.

A stream is considered complete when:

1. Legacy path removed.
2. Build and typecheck pass.
3. ADR updated to final status.
4. Boundary and API maps reflect the finalized state.

## Maintenance Cadence

- Monthly: verify links, checklists, and exception register freshness.
- Quarterly: reconcile ADR status with boundary/API maps and update governance docs if drift is found.
