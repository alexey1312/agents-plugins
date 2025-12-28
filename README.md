# aleksei-agents

Private marketplace with mobile development agents, skills, commands, and automation for Claude Code.

**Version:** 1.2.0

## Installation

```bash
# Add marketplace
/plugin marketplace add alexey1312/agents-marketplace

# Install plugin
/plugin install mobile-toolkit@aleksei-agents
```

## Contents

### Agents (4)

| Agent | Model | Description |
|-------|-------|-------------|
| `ios-developer` | opus | Native iOS with Swift/SwiftUI, Core Data, UIKit |
| `android-developer` | opus | Native Android with Kotlin/Jetpack Compose, Material Design 3 |
| `swift-expert` | opus | Swift 5.9+ expert, async/await, protocol-oriented design |
| `flutter-expert` | sonnet | Cross-platform Flutter with Dart, state management |

### Skills (5)

| Skill | Description |
|-------|-------------|
| `xcode-builder` | Build and test Xcode projects with xcsift integration |
| `to-toon` | Convert JSON/XML/YAML to compact TOON format (30-60% token savings) |
| `xcsift` | Parse xcodebuild output to TOON format |
| `simulator-manager` | Manage iOS simulators - list, create, boot, configure |
| `swiftlint-fixer` | Auto-detect and fix SwiftLint violations |

### Commands (5)

| Command | Description |
|---------|-------------|
| `/spawn` | Spawn parallel mobile agents with patterns |
| `/pr-summary` | Generate PR summary from branch changes |
| `/review-swift` | Comprehensive Swift code review |
| `/analyze-build` | Analyze xcodebuild output with xcsift + TOON |
| `/generate-changelog` | Generate changelog from git commits |

### Spawn Patterns (7)

| Pattern | Description |
|---------|-------------|
| `mobile_cross_platform` | iOS + Android + Flutter parallel |
| `ios_feature_cycle` | Implement → Review → PR |
| `android_feature_cycle` | Implement → Review → PR |
| `build_pipeline` | Build → Parse → TOON |
| `swift_quality_review` | Code quality review |
| `flutter_native_integration` | Flutter + native channels |
| `dual_platform` | Same feature, iOS + Android |

### Hooks

Automation hooks for:
- Suggest xcsift for build commands
- Remind SwiftLint after Swift edits
- Suggest coverage after tests

## Usage

### Using Agents
```
"use ios-developer to review this SwiftUI code"
"use android-developer to implement this feature in Compose"
"use swift-expert to optimize this async code"
"use flutter-expert to set up state management"
```

### Using Spawn Patterns
```bash
/spawn --pattern mobile_cross_platform "Payment screen"
/spawn --pattern ios_feature_cycle "User authentication"
/spawn --pattern build_pipeline
```

### Using Commands
```bash
/review-swift Sources/
/analyze-build --test --coverage
/generate-changelog --unreleased
```

### Using Skills
Skills are auto-invoked or explicitly called:
```
"build the app for simulator"  # triggers xcode-builder
"convert this to TOON format"  # triggers to-toon
```

## Structure

```
.
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── mobile-toolkit/
│       ├── plugin.json
│       ├── agents/
│       │   ├── ios-developer.md
│       │   ├── android-developer.md
│       │   ├── swift-expert.md
│       │   └── flutter-expert.md
│       ├── skills/
│       │   ├── xcode-builder/
│       │   ├── to-toon/
│       │   ├── xcsift/
│       │   ├── simulator-manager/
│       │   └── swiftlint-fixer/
│       ├── commands/
│       │   ├── spawn.md
│       │   ├── pr-summary.md
│       │   ├── review-swift.md
│       │   ├── analyze-build.md
│       │   └── generate-changelog.md
│       ├── patterns/
│       │   └── spawn-patterns.yml
│       └── hooks/
│           └── hooks.json
└── README.md
```

## Dependencies

```bash
# Required
brew install ldomaradzki/tap/xcsift
brew install swiftlint
```

## Model Tiering

| Task Type | Model | Agents |
|-----------|-------|--------|
| Architecture, Security | opus | ios-developer, android-developer, swift-expert |
| Cross-platform, Standard | sonnet | flutter-expert |

## License

MIT
