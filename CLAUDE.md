# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Private Claude Code plugin marketplace with mobile development agents, skills, commands, and automation hooks. Each component is an independent plugin with its own `plugin.json`, organized by category.

**Name:** `aleksei-plugins`
**Version:** 1.0.0

## Documentation References

- [Claude Code Plugins](https://docs.anthropic.com/en/docs/claude-code/plugins)
- [Plugin Manifest](https://docs.anthropic.com/en/docs/claude-code/plugins#plugin-json)
- [Marketplace Format](https://docs.anthropic.com/en/docs/claude-code/plugins#marketplace)

## Plugin Structure

Each plugin follows the same layout:

```
plugin-name/
  .claude-plugin/
    plugin.json       # Plugin manifest (name, description, version, author)
  agents/             # Agent definitions (.md)
  skills/             # Skill definitions (SKILL.md or .md)
  commands/           # Command definitions (.md)
  hooks/              # Hook definitions (hooks.json)
  README.md           # Plugin documentation
```

## Naming Conventions

- **Plugin names**: kebab-case (`ios-developer`, `xcode-builder`, `review-swift`)
- **File names**: match plugin name (`ios-developer.md`, `xcode-builder.md`)
- **Directories**: match plugin name, nested under category

## Plugin Manifest Format

```json
{
  "name": "plugin-name",
  "description": "What this plugin does",
  "version": "1.0.0",
  "author": {
    "name": "alexey1312"
  }
}
```

## Marketplace Index Format

`.claude-plugin/marketplace.json` registers all plugins:

```json
{
  "name": "aleksei-plugins",
  "version": "1.0.0",
  "owner": { "name": "alexey1312" },
  "plugins": [
    {
      "name": "plugin-name",
      "description": "What it does",
      "source": "./plugins/category/plugin-name",
      "category": "development"
    }
  ]
}
```

Categories: `development`, `productivity`

## Plugin Organization

```
.claude-plugin/
  plugin.json                              # Root manifest
  marketplace.json                         # Registry (16 plugins)

plugins/
  agents/
    ios-developer/                         # opus
    android-developer/                     # opus
    swift-expert/                          # opus
    flutter-expert/                        # sonnet
  skills/
    xcode-builder/                         # Build/test with xcsift
    to-toon/                               # JSON/XML/YAML → TOON
    xcsift/                                # Swift build wrapper
    simulator-manager/                     # iOS simulator management
    swiftlint-fixer/                       # SwiftLint auto-fix
    humanizer/                             # Remove AI writing patterns (github:blader/humanizer)
  commands/
    spawn/                                 # Parallel agent spawning
    pr/                                    # PR workflow (summary + create)
    review-swift/                          # Swift code review
    analyze-build/                         # Build analysis
    generate-changelog/                    # Changelog generation
  hooks/
    hooks-collection/                      # Build/lint automation hooks
```

## Component Formats

### Agent (.md)

```yaml
---
name: agent-name
description: When to use this agent
model: opus  # opus | sonnet | haiku
tools: Read, Write, Edit, Bash, Glob, Grep
---
System prompt with instructions...
```

### Skill (SKILL.md or .md)

```yaml
---
name: skill-name
description: When to invoke
---
Instructions and examples...
```

Use `${CLAUDE_PLUGIN_ROOT}` for paths to skill resources.

### Command (.md)

```yaml
---
description: When to use this command
allowed-tools: Bash(git *), Read, Glob, Grep
version: 1.0
---
Instructions and workflow...
```

### Hooks (hooks.json)

```json
{
  "PreToolUse": [{
    "matcher": "Bash.*swift build",
    "hooks": [{"type": "command", "command": "echo 'Tip'"}]
  }]
}
```

## Model Selection

| Task Type | Model | Plugins |
|-----------|-------|---------|
| Architecture, Security | opus | ios-developer, android-developer, swift-expert |
| Cross-platform, Standard | sonnet | flutter-expert |
| Documentation, Reports | haiku | — |

## Installation

```bash
# Add marketplace
/plugin marketplace add alexey1312/agents-marketplace

# Install individual plugins
/plugin install ios-developer@aleksei-plugins
/plugin install xcode-builder@aleksei-plugins
/plugin install review-swift@aleksei-plugins
```

## Dependencies

```bash
brew install ldomaradzki/tap/xcsift   # xcode-builder, xcsift, analyze-build
brew install swiftlint                 # swiftlint-fixer
```

## Maintenance

When adding/removing plugins, keep in sync:
- `.claude-plugin/marketplace.json` — plugin registry
- `CLAUDE.md` — Plugin Organization tree
- `README.md` — plugin tables and structure

## Git

GitButler manages commits — do not use `git commit` directly.
