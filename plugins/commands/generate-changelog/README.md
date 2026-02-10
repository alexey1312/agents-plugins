# generate-changelog

Generate changelog from git commits following conventional commits format.

## Installation

```bash
/plugin install generate-changelog@aleksei-plugins
```

## Usage

```bash
/generate-changelog                    # Since last tag
/generate-changelog --since v1.0.0     # Since specific tag
/generate-changelog --unreleased       # Unreleased changes only
```

## Features

- Conventional commits parsing
- Grouped by type (features, fixes, breaking changes)
- PR/issue links extraction
- Contributor list
- Multiple output formats (md, json, toon)
