---
description: Analyze xcodebuild output with xcsift and convert to TOON format
allowed-tools: Bash(xcodebuild *), Bash(swift build *), Bash(xcsift *), Read, Write
version: 1.0
---

# Analyze Build

Analyze xcodebuild or swift build output using xcsift and convert to optimized TOON format.

## Usage

```bash
/analyze-build                      # Build and analyze current project
/analyze-build --scheme MyScheme    # Specific scheme
/analyze-build --test               # Build and run tests
/analyze-build --coverage           # Include code coverage
```

## Workflow

### 1. Build Project
```bash
# Swift Package
swift build 2>&1 | xcsift -f toon --toon-key-folding safe

# Xcode Project
xcodebuild build \
  -workspace Project.xcworkspace \
  -scheme MyScheme \
  -destination "platform=iOS Simulator,name=iPhone 15" \
  2>&1 | xcsift -f toon --toon-key-folding safe
```

### 2. Parse Output
xcsift parses:
- Build warnings and errors
- Compilation times
- Linker issues
- Test results (if --test)
- Code coverage (if --coverage)

### 3. Convert to TOON
Output in compact TOON format:
```toon
status: success
summary:
  warnings: 3
  errors: 0
  duration: 45.2s
warnings[3]{file,line,message}:
  ViewController.swift,42,"Unused variable 'temp'"
  NetworkManager.swift,128,"Deprecated API usage"
  AppDelegate.swift,15,"Missing documentation"
```

## Options

| Flag | Description |
|------|-------------|
| `--scheme` | Xcode scheme to build |
| `--test` | Run tests after build |
| `--coverage` | Include code coverage report |
| `--destination` | Build destination |
| `--configuration` | Debug or Release |
| `--clean` | Clean before build |

## Output Examples

### Successful Build
```toon
status: success
summary:
  tests_passed: 142
  tests_failed: 0
  coverage: 78.5%
  duration: 23.4s
  warnings: 2
```

### Failed Build
```toon
status: failed
errors[2]{file,line,message,code}:
  Model.swift,45,"Type 'User' has no member 'fullname'",E0001
  API.swift,89,"Missing return in closure",E0002
fix_suggestions:
  - "Model.swift:45 - Did you mean 'fullName'?"
  - "API.swift:89 - Add explicit return statement"
```

### Test Results
```toon
status: success
tests:
  passed: 98
  failed: 2
  skipped: 3
failed_tests[2]{suite,test,message}:
  UserTests,testLogin,"Expected true, got false"
  APITests,testFetch,"Timeout after 10s"
coverage:
  total: 78.5%
  uncovered_files[3]:
    - Legacy/OldManager.swift (12%)
    - Utils/Deprecated.swift (0%)
    - Debug/TestHelpers.swift (45%)
```

## Integration

### With CI/CD
```bash
# GitHub Actions
/analyze-build --test --coverage | tee build-report.toon
```

### With PR Summary
```bash
/analyze-build && /command pr-summary
```

### With Swift Review
```bash
/analyze-build
# If warnings found:
/review-swift --files-with-warnings
```

## Tips

1. Use `--clean` for reproducible builds
2. Use `--coverage` before PR review
3. Parse TOON output for CI integration
4. Save reports for trend analysis
