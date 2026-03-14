---
name: architecture-validation
description: Enforce architecture consistency through code review criteria, repository guardrails, and acceptance checks without introducing product-coupled validator scripts.
user-invocable: true
metadata:
  taxonomy: architecture/governance/enforcement/architecture-validation
---

## Objectives

- Keep architecture enforcement lightweight and maintainable.
- Use explicit acceptance criteria and review checks instead of ad-hoc structural scripts.
- Ensure every structural change proves runtime integrity via diagnostics and build.

## Enforcement Model

- Policy source: skill guardrails and repository documentation.
- Enforcement mechanism: PR review checklist + required build/typecheck status.
- Verification: no runtime code under forbidden patterns (for this repo: no `src/agents`).

## Acceptance Checks

- Runtime code organization matches agreed product modules.
- Feature boundaries remove unnecessary prop drilling for feature state/actions.
- No dead paths remain from superseded architecture.
- `npm run typecheck` and `npm run build` succeed.
- Advanced property coverage is dependency-driven from metadata sources.
- UI controls are mapped via shared rules, not ad-hoc per-property branching.
