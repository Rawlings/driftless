---
name: export-import
description: Implement export and import functionality for the WYSIWYG editor, supporting JSON state saving/loading and CSS/HTML code generation.
---

# Export/Import Skill

This skill provides a workflow for saving and loading editor designs, enabling persistence and code generation for the WYSIWYG editor.

## Workflow Steps

1. **State Serialization**: Create functions to serialize editor state (elements, properties, layers) to JSON.

2. **Import Functionality**: Implement loading from JSON, validating structure and applying to editor state.

3. **Export Formats**: Add export to HTML/CSS, generating clean markup and stylesheets.

4. **File Handling**: Integrate with browser File API for save/load dialogs.

5. **Version Compatibility**: Handle schema versioning for backward compatibility.

6. **UI Integration**: Add export/import buttons to toolbar with format options.

7. **Error Handling**: Validate imports and provide user feedback for invalid files.

## Assets

- Serialization/deserialization utilities.
- HTML/CSS generation templates.
- File I/O handlers.
- Validation schemas.

## Usage

Invoke this skill when adding persistence and code generation features, enabling users to save work and export designs.