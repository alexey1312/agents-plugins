---
name: ios27-app-intents
description: >
  Adopts and audits iOS 27 App Intents so app content reaches Siri, Apple Intelligence, Spotlight
  and Shortcuts — SyncableEntity, IndexedEntityQuery, EntityCollection, OwnershipProvidingEntity,
  RelevantEntities, LongRunningIntent, CancellableIntent, IntentExecutionTargets, AppSchema macros,
  App Shortcut phrases, entity donation and onscreen awareness. Use when adding, migrating or
  reviewing App Intents, app entities, entity queries, App Shortcuts, Spotlight indexing or Siri
  support in a Swift/SwiftUI app targeting iOS 27 / Xcode 27.
---

# iOS 27 App Intents

Make an app *reachable*: Siri, Apple Intelligence, Spotlight, Shortcuts, widgets. Every API below is
verified against Apple's App Intents documentation — check availability before using anything.

## The mental model

Three questions decide everything else:

1. **What are the nouns?** → `AppEntity` types (a walk, a note, an album)
2. **How does the system find them?** → `EntityQuery` + Spotlight index
3. **What can be done to them?** → `AppIntent` types

Ship in that order. An intent without a findable entity only works from the Shortcuts app.

## Adoption ladder

Work top-down. Each rung is useful on its own; stop when the app has what it needs.

| # | Rung | Type | Minimum OS |
|---|------|------|-----------|
| 1 | Entity exists | `AppEntity` | iOS 16 |
| 2 | Entity is searchable | `IndexedEntity` + `@Property(indexingKey:)` | iOS 18 |
| 3 | Entity resolves by name | `EntityStringQuery` | iOS 16 |
| 4 | Spotlight can rebuild the index | `IndexedEntityQuery` | **iOS 27** |
| 5 | Action opens the entity | `OpenIntent` + `TargetContentProvidingIntent` | iOS 18 |
| 6 | Siri knows the phrases | `AppShortcutsProvider` | iOS 16 |
| 7 | System learns usage | `IntentDonationManager` | iOS 16 |
| 8 | Conversation moves between devices | `SyncableEntity` | **iOS 27** |
| 9 | "this walk" resolves onscreen | `appEntityIdentifier` | iOS 18.4 |
| 10 | Entity travels to other apps | `Transferable` + `ValueRepresentation` | iOS 26.4 |
| 11 | Runtime behaviour is explicit | `IntentModes`, `IntentExecutionTargets` | iOS 26 / **27** |
| 12 | Scale and safety | `EntityCollection`, `OwnershipProvidingEntity` | **iOS 27** |

Full signatures and the rest of the iOS 27 surface: `${CLAUDE_PLUGIN_ROOT}/skills/ios27-app-intents/reference.md`
Review rubric: `${CLAUDE_PLUGIN_ROOT}/skills/ios27-app-intents/checklist.md`

## 1–2. Entity that Spotlight can index

Wrap in `@Property` only what Siri should *read out loud* or Shortcuts should *display*. Everything
else stays a plain stored property — exposing internals makes Siri verbose and the Shortcuts picker
noisy.

```swift
struct WalkEntity: IndexedEntity {
    let id: UUID

    @Property(title: "Name", indexingKey: \.displayName)
    var name: String

    @Property(title: "Distance")
    var distanceKM: Double

    // Not exposed: routing internals Siri has no business narrating.
    var polyline: String

    static var typeDisplayRepresentation: TypeDisplayRepresentation { "Walk" }

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(
            title: "\(name)",
            subtitle: "\(distanceKM, specifier: "%.1f") km"
        )
    }

    static var defaultQuery = WalkEntityQuery()
}
```

`indexingKey:` maps a property onto a `CSSearchableItemAttributeSet` field. When richer Spotlight
metadata is needed, override `attributeSet` instead — put the name into `keywords` as well as
`displayName`, because Spotlight matches keywords far more aggressively than titles:

```swift
extension WalkEntity {
    var attributeSet: CSSearchableItemAttributeSet {
        let set = defaultAttributeSet
        set.displayName = name
        set.keywords = [name, "walk", "route"]
        set.contentDescription = "\(distanceKM) km walking route"
        return set
    }
}
```

