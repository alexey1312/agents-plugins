# iOS 27 App Intents — API reference

Availability as published by Apple. Anything marked **27.0** needs `@available(iOS 27.0, *)` in a
codebase with a lower deployment target.

| API | Kind | Since | Solves |
|-----|------|-------|--------|
| `SyncableEntity` | protocol | 27.0 | Siri continues a conversation on another device |
| `SyncableEntityIdentifier` | struct | 27.0 | Separate local and cross-device identifiers |
| `IndexedEntityQuery` | protocol | 27.0 | System asks the app to rebuild its Spotlight index |
| `OwnershipProvidingEntity` | protocol | 27.0 | Confirmation before destructive acts on shared content |
| `EntityOwnership` | option set | 27.0 | `.shared`, `.public` |
| `RelevantEntities` | struct | 27.0 | Suggest media entities in workouts and similar contexts |
| `EntityCollection` | struct | 27.0 | Hundreds of entities without hydrating each one |
| `LongRunningIntent` | protocol | 27.0 | Background work beyond the 30 s limit |
| `LongRunningTaskOptions` | struct | 27.0 | Configuration for the extended runtime |
| `IntentExecutionTargets` | option set | 27.0 | Pin an intent to app / extension / widget process |
| `AppUnionValue` + `@UnionValue` | protocol + macro | 27.0 | Union-typed Shortcuts parameters with picker UI |
| `RunSystemShortcutIntent` | struct | 27.0 (iOS/iPadOS/Catalyst) | Widget button runs any shortcut or opens any app |
| `AppIntentError(description:)` | init | 27.0 | Localized failure text |
| `CancellableIntent` | protocol | 26.4 | Cleanup with a known cancellation reason |
| `IntentValueRepresentation` | struct | 26.4 | Bridge an entity to a system value (`PlaceDescriptor`, …) |
| `IntentModes` / `supportedModes` | option set | 26.0 | Declare foreground / background execution |
| `UndoableIntent` | protocol | 26.0 | Register undo actions from an intent |
| `SnippetIntent` | protocol | 26.0 | Interactive result snippet |
| `IndexedEntity` | protocol | 18.0 | Entity in the Spotlight index |
| `appEntityIdentifier(_:)` | View modifier | 18.4 | Onscreen awareness ("this walk") |

---

## SyncableEntity — cross-device identity

```swift
protocol SyncableEntity : AppEntity
```

Three adoption shapes, in order of preference:

**Passthrough** — the ID is already stable across devices (server UUID, CloudKit record name):

```swift
struct Article: AppEntity, SyncableEntity {
    var id: UUID          // nothing else to do
    var title: String
}
```

**Mapped** — local and stable identifiers differ:

```swift
struct Photo: AppEntity, SyncableEntity {
    var id: SyncableEntityIdentifier<String, String>
    var creationDate: Date

    init(localID: String, stableID: String, creationDate: Date) {
        self.id = SyncableEntityIdentifier(local: localID, stable: stableID)
        self.creationDate = creationDate
    }
}
```

`SyncableEntityIdentifier` surface: `init(local:stable:)`, `init(id:)` (both identical),
`.local`, `.stable`, `.entityIdentifierString`, `.entityIdentifier(for:)`.

Equality has a sharp edge: two identifiers are equal only when they have the **same shape**.
Both-local compares local IDs, both-stable-only compares stable IDs, and mixed shapes are *never*
equal. Don't compare an ID that came back from the system with one built locally in a different
shape.

**Custom** — a bespoke ID type conforming to `SyncableEntityIdentifierProviding` supplies the stable
value through `stableIdentifierString`.

App code always works with its own ID type. `EntityIdentifier.stableIdentifier` is framework
territory.

---

## IndexedEntityQuery — reindex on demand

```swift
protocol IndexedEntityQuery : EntityQuery where Self.Entity : IndexedEntity
```

Only relevant for entities donated with `CSSearchableIndex.indexAppEntities(_:priority:)`. Without
this conformance, Spotlight falls back to `CSSearchableIndexDelegate`; entities donated as
`CSSearchableItem` always use the delegate regardless.

```swift
struct PhotoQuery: IndexedEntityQuery {
    func reindexEntities(
        for identifiers: [PhotoEntity.ID],
        indexDescription: CSSearchableIndexDescription
    ) async throws {
        let photos = try await photoStore.fetch(ids: identifiers)
        try await CSSearchableIndex(name: "MyPhotosApp").indexAppEntities(photos)
    }

    func reindexAllEntities(indexDescription: CSSearchableIndexDescription) async throws {
        try await CSSearchableIndex(name: "MyPhotosApp").indexAppEntities(photoStore.fetchAll())
    }
}
```

`IndexedEntity` itself offers `attributeSet`, `defaultAttributeSet` and `hideInSpotlight`.

---

## EntityCollection — large parameters without hydration

