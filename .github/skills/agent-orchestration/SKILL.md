---
name: agent-orchestration
description: Coordinate multiple agents for complex WYSIWYG editor features, managing workflows, dependencies, and integrations using Tailwind CSS.
---

# Agent Orchestration Skill

This skill provides a workflow for coordinating multiple specialized agents to implement complex features in the WYSIWYG editor, ensuring seamless integration and consistent Tailwind CSS styling.

## Workflow Steps

1. **Feature Analysis**: Break down the feature request into components requiring different agents (UI, Canvas, Properties, Shapes, Integration).

2. **Agent Identification**: Determine which agents are needed based on the feature scope:
   - UI Agent: For toolbar, panels, menus, responsive design.
   - Canvas Agent: For rendering, positioning, drag/resize, selection.
   - Properties Agent: For property panels, form controls, validation, style updates.
   - Shapes Agent: For shape definitions, creation, type-specific logic.
   - Integration Agent: For state synchronization, event handling, cross-component logic.
   - UndoRedo Agent: For history management and reversible operations.
   - Layers Agent: For element organization and visual hierarchy.
   - ExportImport Agent: For persistence and code generation.
   - Responsive Agent: For breakpoint management and adaptive layouts.
   - Animations Agent: For dynamic behaviors and transitions.
   - Themes Agent: For global styling and design systems.
   - Accessibility Agent: For inclusive design and WCAG compliance.
   - Performance Agent: For optimization and efficiency.
   - Testing Agent: For quality assurance and reliability.
   - CSSExpansion Agent: For advanced CSS properties and API support.

3. **Dependency Mapping**: Identify dependencies and execution order between agents to avoid conflicts.

4. **Sequential Execution**: Invoke agents in the planned order, passing context and requirements.

5. **Integration Phase**: Use the Integration Agent to combine outputs, handle state synchronization, and ensure cross-component functionality.

6. **Validation and Testing**: Run automated tests, check for build errors, and validate feature functionality.

7. **Documentation Update**: Update AGENTS.md or relevant docs if new patterns emerge.

## Assets

- Agent invocation templates for common feature types.
- Dependency graphs for multi-agent workflows.
- Integration checklists for cross-agent features.
- Tailwind CSS consistency guidelines.

## Usage

Invoke this skill when implementing features that require coordination between multiple agents, such as adding a new shape with properties panel and canvas interactions. Ensure all agents use Tailwind CSS for styling consistency.