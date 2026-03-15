---
description: "Custom agents for WYSIWYG editor development. Use when: building UI components, canvas interactions, properties editing, or scalable editor features."
---

# WYSIWYG Editor Agents

This file defines specialized agents for developing the WYSIWYG editor. Each agent focuses on a specific aspect of the editor to ensure modular and scalable development.

## Available Agents

### UI Agent
**Description**: Handles UI components for the WYSIWYG editor, including toolbar, panels, layout, and user interface elements. Use when: creating buttons, panels, menus, or any UI-related components.

**Capabilities**:
- React component creation
- CSS styling and layout
- Responsive design
- Accessibility features

### Canvas Agent
**Description**: Manages the canvas rendering, element positioning, interactions like drag/resize, and shape manipulation. Use when: implementing canvas logic, element rendering, selection, or geometric operations.

**Capabilities**:
- CSS-based rendering
- Mouse event handling
- Element positioning and sizing
- Selection and highlighting

### Properties Agent
**Description**: Handles property editing logic, including input controls, validation, and style updates. Use when: creating property panels, form inputs, or style management.

**Capabilities**:
- Form controls
- State management for properties
- Validation and updates
- Style application
- MDN metadata integration (`properties`, `syntaxes`, `types`, `units`, `functions`, `definitions`)
- Grammar-aware control mapping (enum dropdown vs mixed freeform input)
- Typed hints and function-aware autocomplete suggestions

### Shapes Agent
**Description**: Manages shape definitions, creation, and type-specific logic. Use when: adding new shapes, modifying shape properties, or implementing shape-specific behaviors.

**Capabilities**:
- Shape data structures
- Shape rendering logic
- Type-specific styling
- Shape manipulation

### Integration Agent
**Description**: Coordinates between different parts of the editor, handles state synchronization, and manages complex interactions. Use when: integrating components, managing global state, or handling cross-component logic.

**Capabilities**:
- State synchronization
- Event handling
- Component integration
- Workflow management

### Orchestration Agent
**Description**: Manages the coordination of multiple agents for complex features, ensuring proper sequencing and integration. Use when: implementing features requiring multiple agents or planning large-scale changes.

**Capabilities**:
- Multi-agent workflow planning
- Dependency management
- Sequential agent execution
- Feature integration validation

### UndoRedo Agent
**Description**: Handles undo/redo functionality for user actions and state management. Use when: implementing history management or reversible operations.

**Capabilities**:
- State history tracking
- Undo/redo operations
- Action snapshots
- Memory management

### Layers Agent
**Description**: Manages element layers, z-index, and visual hierarchy. Use when: implementing layer controls or element organization.

**Capabilities**:
- Layer management
- Z-index handling
- Element grouping
- Visual hierarchy

### ExportImport Agent
**Description**: Handles saving/loading designs and code generation. Use when: implementing persistence or export features.

**Capabilities**:
- State serialization
- File I/O operations
- Code generation
- Format validation

### Responsive Agent
**Description**: Manages responsive design features and breakpoints. Use when: implementing adaptive layouts or media queries.

**Capabilities**:
- Breakpoint management
- Responsive properties
- Device previews
- Media query generation

### Animations Agent
**Description**: Handles CSS animations and transitions. Use when: implementing dynamic behaviors or interactive effects.

**Capabilities**:
- Animation properties
- Keyframe editing
- Transition controls
- Performance optimization

### Themes Agent
**Description**: Manages global themes and design systems. Use when: implementing theme switching or consistent styling.

**Capabilities**:
- Theme creation
- Global style application
- Preset themes
- CSS custom properties

### Accessibility Agent
**Description**: Ensures WCAG compliance and inclusive design. Use when: implementing a11y features or accessibility standards.

**Capabilities**:
- Keyboard navigation
- Screen reader support
- Contrast checking
- ARIA implementation