Donate to the index whenever the data changes:

```swift
try await CSSearchableIndex.default().indexAppEntities(walks)
```

Use `hideInSpotlight` for entities that exist for Shortcuts but must not surface in search.

## 3–4. Query: resolve by name, and survive a rebuilt index

```swift
struct WalkEntityQuery: EntityQuery {
    func entities(for identifiers: [WalkEntity.ID]) async throws -> [WalkEntity] {
        try await WalkStore.shared.walks(ids: identifiers)
    }

    func suggestedEntities() async throws -> [WalkEntity] {
        try await WalkStore.shared.recent(limit: 10)
    }
}

// Lets Siri and the Shortcuts parameter picker match a spoken name.
extension WalkEntityQuery: EntityStringQuery {
    func entities(matching string: String) async throws -> [WalkEntity] {
        try await WalkStore.shared.all().filter {
            $0.name.localizedStandardContains(string)
        }
    }
}
```

**iOS 27** — when the system detects a problem with the app's Spotlight index it asks the app to
rebuild it. Without `IndexedEntityQuery` that request falls back to `CSSearchableIndexDelegate`; if
the app has no delegate, entities silently stop appearing in search.

```swift
@available(iOS 27.0, *)
extension WalkEntityQuery: IndexedEntityQuery {
    func reindexEntities(
        for identifiers: [WalkEntity.ID],
        indexDescription: CSSearchableIndexDescription
    ) async throws {
        let walks = try await WalkStore.shared.walks(ids: identifiers)
        try await CSSearchableIndex.default().indexAppEntities(walks)
    }

    func reindexAllEntities(
        indexDescription: CSSearchableIndexDescription
    ) async throws {
        try await CSSearchableIndex.default().indexAppEntities(WalkStore.shared.all())
    }
}
```

Reindex into **the same index instance** used for the original donation — a named
`CSSearchableIndex(name:)` and `.default()` are different indexes.

## 5. Intent that opens the entity

`@AppIntent(schema:)` maps the intent onto a system-defined shape so Apple Intelligence understands
it without guessing. `TargetContentProvidingIntent` routes it to the right scene instead of a cold
app launch.

```swift
@available(iOS 27.0, *)
@AppIntent(schema: .system.open)
struct OpenWalkIntent: OpenIntent, TargetContentProvidingIntent {
    var target: WalkEntity

    @MainActor
    func perform() async throws -> some IntentResult {
        Router.shared.show(walkID: target.id)
        return .result()
    }
}
```

`.system.search` is **deprecated** — don't add it to new code. In-app search is served by
`.system.open` plus a well-indexed entity and an `EntityStringQuery`.

## 6. App Shortcut phrases

`\(.applicationName)` is mandatory in every phrase. Write the phrases people actually say, not the
method name.

```swift
struct WalkMateShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: OpenWalkIntent(),
            phrases: [
                "Open \(\.$target) in \(.applicationName)",
                "Load \(\.$target) with \(.applicationName)"
            ],
            shortTitle: "Open Walk",
            systemImageName: "figure.walk"
        )
    }
}
```

Phrases carrying an entity parameter are cached by the system. **Call
`updateAppShortcutParameters()` after every rename, insert or delete**, and once at launch to warm
the cache — otherwise Siri keeps matching names the user already changed.

```swift
WalkMateShortcuts.updateAppShortcutParameters()
```

## 7. Donation

Donate an intent when the person **finishes** an action, never on every render — noisy donations
degrade the system's predictions for the whole app.

```swift
var intent = OpenWalkIntent()
intent.target = walk
IntentDonationManager.shared.donate(intent: intent)
```

Delete donations that go stale — after the user deletes the underlying data, or undoes the action:

```swift
try await IntentDonationManager.shared.deleteDonations(
    matching: .entityIdentifier(EntityIdentifier(for: WalkEntity.self, identifier: walk.id))
)
```

## 8. Cross-device conversations — `SyncableEntity` (iOS 27)

