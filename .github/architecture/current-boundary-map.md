# Current Boundary Map

Date: 2026-03-15
Owner: architecture working group

## Runtime Shell

- Active SPA entry: `src/main.tsx`
- Route composition handled in `src/App.tsx` (`/`, `/editor`)
- Canonical style owner: `src/app.css`

## Editor State Boundary

- Context ownership: `src/features/state/context/editorContext.tsx`
- Domain adapters: `src/features/state/domain/*Domain.ts`
- Editor data model: `src/features/state/model/editorState.ts`
- UI store: `src/features/state/store/uiStore.ts`
- Public feature surface: `src/features/state/index.ts` exports provider + domain hooks only
- Canvas command domain exposes semantic commands (`startTextEditing`, `stopTextEditing`, `clearSnapGuides`, `updateSnapGuides`, `clearCanvasSelection`)

## Canvas Interaction Boundary

- Canvas components: `src/features/canvas/components/*`
- Interaction state and gesture hooks: `src/features/canvas/interaction/*`
- Canvas model contracts and snapping: `src/features/canvas/model/*`
- Dispatch admission is machine-native (`interactionState.can(event)` in `src/features/canvas/components/Canvas.tsx`)
- Start side effects (shape/text/edit/pan) are gated on admitted transitions
- Public canvas type API exposes shared `SnapGuide` from `src/features/canvas/model/canvasTypes.ts`

## Property Pipeline Boundary

- Pipeline contracts: `src/features/properties/model/propertyPipeline.ts`
- Registry coordinator: `src/features/properties/model/propertyRegistry.ts` (construction/cache internals are private)
- Feature-facing facade: `src/features/properties/domain/propertyRegistryDomain.ts` (search-only grouped resolution)
- Properties consumers use `src/features/properties/domain/useGroupedPropertyRegistry.ts`

## Styling and UI Boundary

- Shared UI primitives live in `src/features/ui/*` and export via `src/features/ui/index.ts`
- Adopted shared primitives: `EditorShell`, `SideRail`, `IconActionButton`, `PanelSearchInput`, `PanelEmptyState`
- PrimeReact CSS variable sourcing remains the semantic color baseline

## Cross-feature Dependencies

- Cross-feature imports route through feature public entries (`src/features/*/index.ts`)
- Deep cross-feature relative imports under `src/features/**` are eliminated
- Detailed module-level surface is tracked in `.github/architecture/feature-public-api-map.md`

## Review and Remediation Assets

- PR architecture checklist: `.github/pull_request_template.md`
- Violation fixes playbook: `.github/architecture/violations-and-how-to-fix.md`
