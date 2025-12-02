---
name: to-toon
description: >
  Convert any structured data to TOON format (Token-Oriented Object Notation).
  Use this skill when: 1) You have JSON, XML, or YAML data to compress,
  2) User asks to convert data to TOON for token efficiency,
  3) Working with Figma MCP output, API responses, or config files.
  TOON reduces tokens by 30-60% compared to JSON while maintaining structure.
---

# Universal TOON Converter

## Purpose

Convert any structured data (JSON, XML, YAML) to compact TOON format for efficient LLM processing.

## Quick Start

### JSON → TOON (use official CLI)

```bash
# Direct conversion
npx @toon-format/cli input.json -o output.toon

# From stdin
echo '{"name": "Ada", "age": 30}' | npx @toon-format/cli

# With token savings stats
npx @toon-format/cli data.json --stats
```

### TOON → JSON (decode)

```bash
npx @toon-format/cli data.toon -o output.json
```

### XML → TOON (via JSON)

```bash
# Use included script for XML (e.g., Figma MCP output)
${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-toon.sh input.xml

# Or manual: XML → JSON → TOON
cat input.xml | node ${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-json.mjs | npx @toon-format/cli
```

## CLI Reference

```bash
# Encode JSON to TOON (auto-detected by extension)
npx @toon-format/cli input.json -o output.toon

# Decode TOON to JSON (auto-detected)
npx @toon-format/cli data.toon -o output.json

# Pipe from stdin
cat data.json | npx @toon-format/cli
echo '{"name": "Ada"}' | npx @toon-format/cli

# Output to stdout
npx @toon-format/cli input.json

# Show token savings
npx @toon-format/cli data.json --stats
```

## TOON Format Overview

TOON combines YAML-like syntax with CSV-style tabular arrays:

```toon
# Key-value pairs
name: Ada
age: 30

# Nested objects
address:
  city: Berlin
  zip: 10115

# Uniform arrays (most compact!)
users[3]{id,name,email}:
 1,Alice,alice@example.com
 2,Bob,bob@example.com
 3,Carol,carol@example.com
```

## Token Savings Examples

| Input Format | JSON Tokens | TOON Tokens | Savings |
|--------------|-------------|-------------|---------|
| Simple object | 50 | 30 | 40% |
| Array of 10 objects | 500 | 200 | 60% |
| Nested config | 1000 | 450 | 55% |
| Figma design context | 10000 | 4000 | 60% |

## Common Use Cases

### 1. API Response Compression

```bash
curl -s https://api.example.com/users | npx @toon-format/cli --stats
```

### 2. Config File Compression

```bash
npx @toon-format/cli package.json --stats
npx @toon-format/cli tsconfig.json -o tsconfig.toon
```

### 3. Figma MCP Data

After `get_design_context` call:
```bash
${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-toon.sh figma-output.xml --stats
```

### 4. Database Export

```bash
cat users.json | npx @toon-format/cli > users.toon
```

## Included Scripts

### xml-to-toon.sh

Full pipeline for XML data (Figma, HTML, SVG, etc.):

```bash
# Basic usage
${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-toon.sh input.xml

# With output file
${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-toon.sh input.xml -o output.toon

# Show stats
${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-toon.sh input.xml --stats

# JSON only (skip TOON step)
${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-toon.sh input.xml --json-only
```

### xml-to-json.mjs

Convert XML to JSON (Node.js):

```bash
cat input.xml | node ${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-json.mjs
```

## Integration Tips

### In Claude Code

When you receive structured data, consider:

1. **JSON data** → Use `npx @toon-format/cli` directly
2. **XML data** → Use `xml-to-json.mjs` then CLI
3. **YAML data** → Convert to JSON first, then CLI

### Alias (optional)

```bash
# Add to ~/.zshrc or ~/.bashrc
alias toon='npx @toon-format/cli'
alias xml2toon='${CLAUDE_PLUGIN_ROOT}/scripts/xml-to-toon.sh'
```

## When NOT to Use TOON

- Very small data (< 100 tokens) - overhead not worth it
- Deeply nested non-uniform structures - JSON may be clearer
- When exact JSON format is required downstream

@read reference.md for detailed format specification and edge cases.
