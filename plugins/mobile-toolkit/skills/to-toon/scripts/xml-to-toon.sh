#!/bin/bash
#
# xml-to-toon.sh - Convert XML to TOON format
#
# Usage:
#   cat input.xml | ./xml-to-toon.sh
#   ./xml-to-toon.sh input.xml
#   ./xml-to-toon.sh input.xml -o output.toon
#   ./xml-to-toon.sh input.xml --stats
#
# Options:
#   -o, --output FILE   Write output to file instead of stdout
#   --stats             Show token savings statistics
#   --json-only         Only convert XML to JSON (skip TOON conversion)
#   -h, --help          Show this help message

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT=""
STATS=""
JSON_ONLY=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--output)
      OUTPUT="$2"
      shift 2
      ;;
    --stats)
      STATS="--stats"
      shift
      ;;
    --json-only)
      JSON_ONLY="1"
      shift
      ;;
    -h|--help)
      head -20 "$0" | tail -18 | sed 's/^# //' | sed 's/^#//'
      exit 0
      ;;
    *)
      INPUT="$1"
      shift
      ;;
  esac
done

# Read input
if [[ -n "$INPUT" ]]; then
  XML_DATA=$(cat "$INPUT")
else
  XML_DATA=$(cat)
fi

# Convert XML to JSON
JSON_DATA=$(echo "$XML_DATA" | node "$SCRIPT_DIR/xml-to-json.mjs")

# Output JSON only if requested
if [[ -n "$JSON_ONLY" ]]; then
  if [[ -n "$OUTPUT" ]]; then
    echo "$JSON_DATA" > "$OUTPUT"
  else
    echo "$JSON_DATA"
  fi
  exit 0
fi

# Convert JSON to TOON
if [[ -n "$OUTPUT" ]]; then
  echo "$JSON_DATA" | npx @toon-format/cli -o "$OUTPUT" $STATS
else
  echo "$JSON_DATA" | npx @toon-format/cli $STATS
fi
