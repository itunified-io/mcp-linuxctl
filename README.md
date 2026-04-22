# @itunified.io/mcp-linuxctl

> MCP server for `linuxctl` — 39 tools wrapping the Linux host configuration CLI via `execFile`

[![npm](https://img.shields.io/npm/v/@itunified.io/mcp-linuxctl)](https://www.npmjs.com/package/@itunified.io/mcp-linuxctl)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)
[![Glama Security](https://glama.ai/mcp/servers/@itunified-io/mcp-linuxctl/badge)](https://glama.ai/mcp/servers/@itunified-io/mcp-linuxctl)
[![Glama License](https://glama.ai/mcp/servers/@itunified-io/mcp-linuxctl/license-badge)](https://glama.ai/mcp/servers/@itunified-io/mcp-linuxctl)
[![Glama Quality](https://glama.ai/mcp/servers/@itunified-io/mcp-linuxctl/quality-badge)](https://glama.ai/mcp/servers/@itunified-io/mcp-linuxctl)

A thin TypeScript MCP adapter for the [`linuxctl`](https://github.com/itunified-io/linuxctl) Go binary — a declarative Linux host configuration tool covering disks, users, packages, services, mounts, sysctl, limits, firewall, and /etc/hosts with a unified plan/apply/verify/rollback workflow.

## Architecture

```
LLM ←→ MCP Protocol ←→ This Adapter ←→ execFile("linuxctl ...") ←→ Target Host (SSH + sudo)
```

- **Layer 0**: `linuxctl` Go binary (works without AI)
- **Layer 1**: This MCP adapter (TypeScript, Zod schemas, MCP protocol)
- **Layer 2**: AI skills (Claude Code, IDE integrations)

All mutating operations are guarded by confirm levels enforced by the Go binary:

| Confirm level | Tools |
|---------------|-------|
| none          | *_plan, *_verify, config_*, diff, license_status |
| standard      | user_apply, package_apply, service_apply, mount_apply, sysctl_apply, limits_apply, firewall_apply, hosts_apply, apply_apply |
| standard+echo | disk_apply |
| double-confirm| apply_rollback |

## Prerequisites

- Node.js ≥ 20
- `linuxctl` binary on `PATH` (download from [linuxctl releases](https://github.com/itunified-io/linuxctl/releases))
- SSH access + sudo rights on the target host
- A license at `~/.linuxctl/license.jwt`

Override the binary path via `LINUXCTL_BINARY` env var if not on `PATH`.

## Installation

```bash
npm install -g @itunified.io/mcp-linuxctl
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "linuxctl": {
      "command": "npx",
      "args": ["-y", "@itunified.io/mcp-linuxctl"]
    }
  }
}
```

## Tool Catalog (39)

> **Note:** In `linuxctl` v2026.04.11.8 the CLI verb `env` was renamed to `stack`.
> MCP tools follow suit: the 7 stack tools are exposed as `linuxctl_stack_*`.


| Tool | linuxctl | Confirm |
|------|----------|---------|
| `linuxctl_config_validate` | `config validate` | none |
| `linuxctl_config_render` | `config render` | none |
| `linuxctl_disk_plan` | `disk plan` | none |
| `linuxctl_disk_apply` | `disk apply` | standard+echo |
| `linuxctl_disk_verify` | `disk verify` | none |
| `linuxctl_user_plan` | `user plan` | none |
| `linuxctl_user_apply` | `user apply` | standard |
| `linuxctl_user_verify` | `user verify` | none |
| `linuxctl_package_plan` | `package plan` | none |
| `linuxctl_package_apply` | `package apply` | standard |
| `linuxctl_package_verify` | `package verify` | none |
| `linuxctl_service_plan` | `service plan` | none |
| `linuxctl_service_apply` | `service apply` | standard |
| `linuxctl_service_verify` | `service verify` | none |
| `linuxctl_mount_plan` | `mount plan` | none |
| `linuxctl_mount_apply` | `mount apply` | standard |
| `linuxctl_mount_verify` | `mount verify` | none |
| `linuxctl_sysctl_plan` | `sysctl plan` | none |
| `linuxctl_sysctl_apply` | `sysctl apply` | standard |
| `linuxctl_limits_plan` | `limits plan` | none |
| `linuxctl_limits_apply` | `limits apply` | standard |
| `linuxctl_firewall_plan` | `firewall plan` | none |
| `linuxctl_firewall_apply` | `firewall apply` | standard |
| `linuxctl_hosts_plan` | `hosts plan` | none |
| `linuxctl_hosts_apply` | `hosts apply` | standard |
| `linuxctl_apply_plan` | `apply plan` | none |
| `linuxctl_apply_apply` | `apply apply` | standard |
| `linuxctl_apply_verify` | `apply verify` | none |
| `linuxctl_apply_rollback` | `apply rollback` | double-confirm |
| `linuxctl_diff` | `diff` | none |
| `linuxctl_ssh_setup_cluster` | `ssh setup-cluster` | standard |
| `linuxctl_stack_new` | `stack new` | none |
| `linuxctl_stack_list` | `stack list` | none |
| `linuxctl_stack_use` | `stack use` | none |
| `linuxctl_stack_current` | `stack current` | none |
| `linuxctl_stack_add` | `stack add` | none |
| `linuxctl_stack_remove` | `stack remove` | none |
| `linuxctl_stack_show` | `stack show` | none |
| `linuxctl_license_status` | `license status` | none |

## Skills

Claude Code skills shipped with this MCP adapter (under `.claude/skills/`):

| Skill | Description |
|-------|-------------|
| `/linuxctl-stack-apply <stack>` | Run the 13-manager orchestrator across every host in the stack (plan → apply → verify). |
| `/linuxctl-stack-diff <stack>` | Read-only drift report aggregated across all hosts in the stack. |
| `/linuxctl-stack-rollback <stack>` | Double-confirmed rollback of the last apply on every host. |
| `/linuxctl-stack-cluster-ssh <stack>` | Set up passwordless SSH trust (default users: `grid`, `oracle`) across the stack. |

See [`.claude/skills/README.md`](.claude/skills/README.md) for detailed references.

## Development

```bash
npm install
npm run build
npm run lint
```

## License

AGPL-3.0 — see [LICENSE](LICENSE).

---

Built by [ITUNIFIED GmbH](https://itunified.io)
