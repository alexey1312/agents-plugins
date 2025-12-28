# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Private Claude Code plugin marketplace with mobile development agents, skills, commands, spawn patterns, and automation hooks.

**Version:** 1.2.0

```bash
# Install
/plugin marketplace add alexey1312/agents-marketplace
/plugin install mobile-toolkit@aleksei-agents
```

## Structure

```
.claude-plugin/
  marketplace.json              # Marketplace catalog
plugins/
  mobile-toolkit/
    plugin.json                 # Plugin manifest
    agents/                     # Agent definitions
      ios-developer.md
      android-developer.md
      swift-expert.md
      flutter-expert.md
    skills/                     # Auto-invoked skills
      xcode-builder/
      to-toon/
      xcsift/
      simulator-manager/
      swiftlint-fixer/
    commands/                   # Slash commands
      spawn.md
      pr-summary.md
      review-swift.md
      analyze-build.md
      generate-changelog.md
    patterns/                   # Spawn patterns
      spawn-patterns.yml
    hooks/                      # Automation hooks
      hooks.json
```

## Available Components

### Agents (4)

| Name | Model | Description |
|------|-------|-------------|
| `ios-developer` | opus | SwiftUI, UIKit, Core Data, networking |
| `android-developer` | opus | Kotlin, Jetpack Compose, Material Design 3 |
| `swift-expert` | opus | Swift 5.9+, async/await, protocol-oriented |
| `flutter-expert` | sonnet | Cross-platform Flutter/Dart, state management |

### Skills (5)

| Name | Description |
|------|-------------|
| `xcode-builder` | Build/test via xcodebuild + xcsift TOON |
| `to-toon` | JSON/XML/YAML → TOON format (30-60% savings) |
| `xcsift` | Parse xcodebuild/swift output to TOON |
| `simulator-manager` | Manage iOS simulators |
| `swiftlint-fixer` | Auto-fix SwiftLint violations |

### Commands (5)

| Name | Description |
|------|-------------|
| `/spawn` | Parallel mobile agents with patterns |
| `/pr-summary` | Generate PR summary from branch changes |
| `/review-swift` | Comprehensive Swift code review |
| `/analyze-build` | Analyze xcodebuild with xcsift + TOON |
| `/generate-changelog` | Generate changelog from git commits |

### Spawn Patterns (7)

| Pattern | Agents | Description |
|---------|--------|-------------|
| `mobile_cross_platform` | ios, android, flutter | Parallel development |
| `ios_feature_cycle` | ios, swift-expert | Implement → Review → PR |
| `android_feature_cycle` | android, reviewer | Implement → Review → PR |
| `build_pipeline` | xcode-builder, xcsift, to-toon | Build → Parse → TOON |
| `swift_quality_review` | swift-expert, ios | Code quality review |
| `flutter_native_integration` | flutter, ios, android | Native channels |
| `dual_platform` | ios, android | Same feature, both platforms |

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

### Skill (SKILL.md)

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

### Pattern (.yml)

```yaml
pattern_name:
  description: "What this pattern does"
  orchestrator:
    agent: agent-name
    model: opus
  workers:
    - {agent: worker-name, model: sonnet, task: "Task description"}
  example: "/spawn --pattern pattern_name 'task'"
```

### Hooks (hooks.json)

```json
{
  "PreToolUse": [{
    "matcher": "Bash.*swift build",
    "hooks": [{"type": "message", "message": "Tip: Use xcsift"}]
  }]
}
```

## Model Tiering

| Task Type | Model | Use For |
|-----------|-------|---------|
| Architecture, Security | opus | ios, android, swift-expert |
| Standard Development | sonnet | flutter-expert |
| Simple Operations | haiku | Documentation, reports |

## Dependencies

```bash
brew install ldomaradzki/tap/xcsift
brew install swiftlint
```

## Usage Examples

### Spawn Patterns
```bash
/spawn --pattern mobile_cross_platform "Payment screen"
/spawn --pattern ios_feature_cycle "Authentication"
```

### Commands
```bash
/review-swift Sources/Networking/
/analyze-build --test --coverage
/generate-changelog --unreleased
```

### Skills
```
"build the app for simulator"       # xcode-builder
"convert to TOON format"            # to-toon
"list available simulators"         # simulator-manager
"fix SwiftLint issues"              # swiftlint-fixer
```

## Maintenance

Keep in sync when adding/removing components:
- `CLAUDE.md` — Available Components tables
- `README.md` — Contents section
- `plugin.json` — Paths to new directories
- `marketplace.json` — Plugin description

## Git

GitButler manages commits - do not use `git commit` directly.
