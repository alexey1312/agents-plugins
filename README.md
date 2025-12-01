# aleksei-agents

Private marketplace with mobile development agents and Xcode build skill for Claude Code.

## Installation

```bash
# Add marketplace
/plugin marketplace add alexey1312/agents-marketplace

# Install plugin
/plugin install mobile-toolkit@aleksei-agents
```

## Contents

### Agents

| Agent | Description |
|-------|-------------|
| `ios-developer` | Native iOS with Swift/SwiftUI, Core Data, UIKit |
| `android-developer` | Native Android with Kotlin/Jetpack Compose, Material Design 3 |
| `swift-expert` | Swift 5.9+ expert, async/await, protocol-oriented design |
| `flutter-expert` | Cross-platform Flutter with Dart, state management |

### Skills

| Skill | Description |
|-------|-------------|
| `xcode-builder` | Build and test Xcode projects using XcodeBuildMCP |

## Usage

### Using Agents

```
"use ios-developer to review this SwiftUI code"
"use android-developer to implement this feature in Compose"
"use swift-expert to optimize this async code"
"use flutter-expert to set up state management"
```

### Using Skills

Skills are auto-invoked based on context:

```
"build the app for simulator"
"run tests for MyApp scheme"
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
│       └── skills/
│           └── xcode-builder/
│               └── SKILL.md
└── README.md
```

## License

MIT