```swift
struct EntityCollection<Entity> where Entity : AppEntity
```

As an intent parameter type it stops the system resolving every identifier into a full `AppEntity`
during parameter resolution — the difference between instant and multi-second for hundreds of items.

```swift
struct DisableAlarmsIntent: AppIntent {
    static var title: LocalizedStringResource = "Disable Alarms"

    @Parameter(title: "Alarms")
    var alarms: EntityCollection<AlarmEntity>

    func perform() async throws -> some IntentResult {
        try await AlarmService.disable(alarms.identifiers)   // identifiers only
        return .result()
    }
}
```

`resolvedEntities()` hydrates through the app's query types and caches the result. `init(entities:)`,
`init(identifiers:)`, `count`, `isEmpty`, `append`, `append(contentsOf:)`, `contains`, `remove`, plus
`Collection` and `Sequence` conformance.

---

## LongRunningIntent — past the 30-second ceiling

```swift
protocol LongRunningIntent : ProgressReportingIntent
```

iOS, iPadOS, tvOS, visionOS and watchOS give a background task 30 seconds. macOS has no limit.
Uploads, sync, ML inference and bulk processing need the extension.

```swift
struct UploadFileIntent: LongRunningIntent {
    static var title: LocalizedStringResource = "Upload Large File"

    @Parameter(title: "File")
    var file: IntentFile

    func perform() async throws -> some IntentResult & ReturnsValue<String> {
        let result = try await performBackgroundTask {
            progress.totalUnitCount = 100
            progress.localizedDescription = "Uploading file"

            for chunk in 0..<100 {
                try Task.checkCancellation()
                await uploadChunk(chunk)
                progress.completedUnitCount = Int64(chunk + 1)
                progress.localizedAdditionalDescription = "\(chunk + 1)% complete"
            }
            return "Upload complete!"
        }
        return .result(value: result)
    }
}
```

**The progress updates are load-bearing.** Stop reporting and the system revokes the extension and
ends the task. `performBackgroundTask(options:operation:onCancel:)` adds a cancellation path.

---

## CancellableIntent — cleanup with a reason (26.4)

The system cancels an intent when it misses the 30-second limit without reporting progress, or when
someone cancels it from Siri, a Live Activity or Shortcuts. Plain
`withTaskCancellationHandler(handler:operation:)` is enough when the reason doesn't matter; use this
when it does.

```swift
struct ProcessPaymentIntent: AppIntent, ProgressReportingIntent, CancellableIntent {
    static var title: LocalizedStringResource = "Process Payment"

    @Parameter var amount: Decimal
    @Parameter var paymentMethod: PaymentMethod

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let transactionID = UUID()

        return try await withIntentCancellationHandler {
            updateProgress(fractionCompleted: 0.0, message: "Initiating payment...")
            try await paymentService.initiateTransaction(transactionID, amount: amount)
            updateProgress(fractionCompleted: 0.7, message: "Processing payment...")
            try await paymentService.process(transactionID)
            return .result(dialog: "Payment of \(amount) processed successfully")
        } onCancel: { reason in
            Task {
                switch reason {
                case .timeout:       try? await paymentService.rollback(transactionID, reason: "timeout")
                case .userCancelled: try? await paymentService.cancel(transactionID, reason: "user_cancelled")
                default:             try? await paymentService.cancel(transactionID, reason: "unknown")
                }
            }
        }
    }
}
```

Keep the handler fast — outside macOS the process can still be suspended shortly after cancellation.

---

## OwnershipProvidingEntity — confirmation on shared content

```swift
protocol OwnershipProvidingEntity : AppEntity
```

Deleting a private album and deleting a family-shared album are different acts. Report ownership and
the system prompts with the right context before destructive intents.

```swift
@AppEntity(schema: .photos.album)
struct PhotoAlbumEntity: OwnershipProvidingEntity {
    let id = UUID()
    var isSharedWithFamily: Bool
    var isPublicAlbum: Bool
    var name: String
    var creationDate: Date?
    var albumType: PhotoAlbumType

    var ownership: EntityOwnership {
        var ownership: EntityOwnership = []
        if isSharedWithFamily { ownership.insert(.shared) }
        if isPublicAlbum { ownership.insert(.public) }
        return ownership
    }
}
```

---

## RelevantEntities — media suggestions in context

```swift
RelevantEntities.shared.updateEntities(entities, for: context)
```

One active suggestion set per app: each call **replaces** the previous set. Pass an empty array to
clear. Suggestions expire after roughly four weeks if the app is never launched. Contexts:
`AppEntityContext`, `AudioContext`. Removal: `removeAllEntities()`, `removeAllEntities(for:)`,
`removeEntities(_:)`, `removeEntities(_:from:)`.

---

## Runtime placement

**Which process runs it** (27.0) — matters once intents live in a shared package used by the app,
an App Intents extension and a widget extension:

