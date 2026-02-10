---
description: Generate PR summary from branch changes for GitHub
allowed-tools: Bash(git *), Read, Glob, Grep
version: 1.1
---

# PR Summary Generator

Generate a concise PR summary based on branch changes.

## Arguments

- `--lang <code>` — output language: `en`, `ru`, `es`, `de`, `fr`, etc. (default: `en`)

## Instructions

1. **Get branch info and changes**:

   ```bash
   git branch --show-current
   git fetch origin
   git log origin/main..HEAD --oneline
   git diff origin/main...HEAD --stat
   ```

2. **Extract Task ID** from branch name using pattern `[A-Z]+-[0-9]+`:

   - `feature/PL-19452-description` -> `PL-19452`
   - `fix/COUR-8147-bug` -> `COUR-8147`
   - If no Task ID found, skip the Task ID section

3. **Generate summary** in the format below.

4. **Humanize text**: Run `/humanizer` on the generated title and description to remove AI writing patterns before presenting to the user.

5. **Present** the final summary wrapped in code block for easy copy-paste.

## Output Format

```markdown
## Title

<imperative mood, max 50 chars: "Add", "Fix", "Update", "Remove">

## Task ID

{TASK_ID}

## Description

<1-2 sentences: what changed and why>

- <change 1>
- <change 2>
```

## Rules

- Write output in the language specified by `--lang` (default: English)
- Title in imperative mood (NOT past tense)
- Task ID section is optional — include only if ID found in branch name
- Wrap output in triple backticks for copy-paste
