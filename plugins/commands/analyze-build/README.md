# analyze-build

Analyze xcodebuild output with xcsift and convert to TOON format.

## Installation

```bash
/plugin install analyze-build@aleksei-plugins
brew install ldomaradzki/tap/xcsift
```

## Usage

```bash
/analyze-build                      # Build and analyze
/analyze-build --scheme MyScheme    # Specific scheme
/analyze-build --test               # Build and run tests
/analyze-build --coverage           # Include code coverage
```

## Features

- Build with xcsift parsing
- Compact TOON output format
- Test results and coverage reporting
- Error diagnostics with fix suggestions
