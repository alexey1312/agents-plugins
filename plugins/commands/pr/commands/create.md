---
description: Create GitHub PR with auto-generated summary from branch changes
allowed-tools: Bash(git *), Bash(gh *), Read, Glob, Grep
version: 1.0.0
---

# PR Create

Create a GitHub Pull Request with auto-generated title and description based on branch changes.

## Arguments

- `--draft` — create as draft PR
- `--base <branch>` — target branch (default: main)
- `--lang <code>` — output language: `en`, `ru`, `es`, `de`, `fr`, etc. (default: `en`)

## Instructions

1. **Get current branch**:

   ```bash
   git branch --show-current
   ```

   If on `main` or `master` — stop with error: "Cannot create PR from base branch".

2. **Ensure branch is pushed**:

   ```bash
   git fetch origin
   git rev-parse --verify origin/<branch> 2>/dev/null
   ```

   If branch not on remote, push it:

   ```bash
   git push -u origin <branch>
   ```

3. **Get changes for summary**:

   ```bash
   git log origin/<base>..HEAD --oneline
   git diff origin/<base>...HEAD --stat
   ```

4. **Extract Task ID** from branch name using pattern `[A-Z]+-[0-9]+`:

   - `feature/PL-19452-description` -> `PL-19452`
   - `fix/COUR-8147-bug` -> `COUR-8147`

5. **Generate PR content**:

   - **Title**: If Task ID found: `{TASK_ID}: {description}` (e.g., "PL-19452: Add user authentication"). Otherwise: just the description in imperative mood.
   - **Body**: structured markdown with changes list

6. **Humanize text**: Run `/humanizer` on the generated title and body to remove AI writing patterns before creating the PR. Keep the Task ID prefix in the title intact.

7. **Create PR**:

   ```bash
   gh pr create \
     --base <base> \
     --title "<title>" \
     --body "<body>" \
     [--draft]
   ```

## Body Format

```markdown
## Task ID

{TASK_ID}

## Description

<1-2 sentences: what changed and why>

- <change 1>
- <change 2>
```

## Rules

- Write title and body in the language specified by `--lang` (default: English)
- If Task ID found, title MUST start with it: `{TASK_ID}: {description}`
- Title description in imperative mood (NOT past tense)
- Task ID section in body is optional — include only if ID found in branch name
- Default base branch: `main`
- Auto-push branch if not on remote
- Show PR URL after successful creation
