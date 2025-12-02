#!/usr/bin/env node
/**
 * Convert Figma MCP XML output to JSON
 * Usage: cat figma-output.xml | node figma-xml-to-json.mjs
 *        node figma-xml-to-json.mjs < figma-output.xml
 *        node figma-xml-to-json.mjs input.xml
 */

import { readFileSync } from 'fs';

// Read input from file argument or stdin
const input = process.argv[2]
  ? readFileSync(process.argv[2], 'utf8')
  : readFileSync(0, 'utf8');

/**
 * Parse attribute string into object
 */
function parseAttributes(attrString) {
  const attrs = {};
  const attrRegex = /(\w+(?:-\w+)*)="([^"]*)"/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const [, key, value] = match;
    // Convert numeric values
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      attrs[key] = parseFloat(value);
    } else if (value === 'true') {
      attrs[key] = true;
    } else if (value === 'false') {
      attrs[key] = false;
    } else {
      attrs[key] = value;
    }
  }
  return attrs;
}

/**
 * Parse Figma MCP XML-like output to JSON with proper nesting
 */
function parseFigmaXml(xml) {
  const children = [];

  // Match opening tags with their content (greedy matching for nested)
  // This regex handles both self-closing and paired tags
  let pos = 0;

  while (pos < xml.length) {
    // Skip whitespace
    while (pos < xml.length && /\s/.test(xml[pos])) pos++;
    if (pos >= xml.length) break;

    // Look for opening tag
    if (xml[pos] !== '<') {
      pos++;
      continue;
    }

    // Skip closing tags
    if (xml[pos + 1] === '/') {
      const closeEnd = xml.indexOf('>', pos);
      if (closeEnd === -1) break;
      pos = closeEnd + 1;
      continue;
    }

    // Parse tag name
    const tagStart = pos + 1;
    let tagEnd = tagStart;
    while (tagEnd < xml.length && /[\w-]/.test(xml[tagEnd])) tagEnd++;
    const tagName = xml.slice(tagStart, tagEnd);

    if (!tagName) {
      pos++;
      continue;
    }

    // Find end of opening tag
    let attrEnd = tagEnd;
    let depth = 1;
    let inQuote = false;

    while (attrEnd < xml.length && depth > 0) {
      const char = xml[attrEnd];
      if (char === '"') inQuote = !inQuote;
      if (!inQuote) {
        if (char === '>' || (char === '/' && xml[attrEnd + 1] === '>')) {
          depth = 0;
        }
      }
      attrEnd++;
    }

    const isSelfClosing = xml[attrEnd - 2] === '/';
    const attrString = xml.slice(tagEnd, isSelfClosing ? attrEnd - 2 : attrEnd - 1);

    // Create element
    const element = {
      type: tagName,
      ...parseAttributes(attrString)
    };

    if (!isSelfClosing) {
      // Find matching closing tag and parse nested content
      const closingTag = `</${tagName}>`;
      let nestDepth = 1;
      let searchPos = attrEnd;

      while (searchPos < xml.length && nestDepth > 0) {
        const openIdx = xml.indexOf(`<${tagName}`, searchPos);
        const closeIdx = xml.indexOf(closingTag, searchPos);

        if (closeIdx === -1) break;

        if (openIdx !== -1 && openIdx < closeIdx) {
          // Check if it's actually an opening tag (not <tagName-something>)
          const charAfter = xml[openIdx + tagName.length + 1];
          if (charAfter === ' ' || charAfter === '>' || charAfter === '/') {
            nestDepth++;
          }
          searchPos = openIdx + 1;
        } else {
          nestDepth--;
          if (nestDepth === 0) {
            const innerContent = xml.slice(attrEnd, closeIdx);
            if (innerContent.trim()) {
              const nested = parseFigmaXml(innerContent);
              if (nested.length > 0) {
                element.children = nested;
              }
            }
            attrEnd = closeIdx + closingTag.length;
          } else {
            searchPos = closeIdx + 1;
          }
        }
      }
    }

    children.push(element);
    pos = attrEnd;
  }

  return children;
}

/**
 * Group children by type for better TOON compression
 */
function optimizeForToon(elements) {
  if (!Array.isArray(elements) || elements.length === 0) {
    return elements;
  }

  // Recursively optimize nested children
  for (const el of elements) {
    if (el.children) {
      el.children = optimizeForToon(el.children);
    }
  }

  // If single element, return as-is (will be root)
  if (elements.length === 1) {
    return elements[0];
  }

  // Check if all elements have same fields (uniform array)
  const types = new Set(elements.map(e => e.type));

  if (types.size === 1) {
    // All same type - keep as array for tabular TOON format
    return elements;
  }

  // Group by type for mixed elements
  const grouped = {};
  for (const el of elements) {
    const key = el.type + 's';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(el);
  }

  return grouped;
}

// Parse and output
try {
  const parsed = parseFigmaXml(input);
  const optimized = optimizeForToon(parsed);
  console.log(JSON.stringify(optimized, null, 2));
} catch (error) {
  console.error('Error parsing Figma XML:', error.message);
  process.exit(1);
}
