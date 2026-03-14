---
name: layers-management
description: Implement layer management for the WYSIWYG editor, handling element stacking, z-index, grouping, and visual hierarchy using Tailwind CSS.
---

# Layers Management Skill

This skill provides a workflow for managing element layers in the WYSIWYG editor, including z-index control, grouping, and visual organization.

## Workflow Steps

1. **Layer Data Structure**: Extend element model to include z-index and layer information.

2. **Layer Panel UI**: Create a collapsible layers panel showing element hierarchy with drag-to-reorder.

3. **Z-Index Management**: Implement automatic z-index assignment and manual override controls.

4. **Grouping Functionality**: Add ability to group elements and manage group operations (move, resize as unit).

5. **Visual Indicators**: Add layer visibility toggles, lock/unlock elements, and selection highlights.

6. **Layer Operations**: Implement bring to front, send to back, move up/down layer actions.

7. **Integration with Canvas**: Ensure layer changes update canvas rendering and interactions.

## Assets

- Layer panel component with drag-and-drop.
- Z-index utilities and constants.
- Group management functions.
- Tailwind classes for layer indicators.

## Usage

Invoke this skill when adding layer controls to organize complex designs, ensuring intuitive visual hierarchy management.