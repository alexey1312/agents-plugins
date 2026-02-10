# swiftlint-fixer

Automatically detect and fix SwiftLint violations in Swift code.

## Installation

```bash
/plugin install swiftlint-fixer@aleksei-plugins
brew install swiftlint
```

## Usage

Auto-invoked when user asks to fix lint issues:

```
"fix SwiftLint issues in Sources/"
"run SwiftLint on this file"
```

## Features

- Auto-fix correctable violations
- Configurable rules via `.swiftlint.yml`
- CI integration with GitHub Actions
- Baseline support for legacy codebases
