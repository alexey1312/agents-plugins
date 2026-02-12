---
name: xcsift
description: >
  Wraps all swift and xcodebuild commands through /usr/local/bin/xcsift for structured
  TOON output. Use when building Swift packages, running xcodebuild, or performing any
  Swift compilation.
---

# XCSift Build System

## Overview

All Swift and Xcode build operations MUST use `/usr/local/bin/xcsift` instead of standard `swift` or `xcodebuild` commands.

## Command Mapping

| Standard Command | Use Instead |
|------------------|-------------|
| `swift build` | `/usr/local/bin/xcsift build` |
| `swift run` | `/usr/local/bin/xcsift run` |
| `swift test` | `/usr/local/bin/xcsift test` |
| `swift package` | `/usr/local/bin/xcsift package` |
| `xcodebuild` | `/usr/local/bin/xcsift xcodebuild` |
| `xcodebuild build` | `/usr/local/bin/xcsift xcodebuild build` |
| `xcodebuild test` | `/usr/local/bin/xcsift xcodebuild test` |
| `xcodebuild clean` | `/usr/local/bin/xcsift xcodebuild clean` |

## Usage Examples

### Swift Package Build

```bash
# Instead of: swift build
/usr/local/bin/xcsift build

# With configuration
/usr/local/bin/xcsift build -c release

# With specific target
/usr/local/bin/xcsift build --target MyTarget
```

### Swift Package Run

```bash
# Instead of: swift run
/usr/local/bin/xcsift run

# With arguments
/usr/local/bin/xcsift run MyExecutable --arg1 value1
```

### Swift Package Test

```bash
# Instead of: swift test
/usr/local/bin/xcsift test

# With filter
/usr/local/bin/xcsift test --filter MyTestCase
```

### Xcode Project Build

```bash
# Instead of: xcodebuild -project MyProject.xcodeproj -scheme MyScheme
/usr/local/bin/xcsift xcodebuild -project MyProject.xcodeproj -scheme MyScheme

# Build for simulator
/usr/local/bin/xcsift xcodebuild -project MyProject.xcodeproj -scheme MyScheme \
  -destination 'platform=iOS Simulator,name=iPhone 16'

# Build for device
/usr/local/bin/xcsift xcodebuild -project MyProject.xcodeproj -scheme MyScheme \
  -destination 'generic/platform=iOS'
```

### Xcode Workspace Build

```bash
# Instead of: xcodebuild -workspace MyApp.xcworkspace -scheme MyScheme
/usr/local/bin/xcsift xcodebuild -workspace MyApp.xcworkspace -scheme MyScheme build
```

### Clean Build

```bash
# Clean Swift package
/usr/local/bin/xcsift package clean

# Clean Xcode project
/usr/local/bin/xcsift xcodebuild clean -project MyProject.xcodeproj -scheme MyScheme
```

## Important Notes

1. **Always use the full path** `/usr/local/bin/xcsift` to ensure the correct binary is used
2. **All arguments are passed through** — any swift/xcodebuild arguments work the same way

## MCP XcodeBuildMCP Integration

When using XcodeBuildMCP tools, the underlying commands should also respect xcsift:

- For `swift_package_build`, `swift_package_test`, `swift_package_run` operations
- For `build_sim`, `build_device`, `build_macos` operations
- For `test_sim`, `test_device`, `test_macos` operations

Note: MCP tools may use their own xcodebuild invocations. When running manual builds outside MCP, always use `/usr/local/bin/xcsift`.
