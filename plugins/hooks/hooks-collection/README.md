# hooks-collection

Automation hooks for build suggestions, SwiftLint reminders, and coverage tips.

## Installation

```bash
/plugin install hooks-collection@aleksei-plugins
```

## Hooks

### PreToolUse
- Suggest xcsift when running `swift build` or `xcodebuild`

### PostToolUse
- Remind to run SwiftLint after editing `.swift` files
- Suggest coverage report after running tests
