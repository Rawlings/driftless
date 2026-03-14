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

## Usage

To invoke an agent, mention it in your query, e.g., "Using the Canvas Agent, implement drag functionality."

These agents help maintain a scalable structure for the growing WYSIWYG editor project.