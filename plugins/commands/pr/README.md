# PR Plugin

GitHub PR workflow: create PRs and generate summaries.

## Commands

### `/pr:summary`

Generate PR summary from branch changes.

```bash
/pr:summary
```

**Features:**

- Extracts Task ID from branch name (e.g., `PL-19452`, `COUR-8147`)
- Generates formatted PR description
- Output wrapped in code block for copy-paste

### `/pr:create`

Create GitHub PR with auto-generated summary.

```bash
/pr:create
/pr:create --draft
/pr:create --base develop
```

**Features:**

- Auto-generates title and description from commits
- Task ID prefix in title when found in branch name
- Auto-pushes branch if not on remote
- Creates PR via GitHub CLI

## Dependencies

Requires `humanizer` plugin (included in this marketplace):

```bash
/plugin install humanizer@aleksei-plugins
```

## Supported Branch Formats

- `feature/PL-19452-description`
- `fix/COUR-8147-bug-fix`
- `hotfix/DRIVER-123-urgent`
- Any branch without Task ID also works
