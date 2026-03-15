# Common Architecture Violations and Fixes

This playbook captures recurring low-level drift patterns and approved remediation paths.

## 1) Deep Cross-Feature Imports

### Violation

A feature imports sibling internals directly (for example, importing from nested files under another feature rather than its public boundary).

### Why it hurts

- Hidden coupling
- Refactor fragility
- Unclear ownership

### Preferred fix

1. Add or use the sibling feature public export boundary.
2. Move callsites to boundary imports.
3. Remove old deep import usage in the same change.
4. If temporary exception is required, document it in `.github/architecture/feature-public-api-map.md` with owner and expiry.
5. Verify with targeted code search in review (no hidden deep imports left under `src/features/**`).

## 2) Multi-Level State Prop Threading

### Violation

State and command props are passed through multiple components only to reach deep consumers.

### Why it hurts

- Wider rerender surfaces
- Component API noise
- Harder feature isolation

### Preferred fix

1. Expose state and actions through feature domain hooks or feature boundary context/store access.
2. Keep presentational components pure where practical.
3. Narrow command surfaces to feature intent (selection, transform, metadata, creation, layering).

## 3) Styling Rule Bypasses

### Violation

New UI uses ad hoc semantic colors or custom token systems outside PrimeReact variable conventions.

### Why it hurts

- Theme inconsistency
- Harder accessibility guarantees
- Visual drift across feature surfaces

### Preferred fix

1. Use PrimeReact components where appropriate.
2. Source semantic colors from PrimeReact CSS variables.
3. Keep Tailwind focused on layout, spacing, sizing, and positioning.
4. Use outline-based focus treatment.

## 4) React Boundary and Hook Drift

### Violation

React components bypass feature domain hooks, mix orchestration into presentational components, or thread feature state/actions deeply through props.

### Why it hurts

- Blurred feature boundaries
- Rerender cascades
- Harder refactors and regression risk in interaction-heavy flows

### Preferred fix

1. Route state and commands through feature domain hooks before touching raw context consumers.
2. Split orchestration and presentational concerns into separate components or hooks.
3. Use memoized derived data and stable callbacks where dependency-sensitive paths need it.
4. Validate with `.github/skills/architecture/governance/implementation/react-patterns/SKILL.md` before landing.

## Review Trigger

Run this playbook whenever a change:

- touches feature boundaries
- introduces new shared state pathways
- adds or rewrites editor UI chrome
