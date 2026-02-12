---
name: branch-recall
description: >
  Recovers context of the current git branch by analyzing commits, changed files, and diffs
  since diverging from main. Use when resuming work on an existing feature branch or
  onboarding to unfamiliar branch changes. Supports --deep flag for full file reading.
---

# Branch Recall

Recover context of the current git branch — understand what was done before and continue working with full awareness.

## Workflow

### Step 1: Identify the branch and base

```bash
# Current branch name
git branch --show-current

# Find the merge base with main (or master)
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

If on `main`/`master`, inform the user that there's no feature branch to recall and stop.

### Step 2: Commit history

Show all commits on this branch since it diverged from the base branch:

```bash
git log --oneline --reverse main..HEAD 2>/dev/null || git log --oneline --reverse master..HEAD 2>/dev/null
```

### Step 3: Changed files overview

```bash
# File stats — what was added, modified, deleted
git diff --stat main...HEAD 2>/dev/null || git diff --stat master...HEAD 2>/dev/null

# List of changed files with status (A/M/D/R)
git diff --name-status main...HEAD 2>/dev/null || git diff --name-status master...HEAD 2>/dev/null
```

### Step 4: Key diffs

Show the actual diff to understand what changed:

```bash
git diff main...HEAD 2>/dev/null || git diff master...HEAD 2>/dev/null
```

If the diff is very large (>500 lines), summarize by file instead of showing the full diff. Use `--stat` and then read only the most important changed files.

### Step 5 (--deep mode only): Read key files

If the user invoked with `--deep` argument:

1. Identify the top 5-7 most significant changed files (by diff size or importance)
2. Read each file in full using the Read tool
3. Build a deeper understanding of the current state of the code

Skip this step in default mode to preserve context window.

### Step 6: Synthesize context

Present a structured summary:

```
## Branch: <branch-name>
## Base: <base-branch> (diverged <N> commits ago)

### What was done
- <High-level summary of changes based on commits and diffs>

### Changed files (<N> files)
- **Added:** <list>
- **Modified:** <list>
- **Deleted:** <list>

### Current state
- <What appears to be in progress or incomplete>
- <Any TODO/FIXME markers found in the diff>

### Suggested next steps
- <Based on the changes, what likely needs to be done next>
```

## Important

- Always use three-dot diff (`main...HEAD`) to see changes relative to the merge base, not two-dot
- If there are uncommitted changes, mention them separately using `git status` and `git diff` (unstaged)
- Look for TODO, FIXME, HACK, XXX markers in the diff to identify incomplete work
- Check for failing tests if test files were modified
- Preserve the summary as working context for the rest of the conversation
