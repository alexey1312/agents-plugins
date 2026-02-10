---
description: Spawn parallel mobile agents for coordinated development
allowed-tools: Task, Read, Glob, Grep
version: 1.0
---

# Mobile Spawn Command

Spawn specialized mobile agents for parallel or sequential development workflows.

## Quick Start

```bash
# Parallel iOS and Android
/spawn --agents ios-developer,android-developer "Payment screen"

# Sequential: implement then review
/spawn --mode sequential --agents ios-developer,swift-expert "User authentication"

# Orchestrated workflow
/spawn --orchestrator ios-developer --workers android-developer,flutter-expert "Coordinate feature"
```

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

## Common Workflows

### Cross-Platform Feature
```bash
/spawn --agents ios-developer,android-developer,flutter-expert "User profile screen with avatar upload"
```
Result: iOS, Android, and Flutter implementations in parallel

### iOS with Quality Gate
```bash
/spawn --mode sequential --agents ios-developer,swift-expert "Core Data sync with CloudKit"
```
Result: ios-developer implements, then swift-expert reviews

### Native Bridge for Flutter
```bash
/spawn --orchestrator flutter-expert --workers ios-developer,android-developer "Camera access with ML processing"
```
Result: Flutter orchestrates, iOS and Android implement native channels

### Dual Platform
```bash
/spawn --agents ios-developer,android-developer "Push notifications"
```
Result: Same feature on both platforms simultaneously

## Tips

1. Use `--agents` for custom agent combinations
2. Use `--mode parallel` for independent work
3. Use `--mode sequential` for dependent phases
4. Use `--orchestrator` when coordination is needed
