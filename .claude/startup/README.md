# Startup folder (the staging inbox)

Drop new Claude Code assets here and they get **filed into their real home the
next time a session starts** — automatically, by the `SessionStart` hook at
`.claude/hooks/session-start.sh`.

The point is token cost: the moving/merging happens in a shell hook (~0
model-context tokens) instead of as a conversation where Claude reads and
relocates files by hand.

## How to use it

Put things in the matching inbox, then start (or resume) a session:

| Drop here                          | Gets filed to                     |
| ---------------------------------- | --------------------------------- |
| `.claude/startup/skills/<name>/`   | `.claude/skills/<name>/`          |
| `.claude/startup/plugins/<name>/`  | `<repo-root>/<name>/`             |
| `.claude/startup/mcp/<x>.json`     | merged into `<repo-root>/.mcp.json` |

An MCP fragment is either `{"mcpServers": { ... }}` or a bare
`{"<server-name>": { ... }}` map.

## Behavior

- **Consumed on filing.** Each staged item is *moved*, not copied, so the inbox
  empties as it's processed and a second run does nothing.
- **Overwrites on update.** Re-staging an item with the same name replaces the
  destination — the startup folder wins, so it's the place to push updates from.
- **Idempotent & safe.** An empty inbox is a fast no-op. A malformed MCP
  fragment is skipped (never merged) and noted in `last-run.log`.
- **`last-run.log`** records what the last run filed. It's git-ignored.

## Run it by hand

```bash
CLAUDE_PROJECT_DIR="$(git rev-parse --show-toplevel)" .claude/hooks/session-start.sh manual
```

Already-placed skills and plugins don't need to pass back through here — this is
for *new* additions and updates.
