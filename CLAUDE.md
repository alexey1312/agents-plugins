# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Private Claude Code plugin marketplace with mobile development agents and skills.

```bash
# Install
/plugin marketplace add alexey1312/agents-marketplace
/plugin install mobile-toolkit@aleksei-agents
```

## Structure

```
.claude-plugin/
  marketplace.json          # Marketplace catalog
plugins/
  mobile-toolkit/
    plugin.json             # Plugin manifest
    agents/                 # Agent definitions (.md with frontmatter)
      ios-developer.md
      android-developer.md
      swift-expert.md
      flutter-expert.md
    skills/
      xcode-builder/        # XcodeBuildMCP integration
      to-toon/              # JSON/XML → TOON converter
    commands/
      pr-summary.md         # Generate PR summary from branch changes
```

## Plugin Marketplace Spec

Docs: https://code.claude.com/docs/en/plugin-marketplaces

### marketplace.json

```json
{
  "name": "marketplace-name",       // Required: kebab-case
  "owner": {"name": "", "url": ""}, // Required
  "plugins": [],                    // Required: plugin entries
  "pluginRoot": "./plugins",        // Optional: base path
  "description": "",                // Optional
  "version": ""                     // Optional
}
```

### Plugin Entry

```json
{
  "name": "plugin-name",            // Required
  "source": "./path",               // Required: path, GitHub, or URL
  "description": "",
  "category": ""
}
```

Source types:
- Relative: `"./plugins/my-plugin"`
- GitHub: `{"source": "github", "repo": "owner/repo"}`
- URL: `{"source": "url", "url": "https://..."}`

### plugin.json

```json
{
  "name": "plugin-name",
  "agents": "./agents",
  "skills": "./skills",
  "commands": "./commands"
}
```

## Component Formats

### Agent (.md)

```yaml
---
name: agent-name
description: When to use this agent
model: opus  # opus | sonnet | haiku
---
System prompt...
```

### Skill (SKILL.md)

```yaml
---
name: skill-name
description: When to invoke
---
Instructions...
```

Use `${CLAUDE_PLUGIN_ROOT}` for paths to skill resources.

### Command (.md)

```yaml
---
description: When to use this command
allowed-tools: Bash(git *), Read, Glob, Grep
---
Instructions...
```

## Available Components

| Type | Name | Description |
|------|------|-------------|
| Agent | `ios-developer` | SwiftUI, UIKit, Core Data |
| Agent | `android-developer` | Kotlin, Jetpack Compose |
| Agent | `swift-expert` | Swift 5.9+, async/await |
| Agent | `flutter-expert` | Cross-platform Flutter/Dart |
| Skill | `xcode-builder` | Build/test via XcodeBuildMCP |
| Skill | `to-toon` | JSON/XML/YAML → TOON format |
| Command | `pr-summary` | Generate PR summary from branch changes |

## XcodeBuildMCP

Always use `preferXcodebuild: true` to prevent token overflow. Use `simulatorId` (UUID) instead of `simulatorName`.

## Git

GitButler manages commits - do not use `git commit` directly.
