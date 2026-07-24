# mcp-connectors-plugin

A Claude Code plugin that bundles a set of popular **app MCP connectors** into
one place. Loading the plugin registers every server in `.mcp.json` at once, so
you don't have to add them to each project's `.mcp.json` by hand.

> **Not** Composio's `connect-apps` plugin. This is a plain, home-grown bundle
> of standard MCP servers with no third-party middleman. It was renamed from
> `connect-apps` to avoid colliding with Composio's plugin of that name.

```bash
claude --plugin-dir ./mcp-connectors-plugin
```

`--plugin-dir` loads the plugin for the current session only. Each MCP server
goes through the normal per-server approval prompt the first time it's used,
exactly like a server declared in a project `.mcp.json`.

## What's bundled

| Server       | Type   | Auth                          | What it connects |
| ------------ | ------ | ----------------------------- | ---------------- |
| `filesystem` | stdio  | none                          | Read/write files under the current project dir (`@modelcontextprotocol/server-filesystem`, run via `npx`) |
| `github`     | http   | `GITHUB_MCP_PAT` **or** OAuth | GitHub repos, issues, PRs, Actions (official remote server) |

Trimmed to just the connectors in use. Add more later by following the shapes
in [Customizing the bundle](#customizing-the-bundle).

## Credentials

No secrets are stored in this repo. `github` gets its credential one of two ways:

- **Token**: set `GITHUB_MCP_PAT` before launching. `.mcp.json` expands `${VAR}`
  from your environment.

  ```bash
  export GITHUB_MCP_PAT=ghp_your_token_here      # a GitHub personal access token
  claude --plugin-dir ./mcp-connectors-plugin
  ```

  The `:-` in `${GITHUB_MCP_PAT:-}` means an unset variable expands to empty
  rather than breaking the whole file — the server just won't authenticate
  until you set it.
- **OAuth**: GitHub's remote server also supports OAuth, so `github` works
  without the PAT — it'll prompt you to log in on first use.

`filesystem` needs no credentials.

## Customizing the bundle

`.mcp.json` is strict JSON, so it can't hold comments — edit the file to add or
remove servers. To **drop** a connector, delete its object from `mcpServers`. To
**add** one, follow the same shape:

- Remote server: `{ "type": "http" | "sse", "url": "...", "headers": { ... } }`
- Local server: `{ "type": "stdio", "command": "...", "args": [ ... ] }`

Path placeholders you can use inside values:

- `${CLAUDE_PROJECT_DIR}` — the current project root
- `${CLAUDE_PLUGIN_ROOT}` — this plugin's own directory (for bundled scripts)

After editing, run `/reload-plugins` inside a session to pick up changes, or
relaunch Claude Code.

## Structure

```
mcp-connectors-plugin/
├── .claude-plugin/
│   └── plugin.json     # manifest (name, description, version)
└── .mcp.json           # the bundled MCP server definitions
```

## Loading it permanently

`--plugin-dir` is per-session. To keep these connectors without passing the flag
every time, install the plugin through a marketplace, or move the servers you
want into your project's own `.mcp.json` or your user `~/.claude.json`. See the
[Claude Code plugin docs](https://code.claude.com/docs/en/plugins).
