---
name: agent-orchestration
description: Coordinate multiple agents for complex WYSIWYG editor features, managing workflows, dependencies, and integrations.
user-invocable: true
metadata:
  taxonomy: architecture/coordination/workflows/agent-orchestration
---

## Guardrails

- Use agents to plan and execute work, not to define runtime source tree names.
- Keep runtime implementation organized by product concerns, not by agent labels.
- Ensure orchestration tasks include cleanup of deprecated files and stale imports after structural moves.
