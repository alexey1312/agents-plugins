---
name: xcode-builder
description: Build and test Swift/Xcode projects using xcodebuild/swift commands with xcsift for TOON output. Use when user asks to build, test, or run iOS/macOS apps.
---

# Xcode Builder Skill

Build Swift projects using standard CLI tools with token-efficient TOON output via xcsift.

## Prerequisites

```bash
# Install xcsift (Homebrew)
brew install ldomaradzki/tap/xcsift

# Or via Mint
mint install ldomaradzki/xcsift
```

## Build Commands

### Swift Package

```bash
# Build
swift build 2>&1 | xcsift -f toon --toon-key-folding safe

# Build release
swift build -c release 2>&1 | xcsift -f toon --toon-key-folding safe

# With warnings
swift build 2>&1 | xcsift -f toon -w --toon-key-folding safe
```

### Xcode Project (Simulator)

```bash
# Get simulator UUID
SIM_ID=$(xcrun simctl list devices available -j | jq -r '[.devices[][] | select(.isAvailable==true and .name | contains("iPhone"))][0].udid')

# Build for simulator
xcodebuild build \
  -workspace Project.xcworkspace \
  -scheme SchemeName \
  -destination "id=$SIM_ID" \
  2>&1 | xcsift -f toon --toon-key-folding safe
```

### Xcode Project (Device)

```bash
xcodebuild build \
  -workspace Project.xcworkspace \
  -scheme SchemeName \
  -destination generic/platform=iOS \
  2>&1 | xcsift -f toon --toon-key-folding safe
```

### macOS App

```bash
xcodebuild build \
  -project Project.xcodeproj \
  -scheme SchemeName \
  -destination "platform=macOS" \
  2>&1 | xcsift -f toon --toon-key-folding safe
```

## Test Commands

### Swift Package Tests

```bash
# Basic tests
swift test 2>&1 | xcsift -f toon --toon-key-folding safe

# With coverage
swift test --enable-code-coverage 2>&1 | xcsift -f toon -c --toon-key-folding safe

# Coverage with details
swift test --enable-code-coverage 2>&1 | xcsift -f toon -c --coverage-details --toon-key-folding safe
```

### Xcode Tests (Simulator)

```bash
xcodebuild test \
  -workspace Project.xcworkspace \
  -scheme SchemeName \
  -destination "id=$SIM_ID" \
  2>&1 | xcsift -f toon -w --toon-key-folding safe
```

### Xcode Tests with Coverage

```bash
xcodebuild test \
  -workspace Project.xcworkspace \
  -scheme SchemeName \
  -destination "id=$SIM_ID" \
  -enableCodeCoverage YES \
  2>&1 | xcsift -f toon -c --coverage-details --toon-key-folding safe
```

## xcsift Flags Reference

```toon
flags[6]{flag,short,description}:
 --format,-f,Output format: json|toon|github-actions
 --warnings,-w,Include detailed warnings array
 --quiet,-q,Suppress output on success
 --coverage,-c,Include code coverage summary
 --coverage-details,,Per-file coverage breakdown
 --toon-key-folding,,Key folding: disabled|safe (default: disabled)
```

### TOON Format Options

```toon
toon_options[3]{flag,values,description}:
 --toon-delimiter,comma|tab|pipe,Field separator (default: comma)
 --toon-length-marker,none|hash,Array length notation (default: none)
 --toon-key-folding,disabled|safe,Fold repeated keys (default: disabled)
```

## Output Examples

### Build Success (TOON)

```toon
status: success
summary:
  errors: 0
  warnings: 2
  build_time: 12.5s
```

### Build Failure (TOON)

```toon
status: failure
summary:
  errors: 1
  warnings: 0
errors[1]{file,line,col,message}:
 Sources/App/Main.swift,15,10,Cannot find 'foo' in scope
```

### Test Results (TOON)

```toon
status: success
summary:
  tests_passed: 42
  tests_failed: 0
  tests_skipped: 2
  coverage: 78.5%
  duration: 8.3s
```

## Project Discovery

```bash
# Find Xcode projects
find . -name "*.xcodeproj" -o -name "*.xcworkspace" | head -5

# List schemes
xcodebuild -list -workspace Project.xcworkspace 2>/dev/null | grep -A 100 "Schemes:" | tail -n +2

# List available simulators
xcrun simctl list devices available --json | jq '.devices | to_entries[] | .value[] | "\(.name) - \(.udid)"'
```

## Common Workflows

### Quick Build Check

```bash
swift build 2>&1 | xcsift -f toon -q --toon-key-folding safe
```

### Full Test Suite with Coverage

```bash
swift test --enable-code-coverage 2>&1 | xcsift -f toon -w -c --coverage-details --toon-key-folding safe
```

### CI/CD (GitHub Actions)

```bash
# Auto-adds workflow annotations
GITHUB_ACTIONS=true xcodebuild test \
  -scheme SchemeName \
  -destination "platform=iOS Simulator,name=iPhone 16" \
  2>&1 | xcsift -f toon --toon-key-folding safe
```

## Best Practices

- **Always use `2>&1`** - captures stderr for complete error output
- **Use `--toon-key-folding safe`** - reduces tokens for TOON 3.0 compatibility
- **Use `-q` for CI** - quiet mode suppresses success output
- **Cache simulator UUID** - avoid repeated lookups
- **Prefer `-f toon`** - 30-60% fewer tokens than JSON
