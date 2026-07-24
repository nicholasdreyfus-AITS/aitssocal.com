#!/bin/bash
# SessionStart hook — the "startup folder" pipeline.
#
# Anything you drop into .claude/startup/ gets filed into its real home the
# next time a session starts. The filing happens here, in a shell hook, so it
# costs ~0 model-context tokens instead of a back-and-forth in the conversation.
#
# Inbox layout -> destination:
#   .claude/startup/skills/<name>/    ->  .claude/skills/<name>/
#   .claude/startup/plugins/<name>/   ->  <repo-root>/<name>/
#   .claude/startup/mcp/<x>.json      ->  merged into <repo-root>/.mcp.json
#
# Idempotent: each staged item is MOVED (consumed) as it's filed, so a second
# run with an empty inbox is a no-op. Re-staging an item overwrites its
# destination, letting the startup folder act as the source of truth on update.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STAGE="$ROOT/.claude/startup"
LOG="$STAGE/last-run.log"

# Nothing staged -> exit fast and silent (keeps session startup quick & quiet).
[ -d "$STAGE" ] || exit 0

filed=0
: > "$LOG" 2>/dev/null || true
log() { printf '%s\n' "$1" >> "$LOG" 2>/dev/null || true; }
log "startup run (source=${1:-unknown})"

shopt -s nullglob

# 1) Skills
if [ -d "$STAGE/skills" ]; then
  mkdir -p "$ROOT/.claude/skills"
  for src in "$STAGE/skills"/*/; do
    name="$(basename "$src")"
    dest="$ROOT/.claude/skills/$name"
    rm -rf "$dest"
    mv "$src" "$dest"
    log "skill  -> .claude/skills/$name"
    filed=$((filed + 1))
  done
fi

# 2) Plugins
if [ -d "$STAGE/plugins" ]; then
  for src in "$STAGE/plugins"/*/; do
    name="$(basename "$src")"
    dest="$ROOT/$name"
    rm -rf "$dest"
    mv "$src" "$dest"
    log "plugin -> $name/"
    filed=$((filed + 1))
  done
fi

# 3) MCP config fragments
if [ -d "$STAGE/mcp" ]; then
  for frag in "$STAGE/mcp"/*.json; do
    if python3 "$ROOT/.claude/hooks/merge-mcp.py" "$ROOT/.mcp.json" "$frag"; then
      log "mcp    <- merged $(basename "$frag")"
      rm -f "$frag"
      filed=$((filed + 1))
    else
      log "mcp    !! skipped invalid fragment $(basename "$frag")"
    fi
  done
fi

# SessionStart stdout is injected into context, so emit at most one short line.
if [ "$filed" -gt 0 ]; then
  echo "startup: filed $filed item(s) from .claude/startup/ (see last-run.log)"
fi
exit 0
