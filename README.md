# Rui - WYSIWYG Web Design Editor

A comprehensive, scalable WYSIWYG editor that supports the **entire CSS API**, empowering designers and developers to create pixel-perfect web designs visually.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Vision

Build the most powerful web-based design tool that enables visual creation of anything that can be built with CSS - from basic layouts to advanced animations and effects. See [VISION.md](VISION.md) for the complete vision statement.

## Features

- 🎨 **Complete CSS API Support**: Every CSS property, value, and selector
- ⚡ **Real-Time Visual Editing**: Drag-and-drop interface with instant preview
- 🏗️ **Scalable Architecture**: Agent-based development with specialized skills
- 🎯 **Professional Tools**: Layers, undo/redo, responsive design, themes
- 📤 **Export Capabilities**: Generate production-ready HTML/CSS
- ♿ **Accessibility First**: WCAG compliant with built-in a11y features
- 🚀 **Performance Optimized**: Smooth 60fps interactions with complex designs

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite with HMR
- **Routing**: React Router
- **Deployment**: GitHub Pages with CI/CD
- **Architecture**: Agent-based with skill-driven workflows

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the editor.

### Building

```bash
npm run build
```

## Architecture

This project uses a unique agent-based architecture:

- **Agents**: Specialized components for different editor aspects (UI, Canvas, Properties, etc.)
- **Skills**: Workflow definitions for implementing features systematically
- **Orchestration**: Coordinated multi-agent workflows for complex features

See [.github/AGENTS.md](.github/AGENTS.md) and [.github/skills/](.github/skills/) for details.

## Contributing

This project welcomes contributions! The agent-based architecture makes it easy to add new features:

1. Identify the appropriate agent/skill
2. Follow the workflow steps
3. Test thoroughly
4. Update documentation

## Roadmap

- [x] Basic editor with shapes and interactions
- [ ] Full CSS API support
- [ ] Advanced features (animations, themes, layers)
- [ ] Professional export capabilities
- [ ] Plugin ecosystem

## License

MIT License - see [LICENSE](LICENSE) for details.

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router and Vite.