```swift
struct MyIntent: AppIntent {
    static var allowedExecutionTargets: IntentExecutionTargets { [.main, .appIntentsExtension] }
}
```

`.main`, `.appIntentsExtension`, `.widgetKitExtension`, `.default` (any available target).
Anything touching UI belongs in `.main`; silent data work runs happily in the extension.

**Foreground or background** (26.0):

```swift
static var supportedModes: IntentModes { [.foreground, .background] }
```

Then branch at runtime on `systemContext.currentMode` — e.g. show a confirmation sheet in the
foreground, write silently in the background.

---

## AppUnionValue — one parameter, several types (27.0)

```swift
@UnionValue
enum Reaction {
    case tapback(Tapback)
    case text(String)
}

extension Reaction {
    static var typeDisplayRepresentation: TypeDisplayRepresentation { "Reaction" }
    static let caseDisplayRepresentations: [Cases: DisplayRepresentation] = [
        .tapback: "Tapback",
        .text: "Text Reaction"
    ]
}
```

The macro generates `AppUnionValue` conformance; the extension supplies the metadata that drives the
Shortcuts picker.

---

## RunSystemShortcutIntent — widget launcher (27.0, iOS/iPadOS/Catalyst)

Valid **only** as `Button(intent:)` inside a widget. The person picks the action when configuring
the widget; the app gets no access to the shortcut's contents.

```swift
struct LauncherWidgetConfigurationIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource { "Launcher Widget" }
    static var description: IntentDescription { "Widget that runs a shortcut or opens an app" }

    @Parameter(title: "Action")
    var shortcut: SystemShortcut
}

Button(intent: RunSystemShortcutIntent(shortcut: entry.configuration.shortcut)) {
    Text(entry.configuration.shortcut.displayRepresentation.title)
}
```

If the chosen shortcut needs input, the system may open the Shortcuts app to run it.

---

## App schema macros

`@AppIntent(schema:)`, `@AppEntity(schema:)`, `@AppEnum(schema:)` map types onto system-defined
shapes so Apple Intelligence understands them without inference.

Primary domains: audio, calendar, camera, clock, mail, maps, messages, notes, phone, photos,
reminders, system and in-app search.
Shortcuts-only domains: books, browser, files, journaling, presentation, reader, spreadsheet,
whiteboard, word processor.
Single-purpose: assistant, visual intelligence.

The `.system` domain applies to any app that opens content. `.system.open` is current;
**`.system.search` is deprecated** — serve search through `.system.open` plus Spotlight indexing and
an `EntityStringQuery`. In Xcode, typing `system_` offers schema templates.

---

## Testing (App Intents Testing framework)

Tests live in a **UI testing target**, not a unit test target, and reach the app out-of-process
through the same infrastructure Siri and Shortcuts use. Types are looked up by string name, so no
app module import is needed.

```swift
let app = XCUIApplication()
var definitions: IntentDefinitions!

override func setUp() async throws {
    app.launch()
    definitions = IntentDefinitions(bundleIdentifier: "com.example.my-app")
}
```

| Need | Call |
|------|------|
| Run an intent | `definitions.intents["Name"].makeIntent(...).run()` |
| Resolve by spoken name | `definitions.entities["Name"].entities(matching: "Work")` |
| Reference a known entity | `definitions.entities["Name"].makeReference(identifier: "id")` |
| Build an enum value | `definitions.enums["Name"].makeCase("high")` |
| Verify Spotlight | `definitions.entities["Name"].spotlightQuery("Design Review")` — `nil` returns everything indexed |
| Verify onscreen annotations | `definitions.entities["Name"].viewAnnotations()` |
| Round-trip `Transferable` | `entity.exported(as: .json)` then `definition.resolved(from:)` |

Results use `@dynamicMemberLookup`: `try result.value.title`, `try results[0].name`.

Chain intents by passing an `AnyAppEntity` straight from one result into the next intent's
parameters — that is how a regression in identifier format gets caught.

Seed state with test-only intents rather than UI automation:

```swift
#if DEBUG
struct ResetDatabaseIntent: AppIntent {
    static let title: LocalizedStringResource = "Reset Database"
    static let isDiscoverable = false

    func perform() async throws -> some IntentResult {
        // Clear all data and insert seed records.
    }
}
#endif
```

---

## Sources

- App Intents updates — https://developer.apple.com/documentation/updates/appintents
- App schema domains — https://developer.apple.com/documentation/appintents/app-schema-domains
- Making app entities available in Spotlight — https://developer.apple.com/documentation/appintents/making-app-entities-available-in-spotlight
- Testing your App Intents code — https://developer.apple.com/documentation/appintentstesting/testing-your-app-intents-code
- WWDC26 343 — Explore advanced App Intents features for Siri and Apple Intelligence
- WWDC26 345 — Discover new capabilities in the App Intents framework