`SyncableEntity` is a **promise about the identifier**, not a sync engine. It tells the system the ID
means the same thing on iPhone, iPad and Mac, so Siri can hand a conversation between devices.

If the ID is already stable (server UUID, CloudKit record name), one line is the whole adoption:

```swift
@available(iOS 27.0, *)
extension WalkEntity: SyncableEntity {}
```

If the ID is device-local (Core Data object ID, autoincrement row, file path), adopting it as-is is a
**bug** — the other device resolves the wrong entity or nothing. Carry both identifiers instead:

```swift
@available(iOS 27.0, *)
struct WalkEntity: AppEntity, SyncableEntity {
    var id: SyncableEntityIdentifier<String, String>   // local, stable

    init(localID: String, stableID: String) {
        self.id = SyncableEntityIdentifier(local: localID, stable: stableID)
    }
}
```

Use the local ID everywhere inside app code; the system uses the stable one when crossing devices.

## 9. Onscreen awareness

Lets the user say "share *this* walk" while looking at it. Attach the entity identifier to the view:

```swift
WalkDetailView(walk: walk)
    .appEntityIdentifier(EntityIdentifier(for: WalkEntity.self, identifier: walk.id))
```

## 10. Handing the entity to other apps

`Transferable` + `ValueRepresentation` bridges an entity to a system value type — e.g. exporting a
start coordinate so Maps can take over navigation:

```swift
@available(iOS 26.4, *)
extension WalkEntity: Transferable {
    static var transferRepresentation: some TransferRepresentation {
        ValueRepresentation(exporting: \.startPlace)   // PlaceDescriptor
    }
}
```

## Availability gating

Mixed-minimum codebases are where this goes wrong. Two rules:

- Put `@available(iOS 27.0, *)` on the **extension**, not scattered on members, so the iOS 26 build
  drops the whole conformance cleanly.
- Never gate the *entity* itself on iOS 27 — gate only the iOS 27 conformances. Gating the entity
  removes it from Shortcuts on every older OS.

```swift
struct WalkEntity: IndexedEntity { /* works on iOS 18+ */ }

@available(iOS 27.0, *)
extension WalkEntity: SyncableEntity {}

@available(iOS 27.0, *)
extension WalkEntityQuery: IndexedEntityQuery { /* ... */ }
```

## Pitfalls that actually bite

- **Everything wrapped in `@Property`.** Siri narrates it all. Expose what a person would say aloud.
- **Donating on view appearance.** Donate on completion only.
- **Forgetting `updateAppShortcutParameters()`.** Stale phrase cache — renames stop matching.
- **`SyncableEntity` on a device-local ID.** Silent cross-device misresolution. See rung 8.
- **Reindexing into a different `CSSearchableIndex`.** Donation and reindex must target one index.
- **A huge `[SomeEntity]` parameter.** Every identifier is hydrated during resolution — use
  `EntityCollection<SomeEntity>` (iOS 27) and read `.identifiers`.
- **`LongRunningIntent` without progress updates.** The system cancels the runtime extension.
- **No fallback when a search matches nothing or matches many.** Return a disambiguation or a clear
  dialog; a silent empty result reads as a broken app.

## Verify before claiming it works

Shortcuts UI alone is not a test. Use the App Intents Testing framework from a **UI testing target**:

```swift
let definitions = IntentDefinitions(bundleIdentifier: "com.example.walkmate")

// Entity resolves by spoken name
let results = try await definitions.entities["WalkEntity"].entities(matching: "Riverside")

// Entity is really in the Spotlight index
let indexed = try await definitions.entities["WalkEntity"].spotlightQuery("Riverside")

// Intent runs end-to-end through the real App Intents infrastructure
let result = try await definitions.intents["OpenWalkIntent"].makeIntent().run()

// Onscreen annotation is present
let annotations = try await definitions.entities["WalkEntity"].viewAnnotations()
```

Seed state with a test-only intent — `static let isDiscoverable = false`, wrapped in `#if DEBUG`.

Then check by hand: Spotlight search for the entity name, one Siri phrase per App Shortcut, and the
Shortcuts parameter picker.
