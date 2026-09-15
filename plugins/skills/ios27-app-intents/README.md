# ios27-app-intents

Adopt and audit iOS 27 App Intents — Siri, Apple Intelligence, Spotlight, Shortcuts.

## Installation

```bash
/plugin install ios27-app-intents@aleksei-plugins
```

Requires Xcode 27 / iOS 27 SDK for the iOS 27 APIs. Everything below iOS 27 in the reference works on
older SDKs.

## Usage

Auto-invoked when the conversation touches App Intents:

```
"add Siri support for walks"
"why doesn't Spotlight find my entities"
"migrate this app to iOS 27 App Intents"
"review my App Intents integration"
```

## Contents

| File | Purpose |
|------|---------|
| `SKILL.md` | 12-rung adoption ladder with working code for the core path |
| `reference.md` | Full iOS 27 API surface — signatures, availability, verified examples |
| `checklist.md` | Audit rubric for reviewing an existing integration |

## What it covers

**iOS 27** — `SyncableEntity`, `SyncableEntityIdentifier`, `IndexedEntityQuery`,
`OwnershipProvidingEntity`, `RelevantEntities`, `EntityCollection`, `LongRunningIntent`,
`IntentExecutionTargets`, `AppUnionValue`, `RunSystemShortcutIntent`, `AppSchema` macros

**iOS 26.x** — `CancellableIntent`, `IntentValueRepresentation`, `IntentModes`, `UndoableIntent`

**Foundations** — `AppEntity`, `IndexedEntity`, `EntityStringQuery`, `OpenIntent`,
`TargetContentProvidingIntent`, `AppShortcutsProvider`, `IntentDonationManager`, onscreen awareness

**Testing** — App Intents Testing framework: `IntentDefinitions`, `spotlightQuery`,
`viewAnnotations`, intent chaining
