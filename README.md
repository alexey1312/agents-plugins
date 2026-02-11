# agents-plugins

Private plugin marketplace with mobile development agents, skills, commands, and automation for Claude Code.

**Version:** 1.0.0

## Installation

```bash
# Add marketplace
/plugin marketplace add alexey1312/agents-marketplace

# Install individual plugins
/plugin install ios-developer@aleksei-plugins
/plugin install swift-expert@aleksei-plugins
/plugin install xcode-builder@aleksei-plugins
/plugin install review-swift@aleksei-plugins
```

## Plugins

### Agents (4)

| Plugin | Model | Category | Description |
|--------|-------|----------|-------------|
| `ios-developer` | opus | development | Native iOS with Swift/SwiftUI, Core Data, UIKit |
| `android-developer` | opus | development | Native Android with Kotlin/Jetpack Compose, Material Design 3 |
| `swift-expert` | opus | development | Swift 5.9+ expert, async/await, protocol-oriented design |
| `flutter-expert` | sonnet | development | Cross-platform Flutter with Dart, state management |

### Skills (7)

| Plugin | Category | Description |
|--------|----------|-------------|
| `xcode-builder` | development | Build and test Xcode projects with xcsift integration |
| `to-toon` | productivity | Convert JSON/XML/YAML to compact TOON format (30-60% token savings) |
| `xcsift` | development | Parse xcodebuild output to TOON format |
| `simulator-manager` | development | Manage iOS simulators — list, create, boot, configure |
| `swiftlint-fixer` | development | Auto-detect and fix SwiftLint violations |
| `branch-recall` | productivity | Recall branch context — analyze what was done to continue work |
| `humanizer` | productivity | Remove signs of AI-generated writing ([blader/humanizer](https://github.com/blader/humanizer)) |

### Commands (5)

| Plugin | Category | Description |
|--------|----------|-------------|
| `spawn` | development | Spawn parallel mobile agents for coordinated development |
| `pr` | productivity | GitHub PR workflow: create PRs and generate summaries |
| `review-swift` | development | Comprehensive Swift code review |
| `analyze-build` | development | Analyze xcodebuild output with xcsift + TOON |
| `generate-changelog` | productivity | Generate changelog from git commits |

### Hooks (1)

| Plugin | Category | Description |
|--------|----------|-------------|
| `hooks-collection` | productivity | Build suggestions, SwiftLint reminders, coverage tips |

## Structure

```
.
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── plugins/
│   ├── agents/
│   │   ├── ios-developer/
│   │   ├── android-developer/
│   │   ├── swift-expert/
│   │   └── flutter-expert/
│   ├── skills/
│   │   ├── xcode-builder/
│   │   ├── to-toon/
│   │   ├── xcsift/
│   │   ├── simulator-manager/
│   │   ├── swiftlint-fixer/
│   │   ├── branch-recall/
│   │   └── humanizer/
│   ├── commands/
│   │   ├── spawn/
│   │   ├── pr/
│   │   ├── review-swift/
│   │   ├── analyze-build/
│   │   └── generate-changelog/
│   └── hooks/
│       └── hooks-collection/
├── CLAUDE.md
└── README.md
```

Each plugin contains:
```
plugin-name/
  .claude-plugin/plugin.json
  agents/ | skills/ | commands/ | hooks/
  README.md
```

## Usage

### Agents
```
"use ios-developer to review this SwiftUI code"
"use android-developer to implement this feature in Compose"
"use swift-expert to optimize this async code"
"use flutter-expert to set up state management"
```

### Commands
```bash
/spawn --agents ios-developer,android-developer "Payment screen"
/pr:summary
/pr:create --draft
/review-swift Sources/
/analyze-build --test --coverage
/generate-changelog --unreleased
```

### Skills
Skills are auto-invoked:
```
"build the app for simulator"       # xcode-builder
"convert this to TOON format"       # to-toon
"list available simulators"         # simulator-manager
"fix SwiftLint issues"              # swiftlint-fixer
"recall what was done in this branch" # branch-recall
"humanize this text"                # humanizer
```

## Dependencies

```bash
brew install ldomaradzki/tap/xcsift   # xcode-builder, xcsift, analyze-build
brew install swiftlint                 # swiftlint-fixer
```

## License

MIT
