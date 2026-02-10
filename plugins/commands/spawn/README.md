# spawn

Spawn parallel mobile agents for coordinated development.

## Installation

```bash
/plugin install spawn@aleksei-plugins
```

## Usage

```bash
/spawn --agents ios-developer,android-developer "Payment screen"
/spawn --mode sequential --agents ios-developer,swift-expert "Implement then review"
/spawn --orchestrator flutter-expert --workers ios-developer,android-developer "Native bridge"
```

## Modes

- **parallel** — independent agents working simultaneously
- **sequential** — agents run one after another
- **orchestrator** — one agent coordinates workers
