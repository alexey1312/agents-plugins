# to-toon

Convert JSON/XML/YAML to compact TOON format with 30-60% token savings.

## Installation

```bash
/plugin install to-toon@aleksei-plugins
```

## Usage

Auto-invoked when user asks to convert data to TOON:

```
"convert this JSON to TOON format"
"compress this API response"
```

## Features

- JSON to TOON via `@toon-format/cli`
- XML to TOON via included scripts
- Token savings statistics
- Figma MCP data compression

## Included Scripts

- `scripts/xml-to-toon.sh` — XML to TOON pipeline
- `scripts/xml-to-json.mjs` — XML to JSON converter
