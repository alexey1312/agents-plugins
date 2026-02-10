---
description: Generate changelog from git commits following conventional commits format
allowed-tools: Bash(git *), Read, Write, Glob
version: 1.0
---

# Generate Changelog

Generate a structured changelog from git commits, following conventional commits format.

## Usage

```bash
/generate-changelog                    # Since last tag
/generate-changelog --since v1.0.0     # Since specific tag
/generate-changelog --range v1.0..v1.1 # Between versions
/generate-changelog --unreleased       # Unreleased changes only
```

## Commit Format

Expects conventional commits:
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Tests
- `build` - Build system
- `ci` - CI/CD
- `chore` - Maintenance

### Breaking Changes
```
feat(api)!: Remove deprecated endpoints

BREAKING CHANGE: /v1/users endpoint removed
```

## Output Format

```markdown
# Changelog

## [1.2.0] - 2025-01-15

### Features
- **auth**: Add biometric authentication (#123)
- **profile**: User avatar upload support (#125)

### Bug Fixes
- **network**: Fix timeout on slow connections (#124)
- **ui**: Correct dark mode colors (#126)

### Performance
- **database**: Optimize query performance (#127)

### Breaking Changes
- **api**: Remove deprecated v1 endpoints (#128)

### Contributors
- @developer1, @developer2
```

## Workflow

### 1. Get Commits
```bash
git log --oneline --since="$(git describe --tags --abbrev=0)"
```

### 2. Parse Commits
Group by type:
- Features → `### Features`
- Fixes → `### Bug Fixes`
- Breaking → `### Breaking Changes`

### 3. Extract Metadata
- PR numbers from commit messages
- Jira tickets (PROJ-XXX)
- Contributors

### 4. Generate Markdown
Output structured changelog

## Options

| Flag | Description |
|------|-------------|
| `--since` | Start from tag |
| `--range` | Between two refs |
| `--unreleased` | Changes since last tag |
| `--format` | Output format (md, json, toon) |
| `--include-authors` | Add contributor list |
| `--include-links` | Add PR/issue links |

## Integration

### With Releases
```bash
/generate-changelog --unreleased > CHANGELOG.md
git add CHANGELOG.md
git commit -m "docs: Update changelog for v1.2.0"
git tag v1.2.0
```

### With PR Summary
```bash
# Before creating PR
/generate-changelog --unreleased
/command pr-summary
```

### Mobile-Specific

For iOS/Android projects, also consider:
- App version bumps
- TestFlight/Play Store release notes
- Breaking API changes

## Examples

### Standard Release
```bash
/generate-changelog --since v1.1.0 --include-links
```

### Unreleased Preview
```bash
/generate-changelog --unreleased --format toon
```

### Full History
```bash
/generate-changelog --all --include-authors > CHANGELOG.md
```

## Tips

1. Use conventional commits consistently
2. Include scope for better organization
3. Mark breaking changes with `!` or footer
4. Reference PRs and issues in commits
5. Run before each release
