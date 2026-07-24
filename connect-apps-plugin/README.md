# connect-apps-plugin

A Claude Code plugin that bundles a set of popular **app MCP connectors** into
one place. Loading the plugin registers every server in `.mcp.json` at once, so
you don't have to add them to each project's `.mcp.json` by hand.

```bash
claude --plugin-dir ./connect-apps-plugin
```

`--plugin-dir` loads the plugin for the current session only. Each MCP server
goes through the normal per-server approval prompt the first time it's used,
exactly like a server declared in a project `.mcp.json`.

## What's bundled

| Server       | Type   | Auth                          | What it connects |
| ------------ | ------ | ----------------------------- | ---------------- |
| `filesystem` | stdio  | none                          | Read/write files under the current project dir (`@modelcontextprotocol/server-filesystem`, run via `npx`) |
| `github`     | http   | `GITHUB_MCP_PAT` **or** OAuth | GitHub repos, issues, PRs, Actions (official remote server) |
| `notion`     | http   | OAuth (prompted on first use) | Notion pages and databases |
| `linear`     | sse    | OAuth (prompted on first use) | Linear issues and projects |
| `sentry`     | http   | OAuth (prompted on first use) | Sentry issues and error events |
| `stripe`     | http   | `STRIPE_SECRET_KEY`           | Stripe customers, payments, products |
| `atlassian`  | sse    | OAuth (prompted on first use) | Jira and Confluence |

These are **starting examples** — a "connect apps" starter kit. Keep the ones
you use, delete the rest.

## Credentials

No secrets are stored in this repo. Servers get their credentials one of two ways:

- **OAuth servers** (`notion`, `linear`, `sentry`, `atlassian`): Claude Code
  opens a browser login the first time you use the server. Nothing to configure.
- **Token servers** (`github`, `stripe`): set an environment variable before
  launching. `.mcp.json` expands `${VAR}` from your environment.

  ```bash
  export GITHUB_MCP_PAT=ghp_your_token_here      # a GitHub personal access token
  export STRIPE_SECRET_KEY=sk_live_or_test_key   # a Stripe secret key
  claude --plugin-dir ./connect-apps-plugin
  ```

  The `:-` in `${GITHUB_MCP_PAT:-}` means an unset variable expands to empty
  rather than breaking the whole file — that server just won't authenticate
  until you set it. (GitHub's remote server also supports OAuth, so `github`
  works without the PAT if you'd rather log in.)

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
connect-apps-plugin/
├── .claude-plugin/
│   └── plugin.json     # manifest (name, description, version)
└── .mcp.json           # the bundled MCP server definitions
```

## Loading it permanently

`--plugin-dir` is per-session. To keep these connectors without passing the flag
every time, install the plugin through a marketplace, or move the servers you
want into your project's own `.mcp.json` or your user `~/.claude.json`. See the
[Claude Code plugin docs](https://code.claude.com/docs/en/plugins).
