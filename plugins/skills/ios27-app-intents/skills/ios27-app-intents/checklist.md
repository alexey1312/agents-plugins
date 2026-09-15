# iOS 27 App Intents — audit checklist

Run top to bottom when reviewing an existing integration. Each item is a claim to verify in code, not
a box to tick by intuition. Report what fails with the file and line.

## Entities

- [ ] Every user-facing noun in the app has an `AppEntity`
- [ ] `@Property` wraps only what Siri should narrate or Shortcuts should show — no internals,
      no routing data, no raw IDs
- [ ] `displayRepresentation` has a title *and* a subtitle worth reading aloud
- [ ] `IndexedEntity` adopted for anything a person would search for
- [ ] `attributeSet` puts the display name into `keywords` as well as `displayName`
- [ ] `hideInSpotlight` set on entities that exist only for Shortcuts
- [ ] **iOS 27** `SyncableEntity` adopted — and the identifier really is stable across devices
      (server UUID / CloudKit record name, not a Core Data object ID or a row number)
- [ ] **iOS 27** `OwnershipProvidingEntity` adopted wherever content can be shared or public
- [ ] `Transferable` adopted with `ValueRepresentation` if the entity should reach other apps

## Queries

- [ ] `defaultQuery` returns useful `suggestedEntities()` — an empty picker looks broken
- [ ] `EntityStringQuery` implemented so spoken and typed names resolve
- [ ] Matching is `localizedStandardContains` or better — never `==` on a spoken string
- [ ] No-match and multi-match both produce a usable answer (disambiguation or a clear dialog)
- [ ] **iOS 27** `IndexedEntityQuery` implemented for every indexed entity
- [ ] Reindex donates into the same `CSSearchableIndex` the original donation used

## Intents

- [ ] Conformed to an `AppSchema` where one fits — check the domain list before writing a custom one
- [ ] No new adoption of the deprecated `.system.search`
- [ ] `OpenIntent` also conforms to `TargetContentProvidingIntent` so it lands on the right scene
- [ ] `perform()` is `@MainActor` when it touches UI
- [ ] Errors are `AppIntentError` with localized descriptions, not `fatalError` or a bare `throw`
- [ ] **iOS 27** `supportedModes` declared, and `systemContext.currentMode` actually consulted when
      foreground and background behaviour differ
- [ ] **iOS 27** `allowedExecutionTargets` set when intents are shared across app and extensions
- [ ] **iOS 27** work that can exceed 30 s uses `LongRunningIntent` **and reports progress**
- [ ] **26.4** long or destructive work adopts `CancellableIntent` and cleans up per reason
- [ ] Reversible actions adopt `UndoableIntent`
- [ ] **iOS 27** parameters that can hold many entities use `EntityCollection`, not `[Entity]`

## App Shortcuts

- [ ] `AppShortcutsProvider` exists and every phrase contains `\(.applicationName)`
- [ ] Several natural phrasings per intent — how people speak, not the method name
- [ ] `shortTitle` and `systemImageName` set on every shortcut
- [ ] `updateAppShortcutParameters()` called at launch **and** after every entity rename, insert,
      delete
- [ ] Parameter phrases reference `\(\.$parameter)`, and the parameter has a working query

## Donations and context

- [ ] Intents donated on completion of a user action, never on view appearance or timer
- [ ] Stale donations deleted when the underlying data is deleted or the action is undone
- [ ] `appEntityIdentifier(_:)` on detail views so "this one" resolves
- [ ] List rows annotated with `appEntityIdentifier(forSelectionType:identifier:)`
- [ ] **iOS 27** `RelevantEntities` used if the app has media worth suggesting — one replacing set

## Availability

- [ ] iOS 27 conformances live on `@available(iOS 27.0, *)` extensions, not inline on members
- [ ] The entity and its query are **not** gated on iOS 27 — only the new conformances are
- [ ] The app still builds and behaves correctly at its actual deployment target

## Verification

- [ ] App Intents tests exist in a UI testing target with `IntentDefinitions`
- [ ] A test covers `spotlightQuery` for each indexed entity
- [ ] A test covers `entities(matching:)` for each `EntityStringQuery`
- [ ] A test chains two intents, passing an entity from the first into the second
- [ ] Test-only intents are `isDiscoverable = false` inside `#if DEBUG`
- [ ] Manual pass done: Spotlight search, one Siri phrase per shortcut, Shortcuts parameter picker
