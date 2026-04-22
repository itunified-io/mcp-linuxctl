# Skills — mcp-linuxctl

Claude Code skills for the `linuxctl` MCP adapter. Each skill wraps a multi-step
workflow that operates on a **stack** (a group of hosts defined by an `env.yaml`
+ layer files under `infrastructure/envs/<stack>/`).

All skills use MCP tools from this server — never shell out to `linuxctl`
directly.

| Skill | Slash Command | Description |
|-------|--------------|-------------|
| Stack apply   | `/linuxctl-stack-apply <stack>`       | Run the 13-manager orchestrator across every host in the stack (plan → apply → verify). |
| Stack diff    | `/linuxctl-stack-diff <stack>`        | Read-only drift report aggregated across all hosts in the stack. |
| Stack rollback| `/linuxctl-stack-rollback <stack>`    | Double-confirmed rollback of the last apply on every host. |
| Cluster SSH   | `/linuxctl-stack-cluster-ssh <stack>` | Set up passwordless SSH trust (default users: `grid`, `oracle`) across the stack. |

## Conventions

- Skills follow the four-phase pattern from ADR-0062: pre-flight → execute →
  validate → report.
- Skills resolve the stack via `linuxctl_stack_use` + `linuxctl_stack_show`.
- Mutating skills always run `linuxctl_<domain>_plan` / `linuxctl_diff` first
  and print the diff before applying.
- Rollback uses `linuxctl_apply_rollback` (double-confirm enforced by the
  linuxctl Go binary).
- Cross-node SSH bootstrap uses `linuxctl_ssh_setup_cluster` so key material
  stays on the target hosts.
