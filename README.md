# Secret Santa Issue GitHub Action

[![Create Secret Santa Issue](https://github.com/your-username/your-repo/actions/workflows/create-santa-issue.yml/badge.svg)](https://github.com/your-username/your-repo/actions/workflows/create-santa-issue.yml)

This GitHub Action automatically creates a "Secret Santa" issue on your repository. It scans your repository's git history for all contributors since the beginning of the current year, generates a participant list, and posts it in a new issue.

This is a great way to organize a fun team event and celebrate the year's contributions!

## How It Works

The action is a Node.js script that:
1.  Fetches all unique commit authors since January 1st of the current year using `git log`.
2.  Filters out common bot accounts.
3.  Constructs a Markdown-formatted issue body.
4.  Uses the **GitHub CLI (`gh`)** to create a new issue on your repository.

## Usage

To use this action, create a workflow file (e.g., `.github/workflows/secret-santa.yml`) in your repository.

Here is a basic example:

```yaml
name: 'Create Secret Santa Issue'

on:
  # Run it manually from the Actions tab
  workflow_dispatch:
  # Or run it on a schedule (e.g., every year on November 20th)
  # schedule:
  #   - cron: '0 0 20 11 *'

jobs:
  create_issue:
    runs-on: ubuntu-latest
    # Permissions needed to create an issue and read git history
    permissions:
      issues: write
      contents: read
    steps:
      # 1. Check out your repository code to access git history
      - name: Check out code
        uses: actions/checkout@v4
        with:
          # Fetch all history to find all contributors
          fetch-depth: 0

      # 2. Run the Secret Santa Action
      - name: Generate and Create Secret Santa Issue
        uses: your-username/your-repo@v1 # <-- IMPORTANT: Change this to your repo
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          issue-title: '🎅 Secret Santa {YEAR} is coming!'
          deadline: 'December 10th'
          budget: '25 USD'
```

**Important:** Remember to replace `your-username/your-repo@v1` with the actual path to your action's repository and the version you want to use (e.g., `adriens/gh-action-issue-secret-santa@v1`).

## Inputs

The following inputs can be configured:

| Input          | Description                                                                        | Required | Default                  |
|----------------|------------------------------------------------------------------------------------|----------|--------------------------|
| `github-token` | The `GITHUB_TOKEN` used to authenticate with the GitHub API to create the issue.   | `true`   | `${{ secrets.GITHUB_TOKEN }}` |
| `issue-title`  | The title for the issue. Use `{YEAR}` as a placeholder for the current year.       | `false`  | `🎅 Secret Santa {YEAR}` |
| `deadline`     | The participation deadline to be mentioned in the issue body.                      | `false`  | `December 5th`           |
| `budget`       | The suggested gift budget to be mentioned in the issue body.                       | `false`  | `20€`                    |

## Permissions

This action requires the following permissions to be set in your workflow file:
- `issues: write`: To allow the action to create an issue on the repository.
- `contents: read`: To allow the action to check out the code and read the git log.

```yaml
permissions:
  issues: write
  contents: read
```

## License

This project is licensed under the [MIT License](LICENSE).
