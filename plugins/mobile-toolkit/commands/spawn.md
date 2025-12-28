---
description: Spawn parallel mobile agents for coordinated development
allowed-tools: Task, Read, Glob, Grep
version: 1.0
---

# Mobile Spawn Command

Spawn specialized mobile agents for parallel or sequential development workflows.

## Quick Start

```bash
# Cross-platform development
/spawn --pattern mobile_cross_platform "Payment screen"

# iOS feature with review
/spawn --pattern ios_feature_cycle "User authentication"

# Build and analyze
/spawn --pattern build_pipeline
```

## Available Patterns

| Pattern | Description | Agents |
|---------|-------------|--------|
| `mobile_cross_platform` | iOS + Android + Flutter parallel | ios, android, flutter |
| `ios_feature_cycle` | Implement → Review → PR | ios, swift-expert |
| `android_feature_cycle` | Implement → Review → PR | android, code-reviewer |
| `build_pipeline` | Build → Parse → TOON | xcode-builder, xcsift, to-toon |
| `swift_quality_review` | Code quality review | swift-expert, ios |
| `flutter_native_integration` | Flutter + native channels | flutter, ios, android |
| `dual_platform` | Same feature, both platforms | ios, android |

## Agent Selection

### Opus Agents (Complex Tasks)
- `ios-developer` - Native iOS with SwiftUI/UIKit
- `android-developer` - Native Android with Compose
- `swift-expert` - Swift 5.9+ optimization

### Sonnet Agents (Standard Tasks)
- `flutter-expert` - Cross-platform Flutter

## Execution Modes

### Parallel Mode
```bash
/spawn --mode parallel --agents ios-developer,android-developer "Implement login screen"
```

### Sequential Mode
```bash
/spawn --mode sequential --agents ios-developer,swift-expert "Implement then review"
```

### Orchestrator Mode
```bash
/spawn --orchestrator ios-developer --workers android-developer,flutter-expert "Coordinate feature"
```

## Integration with Skills

Combine spawn with skills for complete workflows:

```bash
# Build → Review
/spawn --pattern ios_feature_cycle "Feature" && /skill xcode-builder

# Review → PR Summary
/spawn --pattern swift_quality_review "Module" && /command pr-summary
```

## Examples

### 1. Cross-Platform Feature
```bash
/spawn --pattern mobile_cross_platform "User profile screen with avatar upload"
```
Result: iOS, Android, and Flutter implementations in parallel

### 2. iOS with Quality Gate
```bash
/spawn --pattern ios_feature_cycle "Core Data sync with CloudKit"
```
Result: ios-developer implements → swift-expert reviews → pr-summary generates

### 3. Native Bridge for Flutter
```bash
/spawn --pattern flutter_native_integration "Camera access with ML processing"
```
Result: Flutter orchestrates, iOS and Android implement native channels

## Tips

1. Use `--pattern` for predefined workflows
2. Use `--agents` for custom combinations
3. Use `--orchestrator` when coordination is needed
4. Combine with `/skill` and `/command` for full pipelines
