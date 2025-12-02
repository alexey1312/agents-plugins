# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a private Claude Code plugin marketplace containing mobile development agents and skills. The marketplace can be installed via `/plugin marketplace add alexey1312/agents-marketplace`.

## Repository Structure

```
.claude-plugin/marketplace.json   # Marketplace definition
plugins/
  mobile-toolkit/                 # Main plugin
    plugin.json                   # Plugin manifest
    agents/                       # Agent definitions (markdown frontmatter)
    skills/
      xcode-builder/              # Xcode build/test skill
      to-toon/                    # TOON format converter skill
```

## Plugin Marketplace Specification

Reference: https://code.claude.com/docs/en/plugin-marketplaces

### marketplace.json Schema

**Required fields:**
- `name` - Marketplace identifier (kebab-case)
- `owner` - Maintainer info object (`name`, `url`)
- `plugins` - Array of plugin entries

**Optional fields:**
- `metadata.description` - Brief overview
- `metadata.version` - Marketplace version
- `metadata.pluginRoot` - Base path for relative sources

### Plugin Entry Schema

**Required:** `name`, `source`

**Optional:**
- `description`, `version`, `author`, `homepage`, `repository`
- `license` - SPDX identifier (e.g., MIT)
- `keywords`, `tags`, `category` - Discovery/organization
- `commands`, `agents`, `hooks`, `mcpServers` - Component paths

### Source Types

```json
// Relative path
"source": "./plugins/my-plugin"

// GitHub repo
"source": {"source": "github", "repo": "owner/repo"}

// Git URL
"source": {"source": "url", "url": "https://..."}
```

### plugin.json Schema

Located in each plugin directory. Defines paths to components:
- `agents` - Path to agent definitions
- `skills` - Path to skill definitions
- `commands`, `hooks`, `mcpServers` - Other components

Environment variable `${CLAUDE_PLUGIN_ROOT}` resolves to plugin installation directory.

## Component Formats

### Agent Format
Agents are markdown files with YAML frontmatter:
```yaml
---
name: agent-name
description: Description for when to use this agent
model: opus  # or sonnet, haiku
---
System prompt and instructions...
```

### Skill Format
Skills use `SKILL.md` files with frontmatter:
```yaml
---
name: skill-name
description: When to invoke this skill
---
Instructions and commands...
```

## Available Components

**Agents** (`plugins/mobile-toolkit/agents/`):
- `ios-developer` - SwiftUI, UIKit, Core Data
- `android-developer` - Kotlin, Jetpack Compose
- `swift-expert` - Swift 5.9+, async/await, protocols
- `flutter-expert` - Cross-platform Flutter/Dart

**Skills** (`plugins/mobile-toolkit/skills/`):
- `xcode-builder` - Build/test via XcodeBuildMCP tools
- `to-toon` - Convert JSON/XML/YAML to token-efficient TOON format

## XcodeBuildMCP Integration

When working with Xcode projects, always use `preferXcodebuild: true` to prevent token overflow. Use simulator UUID (`simulatorId`) instead of name for reliability.

## Git Integration

Do NOT use `git commit` directly - GitButler manages commits automatically.
