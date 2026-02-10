---
name: swiftlint-fixer
description: Automatically detect and fix SwiftLint violations in Swift code
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

## Commands

### Linting
```bash
# Lint with default config
swiftlint lint

# Lint specific paths
swiftlint lint --path Sources/ --path Tests/

# Quiet mode (errors only)
swiftlint lint --quiet

# Strict mode (warnings as errors)
swiftlint lint --strict

# Reporter formats
swiftlint lint --reporter json
swiftlint lint --reporter html > report.html
swiftlint lint --reporter github-actions-logging  # For CI
```

### Auto-Fix
```bash
# Fix all correctable violations
swiftlint lint --fix

# Fix specific file
swiftlint lint --fix --path MyFile.swift

# Dry run (show what would be fixed)
swiftlint lint --fix --dry-run
```

### Analysis
```bash
# Analyze (deeper checks, slower)
swiftlint analyze

# Generate baseline
swiftlint lint --baseline baseline.json

# Lint against baseline (only new violations)
swiftlint lint --baseline baseline.json
```

## Configuration

### .swiftlint.yml
```yaml
# Paths to include
included:
  - Sources
  - Tests

# Paths to exclude
excluded:
  - Pods
  - Carthage
  - Generated

# Disable rules
disabled_rules:
  - trailing_whitespace
  - line_length

# Enable opt-in rules
opt_in_rules:
  - empty_count
  - empty_string
  - closure_end_indentation
  - contains_over_filter_count
  - discouraged_optional_boolean
  - explicit_init
  - fatal_error_message
  - first_where
  - force_unwrapping
  - implicitly_unwrapped_optional
  - modifier_order
  - multiline_arguments
  - multiline_parameters
  - overridden_super_call
  - private_action
  - private_outlet
  - prohibited_super_call
  - redundant_nil_coalescing
  - single_test_class
  - sorted_first_last
  - unneeded_parentheses_in_closure_argument
  - vertical_parameter_alignment_on_call

# Rule configuration
line_length:
  warning: 120
  error: 200

type_body_length:
  warning: 300
  error: 500

file_length:
  warning: 500
  error: 1000

identifier_name:
  min_length: 2
  max_length: 50
  excluded:
    - id
    - x
    - y
    - i
    - j

nesting:
  type_level: 2

# Custom rules
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
| `trailing_newline` | (no newline at EOF) | (newline at EOF) |
| `trailing_semicolon` | `let x = 1;` | `let x = 1` |
| `colon` | `let x :Int` | `let x: Int` |
| `comma` | `func(a:1,b:2)` | `func(a: 1, b: 2)` |
| `opening_brace` | `func foo(){` | `func foo() {` |
| `redundant_optional_initialization` | `var x: Int? = nil` | `var x: Int?` |
| `redundant_void_return` | `-> Void` | (removed) |

### Manual Fix Required
| Rule | Issue | Fix |
|------|-------|-----|
| `force_cast` | `as!` | Use `as?` with guard |
| `force_unwrapping` | `!` | Use `if let` or `guard` |
| `line_length` | >120 chars | Break into multiple lines |
| `cyclomatic_complexity` | Complex function | Refactor into smaller functions |
| `function_body_length` | >40 lines | Extract into helper methods |

## Workflow

### Pre-Commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run SwiftLint
if which swiftlint >/dev/null; then
  swiftlint lint --strict
else
  echo "warning: SwiftLint not installed"
fi
```

### CI Integration
```yaml
# GitHub Actions
- name: SwiftLint
  run: |
    swiftlint lint --strict --reporter github-actions-logging
```

### Fix Before PR
```bash
# Auto-fix what's possible
swiftlint lint --fix

# Check remaining issues
swiftlint lint --strict

# If issues remain, fix manually
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

1. Add `.swiftlint.yml` to project root
2. Use `--fix` before commits
3. Use `--baseline` for legacy codebases
4. Enable `github-actions-logging` in CI
5. Configure IDE integration for real-time feedback
6. Start with fewer rules, add gradually
7. Use `excluded` for generated code
