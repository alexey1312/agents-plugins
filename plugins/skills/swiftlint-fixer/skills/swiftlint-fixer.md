---
name: swiftlint-fixer
description: >
  Detects and auto-fixes SwiftLint violations in Swift code. Use when linting Swift files,
  fixing code style issues, running swiftlint, or preparing code for PR review.
---

# SwiftLint Fixer

Automatically detect and fix SwiftLint violations in Swift projects.

## Quick Start

```bash
# Lint current directory
swiftlint lint

# Auto-fix correctable violations
swiftlint lint --fix

# Lint specific file
swiftlint lint --path Sources/MyFile.swift
```

## Installation

```bash
brew install swiftlint
```

## Auto-Fix

```bash
# Fix all correctable violations
swiftlint lint --fix

# Fix specific file
swiftlint lint --fix --path MyFile.swift

# Dry run (show what would be fixed)
swiftlint lint --fix --dry-run
```

## Baseline (for legacy codebases)

```bash
# Generate baseline — snapshot current violations
swiftlint lint --baseline baseline.json

# Lint against baseline — only report new violations
swiftlint lint --baseline baseline.json
```

## Configuration

### .swiftlint.yml (key sections)

```yaml
excluded:
  - Pods
  - Carthage
  - Generated

opt_in_rules:
  - force_unwrapping
  - implicitly_unwrapped_optional
  - fatal_error_message
  - contains_over_filter_count

custom_rules:
  no_print:
    name: "No print statements"
    regex: "print\\s*\\("
    message: "Use Logger instead of print"
    severity: warning
```

## Common Violations & Fixes

### Auto-Fixable
| Rule | Before | After |
|------|--------|-------|
| `trailing_whitespace` | `let x = 1   ` | `let x = 1` |
| `trailing_semicolon` | `let x = 1;` | `let x = 1` |
| `colon` | `let x :Int` | `let x: Int` |
| `opening_brace` | `func foo(){` | `func foo() {` |
| `redundant_optional_initialization` | `var x: Int? = nil` | `var x: Int?` |
| `redundant_void_return` | `-> Void` | (removed) |

### Manual Fix Required
| Rule | Issue | Fix |
|------|-------|-----|
| `force_cast` | `as!` | Use `as?` with guard |
| `force_unwrapping` | `!` | Use `if let` or `guard` |
| `line_length` | >120 chars | Break into multiple lines |
| `cyclomatic_complexity` | Complex function | Extract into smaller functions |

## CI Integration

```yaml
# GitHub Actions
- name: SwiftLint
  run: |
    swiftlint lint --strict --reporter github-actions-logging
```

## Integration with Mobile Toolkit

### With review-swift
```bash
# Review includes SwiftLint check
/review-swift Sources/
```

### With analyze-build
```bash
# Lint before build
swiftlint lint --strict && /analyze-build
```

## Tips

1. Use `--baseline` for legacy codebases — lint only new violations
2. Enable `github-actions-logging` reporter in CI
3. Use `excluded` for generated code
