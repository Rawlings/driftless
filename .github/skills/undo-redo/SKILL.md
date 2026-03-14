---
name: undo-redo
description: Implement undo/redo functionality for the WYSIWYG editor, managing state history and user actions using immutable data structures.
---

# Undo/Redo Skill

This skill provides a workflow for implementing undo/redo functionality in the WYSIWYG editor, enabling users to revert and reapply changes to elements and their properties.

## Workflow Steps

1. **State History Management**: Set up an immutable history stack to track editor states (elements, selections, properties).

2. **Action Tracking**: Capture user actions (add element, move, resize, property change) and create snapshots.

3. **Undo Implementation**: Implement undo by reverting to previous state, updating UI and canvas accordingly.

4. **Redo Implementation**: Implement redo by advancing to next state in history.

5. **History Limits**: Set reasonable limits on history depth to manage memory usage.

6. **UI Integration**: Add undo/redo buttons to toolbar with keyboard shortcuts (Ctrl+Z, Ctrl+Y).

7. **Edge Case Handling**: Manage history during bulk operations, clear history on new document, etc.

## Assets

- Immutable state management utilities.
- History stack data structures.
- Keyboard event handlers for shortcuts.
- UI components for undo/redo controls.

## Usage

Invoke this skill when adding history management to the editor, ensuring all user actions are reversible for better UX.