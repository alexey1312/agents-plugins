---
description: Comprehensive Swift code review using swift-expert agent
allowed-tools: Task, Read, Glob, Grep, Bash(swiftlint *)
version: 1.0
---

# Swift Code Review

Perform a comprehensive code review of Swift files using the swift-expert agent.

## Usage

```bash
/review-swift                    # Review staged changes
/review-swift path/to/file.swift # Review specific file
/review-swift --all              # Review all Swift files
```

## Review Checklist

### 1. Swift Best Practices
- [ ] Modern Swift 5.9+ patterns
- [ ] Proper async/await usage
- [ ] Protocol-oriented design
- [ ] Value types vs reference types

### 2. Concurrency Safety
- [ ] Actor isolation
- [ ] Sendable conformance
- [ ] Race condition prevention
- [ ] MainActor annotations

### 3. Performance
- [ ] Avoid unnecessary allocations
- [ ] Lazy properties where appropriate
- [ ] Efficient collection operations
- [ ] Memory management (weak/unowned)

### 4. Code Quality
- [ ] SwiftLint compliance
- [ ] Naming conventions
- [ ] Documentation comments
- [ ] Error handling patterns

### 5. Testing
- [ ] Test coverage >= 80%
- [ ] Edge cases covered
- [ ] Mocking strategy

## Workflow

1. **Identify files to review**
   ```bash
   git diff --name-only --cached -- '*.swift'
   ```

2. **Run SwiftLint**
   ```bash
   swiftlint lint --path <file>
   ```

3. **Spawn swift-expert**
   Use swift-expert agent to perform deep review

4. **Generate report**
   Output structured review with:
   - Critical issues
   - Warnings
   - Suggestions
   - Best practices

## Output Format

```markdown
## Swift Code Review: <filename>

### Critical Issues
- [ ] Issue 1: Description (line X)

### Warnings
- [ ] Warning 1: Description

### Suggestions
- Consider using `async let` for parallel fetches
- Extract protocol for better testability

### Best Practices Applied
- Proper use of Result type
- Clean error handling
```

## Integration

Works with:
- `swift-expert` agent for deep analysis
- `xcode-builder` skill for build validation
- `pr-summary` command for PR description

## Examples

### Review PR Changes
```bash
/review-swift
# Reviews all staged .swift files
# Uses swift-expert for analysis
# Outputs structured review
```

### Review Specific Module
```bash
/review-swift Sources/Networking/
# Reviews all Swift files in Networking module
```

### Full Project Audit
```bash
/review-swift --all --strict
# Reviews entire project
# Fails on any critical issues
```