### Performance Agent
**Description**: Optimizes rendering and interaction performance. Use when: addressing performance issues or optimization needs.

**Capabilities**:
- Rendering optimization
- Memory management
- Interaction throttling
- Profiling tools

### Testing Agent
**Description**: Implements automated testing and quality assurance. Use when: adding test coverage or ensuring reliability.

**Capabilities**:
- Unit testing
- Integration testing
- E2E testing
- Coverage reporting

### CSSExpansion Agent
**Description**: Expands editor support for the complete CSS API. Use when: adding advanced CSS properties or extending styling capabilities.

**Capabilities**:
- Property registry extension
- Advanced input components
- Validation systems
- Browser compatibility

## Usage

## Property Metadata Baseline

- The properties panel displays all supported MDN properties (no Common/All mode toggle).
- Grouping should come from MDN `groups` first, with heuristic fallback only when metadata is missing.
- Control selection should be syntax-driven:
  - finite keyword-only grammars -> selectable controls
  - mixed/typed grammars (e.g. `box-shadow`) -> flexible text/autocomplete editing
- Suggestions should include both:
  - keyword tokens from expanded syntax references
  - function tokens from grammar/function metadata
- Type hints should be sourced from MDN `types.json` and surfaced in property rows.
- Unit options should be validated against MDN `units.json`.
- `definitions.json` should be used where available for canonical metadata normalization (e.g. group list validation).

## Theming Baseline

- Use only the imported default PrimeReact theme for PrimeReact components.
- Do not add or maintain a parallel token-based theming layer for PrimeReact UI surfaces.
- Prefer PrimeReact component defaults and props over custom styling wrappers.
- Use custom CSS only for layout/positioning or non-Prime canvas interaction affordances.
- **Color sourcing**: All semantic colors in editor UI must come from PrimeReact CSS variables — not from Tailwind color utilities.
  - Text: `var(--text-color)`, `var(--text-color-secondary)`
  - Accent: `var(--primary-color)`, `var(--primary-color-text)`
  - Surfaces: `var(--surface-ground)`, `var(--surface-card)`, `var(--surface-section)`, `var(--surface-overlay)`
  - Borders/dividers: `var(--surface-border)`
  - Hover: `var(--surface-hover)`
  - Selection: `var(--highlight-bg)`, `var(--highlight-text-color)`
  - Numeric steps: `var(--surface-0)` … `var(--surface-900)`
  - Named palette: `var(--blue-500)`, `var(--gray-200)`, etc.
- Tailwind utilities remain acceptable for layout, spacing, sizing, and flex/grid.
- For color, use Tailwind arbitrary value utilities that reference PrimeReact CSS variables (e.g. `text-[var(--text-color)]`, `bg-[var(--surface-card)]`, `border-[var(--surface-border)]`).
- Do not introduce custom semantic helper classes in `app/app.css` or `src/app.css` for color tokens when the same can be expressed inline with Tailwind variable utilities.
- For focus treatment, use outline-based styling (e.g. `outline-*`, `outline-offset-*`) rather than border/shadow rings for focus indicators.
- For docked side rails (Layers/Properties), prefer plain semantic containers over `Panel` when Panel features (toggle/collapse/chrome) are not required.
- Side rails should dock flush to viewport edges (no outer gap), and default chrome should avoid rounded corners.
- Use shadows (not borders) for floating chrome separation consistently across side rails and toolbar, unless a specific control needs a divider.
- For selected states in lists/trees, use high-contrast token pairs (e.g. `bg-[var(--primary-color)]` + `text-[var(--primary-color-text)]` or `bg-[var(--highlight-bg)]` + `text-[var(--highlight-text-color)]`).

To invoke an agent, mention it in your query, e.g., "Using the Canvas Agent, implement drag functionality."

For complex features requiring multiple agents, use the Orchestration Agent to coordinate the workflow.

These agents help maintain a scalable structure for the growing WYSIWYG editor project.