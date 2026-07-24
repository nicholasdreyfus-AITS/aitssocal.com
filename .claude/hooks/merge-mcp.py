#!/usr/bin/env python3
"""Merge an MCP fragment's servers into a target .mcp.json (created if absent).

Usage: merge-mcp.py <target .mcp.json> <fragment.json>

A fragment is either {"mcpServers": {...}} or a bare {"<name>": {...}} map.
Exits non-zero (without touching the target) if the fragment can't be read as
a server map, so the hook can skip it instead of corrupting the config.
"""
import json
import sys


def load(path):
    try:
        with open(path) as fh:
            return json.load(fh)
    except FileNotFoundError:
        return {}
    except ValueError:
        return None  # malformed JSON


def main():
    if len(sys.argv) != 3:
        return 2
    target_path, frag_path = sys.argv[1], sys.argv[2]

    target = load(target_path)
    frag = load(frag_path)
    if target is None or not isinstance(target, dict):
        target = {}
    if frag is None or not isinstance(frag, dict):
        return 1  # unreadable fragment; hook skips it

    servers = frag.get("mcpServers", frag)
    if not isinstance(servers, dict) or not servers:
        return 1

    target.setdefault("mcpServers", {})
    if not isinstance(target["mcpServers"], dict):
        return 1
    target["mcpServers"].update(servers)

    with open(target_path, "w") as out:
        json.dump(target, out, indent=2)
        out.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
