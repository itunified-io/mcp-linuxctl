# Changelog

All notable changes to this project will be documented in this file.

## v2026.04.11.3 — 2026-04-22

### Changed (BREAKING)
- Tool prefix: `linuxctl_env_*` → `linuxctl_stack_*` (7 tools) — matches upstream linuxctl v2026.04.11.8

### Added — /stack-* skills
- /linuxctl-stack-apply, /linuxctl-stack-diff, /linuxctl-stack-rollback, /linuxctl-stack-cluster-ssh

### Details
- 7 stack tools wrap the upstream `linuxctl stack` verb: `linuxctl_stack_new`, `_list`, `_use`,
  `_current`, `_add`, `_remove`, `_show`.
- Tool count: 32 → 39.
- Bumped version `2026.4.11-2` → `2026.4.11-3`.

Ref: itunified-io/infrastructure#389

## v2026.04.11.2 — 2026-04-22

Added `linuxctl_ssh_setup_cluster` tool (32 tools total).

- SSH: `linuxctl_ssh_setup_cluster` — wraps `linuxctl ssh setup-cluster <env.yaml>`, sets up
  passwordless SSH across a cluster for the given users (default: `grid`, `oracle`). Generates
  keys where missing and distributes `authorized_keys` across all hosts. Standard confirm gate
  (creates SSH keys + mutates `authorized_keys`).
- Params: `env` (yaml path, required), `users` (string[], optional, default `["grid","oracle"]`),
  `parallel` (bool, optional, default true).
- Bumped version `2026.4.11-1` → `2026.4.11-2`.

Closes itunified-io/mcp-linuxctl#1 (ssh setup-cluster).
Ref: itunified-io/infrastructure#389

## v2026.04.11.1 — 2026-04-22

Initial scaffold. 31 tools wrapping the `linuxctl` Linux host configuration CLI via `execFile`.

- Config: `linuxctl_config_validate`, `linuxctl_config_render`
- Disk: `linuxctl_disk_plan`, `linuxctl_disk_apply`, `linuxctl_disk_verify`
- User: `linuxctl_user_plan`, `linuxctl_user_apply`, `linuxctl_user_verify`
- Package: `linuxctl_package_plan`, `linuxctl_package_apply`, `linuxctl_package_verify`
- Service: `linuxctl_service_plan`, `linuxctl_service_apply`, `linuxctl_service_verify`
- Mount: `linuxctl_mount_plan`, `linuxctl_mount_apply`, `linuxctl_mount_verify`
- Sysctl: `linuxctl_sysctl_plan`, `linuxctl_sysctl_apply`
- Limits: `linuxctl_limits_plan`, `linuxctl_limits_apply`
- Firewall: `linuxctl_firewall_plan`, `linuxctl_firewall_apply`
- Hosts: `linuxctl_hosts_plan`, `linuxctl_hosts_apply`
- Orchestrator: `linuxctl_apply_plan`, `linuxctl_apply_apply`, `linuxctl_apply_verify`, `linuxctl_apply_rollback`, `linuxctl_diff`
- License: `linuxctl_license_status`

Phase 1 of the proxclt + linuxctl plan. Closes #1.
Ref: itunified-io/infrastructure#389
See: infrastructure/docs/plans/025-linuxctl-design.md
