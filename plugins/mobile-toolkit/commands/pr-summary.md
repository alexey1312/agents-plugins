---
description: Generate PR summary from branch changes for GitHub
allowed-tools: Bash(git *), Read, Glob, Grep
version: 1.0
---

# PR Summary Generator

Generate a concise PR summary in English based on branch changes.

## Instructions

1. **Get branch info and changes**:

   ```bash
   git branch --show-current
   git fetch origin
   git log origin/develop..HEAD --oneline
   git diff origin/develop...HEAD --stat
   ```

2. **Extract Task ID** from branch name using pattern `[A-Z]+-[0-9]+`:

   - `feature/PL-19452-description` → `PL-19452`
   - `fix/COUR-8147-bug` → `COUR-8147`

3. **Generate summary** in the format below, wrapped in code block for easy copy-paste.

## Output Format

```markdown
## Title
<imperative mood, max 50 chars: "Add", "Fix", "Update", "Remove">

## Task ID
[{TASK_ID}](https://indriver.atlassian.net/browse/{TASK_ID})

## Description
<1-2 sentences: what changed and why>

- <change 1>
- <change 2>
```

## Rules

- English only, formal tone
- Title in imperative mood (NOT past tense)
- Task ID as markdown link: `[PL-123](https://indriver.atlassian.net/browse/PL-123)`
- Wrap output in triple backticks for copy-paste
