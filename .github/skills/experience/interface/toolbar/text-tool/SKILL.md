---
name: text-tool
description: Define text-tool behaviors for inline and bounded text creation, editing, and typographic control in interface design workflows.
user-invocable: true
metadata:
  taxonomy: experience/interface/toolbar/text-tool
---

## Objectives

- Make text creation intuitive for both quick labels and structured content.
- Keep typography controls close to selection context.
- Ensure text editing mode is unambiguous and safe from accidental canvas gestures.

## UX Behavior Model

- Entry points:
  - T activates Text tool.
  - Single click creates auto-width text that grows horizontally.
  - Click-drag creates fixed-size text box with wrapping.
- Editing states:
  - Enter text mode on creation with visible caret.
  - Escape exits text mode and returns to selection behavior.
  - Double click existing text enters edit mode.

## Typography Controls

- Surface core controls in properties:
  - font family
  - size
  - weight
  - line height
  - letter spacing
  - alignment
- Support text auto-resize options and explicit box sizing.

## Interaction Rules

- Pointer drags in text-edit mode should select text, not move layer.
- Move or scale interactions apply only after exiting text-edit mode.
- Text creation and edits should produce clear undo boundaries.

## Accessibility and Shortcuts

- T for text tool activation.
- Selection and focus rings must remain visible on text layers.
- Text controls should be fully keyboard operable.

## Acceptance Criteria

- Click and drag text creation modes both work reliably.
- Text edit mode transitions are clear and reversible.
- Typography controls update canvas text immediately.
- Undo and redo preserve content and layout changes correctly.
