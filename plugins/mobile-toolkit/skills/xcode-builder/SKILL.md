---
name: xcode-builder
description: Build and test Swift/Xcode projects using XcodeBuildMCP. Use when user asks to build, test, or run iOS/macOS apps.
---

# Xcode Builder Skill

Build Swift projects efficiently using XcodeBuildMCP tools.

## Build for Simulator

1. Get simulator UUID (cache it for session):
```bash
SIM_ID=$(cat .agents_memory/.simulator_uuid 2>/dev/null || xcrun simctl list devices -j | jq -r '.devices[] | .[] | select(.isAvailable == true) | .udid' | head -1)
```

2. Build with MCP:
```
mcp__XcodeBuildMCP__build_sim({
  workspacePath: "path/to/Project.xcworkspace",
  scheme: "SchemeName",
  simulatorId: "UUID",
  preferXcodebuild: true
})
```

## Run Tests

```
mcp__XcodeBuildMCP__test_sim({
  workspacePath: "path/to/Project.xcworkspace",
  scheme: "SchemeName",
  simulatorId: "UUID",
  preferXcodebuild: true
})
```

## Build for Device

```
mcp__XcodeBuildMCP__build_device({
  workspacePath: "path/to/Project.xcworkspace",
  scheme: "SchemeName",
  preferXcodebuild: true
})
```

## Best Practices

- **Always use `preferXcodebuild: true`** - prevents 137K+ token output overflow
- **Use `simulatorId` instead of `simulatorName`** - more reliable for MCP calls
- **Extract SIM_ID once per session** - reuse the UUID string value
- **Run `make generate_project_with_cache`** only for NEW files, not edits

## Project Setup Commands

```bash
# Initial setup
make bootstrap && exec $SHELL -l

# After adding new files
make generate_project_with_cache | tail -1

# Resolve dependencies
make resolve

# Run tests
make test

# Lint and format
make lint && make format

# Clear cache
make nuke
```

## Discover Project Structure

```
mcp__XcodeBuildMCP__discover_projs({
  workspaceRoot: "/path/to/project"
})

mcp__XcodeBuildMCP__list_schemes({
  workspacePath: "/path/to/Project.xcworkspace"
})
```
